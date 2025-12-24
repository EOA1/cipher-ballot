import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateVote } from "@/hooks/useVotes";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Lock, Vote, Loader2, AlertCircle } from "lucide-react";

export default function CreateVote() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { createVote, isCreating } = useCreateVote();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("24");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const durationHours = parseInt(duration, 10);
    if (isNaN(durationHours) || durationHours < 1) {
      toast.error("Duration must be at least 1 hour");
      return;
    }

    try {
      const result = await createVote(title, description, durationHours);
      if (result.success) {
        toast.success("Vote created successfully!", {
          description: "Your encrypted poll is now live on Sepolia.",
        });
        navigate("/votes");
      }
    } catch (error) {
      toast.error("Failed to create vote", {
        description: "Please try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Create a Vote</h1>
          <p className="text-muted-foreground">
            Create a new encrypted poll for your DAO
          </p>
        </div>

        {!isConnected && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-primary" />
              <p className="text-sm text-foreground">
                Connect your wallet to create a vote
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              New Proposal
            </CardTitle>
            <CardDescription>
              All votes cast on this proposal will be encrypted using Zama FHE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Vote Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Increase Treasury Allocation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the proposal in detail..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Voting Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="720"
                  placeholder="24"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isCreating}
                />
                <p className="text-xs text-muted-foreground">
                  Voting will end {duration ? `in ${duration} hours` : "after the specified time"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Privacy Guarantee
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All votes will be encrypted using Fully Homomorphic Encryption. 
                      Individual votes remain private — only the final tally is revealed.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={!isConnected || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Vote...
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4" />
                    Create Vote
                  </>
                )}
              </Button>

              {isConnected && (
                <p className="text-center text-xs text-muted-foreground">
                  Connected as {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer spacer for mobile nav */}
        <div className="h-20 md:hidden" />
      </div>
    </Layout>
  );
}
