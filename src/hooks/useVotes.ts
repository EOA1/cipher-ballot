// Mock data and hooks for CipherVote
// In production, this would connect to the Zama FHEVM smart contract

import { useState, useCallback } from "react";
import { Vote } from "@/components/VoteCard";

// Mock votes data
const MOCK_VOTES: Vote[] = [
  {
    id: "1",
    title: "Increase Treasury Allocation for Development",
    description: "Proposal to increase the development fund allocation from 20% to 30% of treasury for Q1 2025.",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    totalVotes: 42,
    hasVoted: false,
    isActive: true,
  },
  {
    id: "2",
    title: "Add New Governance Council Member",
    description: "Vote to add Alice.eth as the 7th member of the governance council with full voting rights.",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    totalVotes: 28,
    hasVoted: false,
    isActive: true,
  },
  {
    id: "3",
    title: "Migrate to New Token Standard",
    description: "Proposal to migrate from ERC-20 to ERC-4626 vault standard for improved yield distribution.",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    totalVotes: 156,
    hasVoted: true,
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

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>(MOCK_VOTES);
  const [isLoading, setIsLoading] = useState(false);

  const castVote = useCallback(async (voteId: string, choice: boolean) => {
    setIsLoading(true);
    
    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setVotes((prev) =>
      prev.map((v) =>
        v.id === voteId
          ? { ...v, hasVoted: true, totalVotes: v.totalVotes + 1 }
          : v
      )
    );
    
    setIsLoading(false);
    return true;
  }, []);

  return { votes, castVote, isLoading };
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
