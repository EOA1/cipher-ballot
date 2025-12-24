import { Layout } from "@/components/Layout";
import { VoteCard } from "@/components/VoteCard";
import { useVotes } from "@/hooks/useVotes";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Vote, AlertCircle, Lock, PlusCircle } from "lucide-react";

export default function Votes() {
  const { votes, castVote, isLoading } = useVotes();
  const { isConnected } = useAccount();

  const activeVotes = votes.filter((v) => v.isActive && new Date() < v.endTime);

  const handleVote = async (voteId: string, choice: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    const loadingToast = toast.loading("Encrypting and submitting your vote...", {
      description: "Your vote is being encrypted using Zama FHE",
    });

    try {
      await castVote(voteId, choice);
      toast.dismiss(loadingToast);
      toast.success("Vote submitted securely!", {
        description: "Your encrypted vote has been recorded on-chain.",
        icon: <Lock className="h-4 w-4" />,
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to submit vote", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Active Votes</h1>
            <p className="text-muted-foreground">
              Cast your encrypted vote on open proposals
            </p>
          </div>
          <Button asChild className="hidden gap-2 sm:flex">
            <Link to="/create">
              <PlusCircle className="h-4 w-4" />
              Create Vote
            </Link>
          </Button>
        </div>

        {/* Wallet Warning */}
        {!isConnected && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-primary" />
              <p className="text-sm text-foreground">
                Connect your wallet to cast votes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Votes Grid */}
        {activeVotes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeVotes.map((vote) => (
              <VoteCard
                key={vote.id}
                vote={vote}
                onVoteYes={() => handleVote(vote.id, true)}
                onVoteNo={() => handleVote(vote.id, false)}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Vote className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No Active Votes
              </h3>
              <p className="mb-6 max-w-sm text-muted-foreground">
                There are no active proposals right now. Be the first to create one!
              </p>
              <Button asChild>
                <Link to="/create">Create a Vote</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer spacer for mobile nav */}
        <div className="h-20 md:hidden" />
      </div>
    </Layout>
  );
}
