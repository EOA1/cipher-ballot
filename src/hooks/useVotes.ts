// Mock data and hooks for CipherVote
// In production, this would connect to the Zama FHEVM smart contract

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";

export interface Vote {
  id: string;
  title: string;
  description: string;
  endTime: Date;
  totalVotes: number;
  hasVoted: boolean;
  isActive: boolean;
}

// Mock votes data
const INITIAL_VOTES: Omit<Vote, "hasVoted">[] = [
  {
    id: "1",
    title: "Increase Treasury Allocation for Development",
    description: "Proposal to increase the development fund allocation from 20% to 30% of treasury for Q1 2025.",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalVotes: 42,
    isActive: true,
  },
  {
    id: "2",
    title: "Add New Governance Council Member",
    description: "Vote to add Alice.eth as the 7th member of the governance council with full voting rights.",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    totalVotes: 28,
    isActive: true,
  },
  {
    id: "3",
    title: "Migrate to New Token Standard",
    description: "Proposal to migrate from ERC-20 to ERC-4626 vault standard for improved yield distribution.",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    totalVotes: 156,
    isActive: true,
  },
];

const COMPLETED_VOTES = [
  {
    id: "4",
    title: "Community Grant Program Launch",
    description: "Allocate 50,000 USDC for the Q4 2024 community grants program.",
    yesVotes: 89,
    noVotes: 23,
    totalVotes: 112,
    endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Partnership with Protocol X",
    description: "Form strategic partnership with Protocol X for cross-chain liquidity.",
    yesVotes: 145,
    noVotes: 67,
    totalVotes: 212,
    endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Storage key for tracking votes by wallet
const STORAGE_KEY = "ciphervote_wallet_votes";

interface WalletVotes {
  [walletAddress: string]: string[]; // Array of vote IDs
}

function getWalletVotes(): WalletVotes {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveWalletVote(walletAddress: string, voteId: string): void {
  const walletVotes = getWalletVotes();
  const normalizedAddress = walletAddress.toLowerCase();
  
  if (!walletVotes[normalizedAddress]) {
    walletVotes[normalizedAddress] = [];
  }
  
  if (!walletVotes[normalizedAddress].includes(voteId)) {
    walletVotes[normalizedAddress].push(voteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(walletVotes));
  }
}

function hasWalletVoted(walletAddress: string | undefined, voteId: string): boolean {
  if (!walletAddress) return false;
  
  const walletVotes = getWalletVotes();
  const normalizedAddress = walletAddress.toLowerCase();
  
  return walletVotes[normalizedAddress]?.includes(voteId) ?? false;
}

export function useVotes() {
  const { address } = useAccount();
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Build votes with hasVoted status based on connected wallet
  const votes: Vote[] = INITIAL_VOTES.map((vote) => ({
    ...vote,
    totalVotes: vote.totalVotes + (voteCounts[vote.id] || 0),
    hasVoted: hasWalletVoted(address, vote.id),
  }));

  // Re-check vote status when wallet changes
  useEffect(() => {
    // This triggers a re-render when address changes
  }, [address]);

  const castVote = useCallback(
    async (voteId: string, choice: boolean) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (hasWalletVoted(address, voteId)) {
        throw new Error("You have already voted on this proposal");
      }

      setIsLoading(true);

      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Record the vote for this wallet
      saveWalletVote(address, voteId);

      // Update vote count
      setVoteCounts((prev) => ({
        ...prev,
        [voteId]: (prev[voteId] || 0) + 1,
      }));

      setIsLoading(false);
      return true;
    },
    [address]
  );

  const checkHasVoted = useCallback(
    (voteId: string) => {
      return hasWalletVoted(address, voteId);
    },
    [address]
  );

  return { votes, castVote, isLoading, checkHasVoted };
}

export function useCompletedVotes() {
  return { completedVotes: COMPLETED_VOTES };
}

export function useCreateVote() {
  const [isCreating, setIsCreating] = useState(false);

  const createVote = useCallback(
    async (title: string, description: string, durationHours: number) => {
      setIsCreating(true);

      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsCreating(false);
      return { success: true, voteId: Date.now().toString() };
    },
    []
  );

  return { createVote, isCreating };
}
