/**
 * useVotes Hook - Real FHEVM Integration
 * Connects to SimpleVoting_uint32 contract on Sepolia using ethers.js
 */

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { 
  createEncryptedVote, 
  getFheInstance, 
  VOTING_CONTRACT_ADDRESS, 
  VOTING_CONTRACT_ABI 
} from "@/lib/fhevm";

export interface Vote {
  id: string;
  sessionId: number;
  title: string;
  description: string;
  endTime: Date;
  totalVotes: number;
  hasVoted: boolean;
  isActive: boolean;
  resolved: boolean;
  yesVotes: number;
  noVotes: number;
  creator: string;
  revealRequested: boolean;
}

export interface CompletedVote {
  id: string;
  sessionId: number;
  title: string;
  description: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  endedAt: Date;
}

// Session metadata storage (title/description not stored on-chain)
const SESSION_META_KEY = "ciphervote_session_meta";

interface SessionMeta {
  [sessionId: string]: {
    title: string;
    description: string;
  };
}

function getSessionMeta(): SessionMeta {
  try {
    const stored = localStorage.getItem(SESSION_META_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSessionMeta(sessionId: number, title: string, description: string): void {
  const meta = getSessionMeta();
  meta[sessionId.toString()] = { title, description };
  localStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
}

// Public RPC for reading data
const PUBLIC_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';

// Get window with ethereum
const getEthereum = () => (window as any).ethereum;

export function useVotes() {
  const { address, isConnected } = useAccount();
  
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Load sessions from contract
  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const provider = new ethers.JsonRpcProvider(PUBLIC_RPC);
      const contract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS, 
        VOTING_CONTRACT_ABI, 
        provider
      );

      const sessionCount = await contract.getSessionCount();
      const sessionsData: Vote[] = [];
      const sessionMeta = getSessionMeta();

      for (let i = 0; i < Number(sessionCount); i++) {
        try {
          const sessionData = await contract.getSession(i);
          const sessionStruct = await contract.sessions(i);

          let hasVoted = false;
          if (address && getEthereum()) {
            try {
              const walletProvider = new ethers.BrowserProvider(getEthereum());
              const walletContract = new ethers.Contract(
                VOTING_CONTRACT_ADDRESS, 
                VOTING_CONTRACT_ABI, 
                walletProvider
              );
              hasVoted = await walletContract.hasVoted(i, address);
            } catch (e) {
              console.warn('Failed to check hasVoted:', e);
            }
          }

          const endTimeMs = Number(sessionData.endTime) * 1000;
          const isActive = Date.now() < endTimeMs && !sessionData.resolved;
          
          // Get metadata or use defaults
          const meta = sessionMeta[i.toString()] || {
            title: `Voting Session #${i + 1}`,
            description: `On-chain encrypted voting session created by ${sessionData.creator.slice(0, 6)}...${sessionData.creator.slice(-4)}`
          };

          const session: Vote = {
            id: i.toString(),
            sessionId: i,
            title: meta.title,
            description: meta.description,
            endTime: new Date(endTimeMs),
            totalVotes: Number(sessionData.yesVotes) + Number(sessionData.noVotes),
            hasVoted,
            isActive,
            resolved: sessionData.resolved,
            yesVotes: Number(sessionData.yesVotes),
            noVotes: Number(sessionData.noVotes),
            creator: sessionData.creator,
            revealRequested: sessionStruct.revealRequested,
          };

          sessionsData.push(session);
        } catch (err) {
          console.error(`Error loading session ${i}:`, err);
        }
      }

      setVotes(sessionsData);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Load sessions on mount and when dependencies change
  useEffect(() => {
    loadSessions();
  }, [address, loadSessions]);

  // Cast encrypted vote
  const castVote = useCallback(
    async (voteId: string, choice: boolean) => {
      const ethereum = getEthereum();
      if (!address || !ethereum) {
        throw new Error("Wallet not connected");
      }

      const fhe = getFheInstance();
      if (!fhe) {
        throw new Error("FHEVM not initialized. Please wait for initialization.");
      }

      const sessionId = parseInt(voteId);
      
      // Check if already voted
      const vote = votes.find(v => v.id === voteId);
      if (vote?.hasVoted) {
        throw new Error("You have already voted on this proposal");
      }

      setIsLoading(true);

      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          VOTING_CONTRACT_ADDRESS, 
          VOTING_CONTRACT_ABI, 
          signer
        );

        // Create encrypted vote using FHEVM
        console.log('🔐 Encrypting vote...');
        const { encryptedData, proof } = await createEncryptedVote(
          VOTING_CONTRACT_ADDRESS,
          address,
          choice
        );

        console.log('📤 Submitting encrypted vote to contract...');
        
        // Send transaction to contract with high gas for FHE operations
        const tx = await contract.vote(sessionId, encryptedData, proof, { 
          gasLimit: 5000000 
        });

        console.log('⏳ Waiting for transaction confirmation...', tx.hash);
        await tx.wait();

        console.log('✅ Vote submitted successfully!');
        
        // Reload sessions to reflect the vote
        await loadSessions();
        
        return true;
      } catch (err) {
        console.error('Vote failed:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address, votes, loadSessions]
  );

  const checkHasVoted = useCallback(
    (voteId: string) => {
      const vote = votes.find(v => v.id === voteId);
      return vote?.hasVoted ?? false;
    },
    [votes]
  );

  const refreshVotes = useCallback(() => {
    return loadSessions();
  }, [loadSessions]);

  return { 
    votes, 
    castVote, 
    isLoading, 
    checkHasVoted, 
    error,
    refreshVotes,
    isConnected 
  };
}

export function useCompletedVotes() {
  const { votes } = useVotes();
  
  const completedVotes: CompletedVote[] = votes
    .filter(v => v.resolved)
    .map(v => ({
      id: v.id,
      sessionId: v.sessionId,
      title: v.title,
      description: v.description,
      yesVotes: v.yesVotes,
      noVotes: v.noVotes,
      totalVotes: v.totalVotes,
      endedAt: v.endTime,
    }));

  return { completedVotes };
}

export function useCreateVote() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);

  const createVote = useCallback(
    async (title: string, description: string, durationHours: number) => {
      const ethereum = getEthereum();
      if (!address || !ethereum) {
        throw new Error("Wallet not connected");
      }

      setIsCreating(true);

      try {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          VOTING_CONTRACT_ADDRESS, 
          VOTING_CONTRACT_ABI, 
          signer
        );

        // Get current session count before creating
        const beforeCount = await contract.getSessionCount();
        const durationSeconds = durationHours * 60 * 60;

        console.log('📝 Creating new voting session...');
        
        const tx = await contract.createSession(durationSeconds, { 
          gasLimit: 500000 
        });

        console.log('⏳ Waiting for transaction confirmation...', tx.hash);
        await tx.wait();
        
        // Save metadata locally (not stored on-chain)
        const newSessionId = Number(beforeCount);
        saveSessionMeta(newSessionId, title, description);
        
        console.log('✅ Voting session created!', newSessionId);
        
        return { success: true, voteId: newSessionId.toString() };
      } catch (err) {
        console.error('Create vote failed:', err);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [address]
  );

  return { createVote, isCreating };
}
