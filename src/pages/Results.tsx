import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCompletedVotes } from "@/hooks/useVotes";
import { Check, X, Lock, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

export default function Results() {
  const { completedVotes } = useCompletedVotes();

  return (
    <Layout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Vote Results</h1>
          <p className="text-muted-foreground">
            Final tallies from completed proposals
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 py-4">
            <Lock className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Privacy Preserved
              </p>
              <p className="text-xs text-muted-foreground">
                These results were computed over encrypted votes using Fully Homomorphic Encryption. 
                Individual votes remain private — only the final tally is revealed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {completedVotes.map((vote) => {
            const totalVotes = vote.yesVotes + vote.noVotes;
            const yesPercentage = totalVotes > 0 ? (vote.yesVotes / totalVotes) * 100 : 0;
            const noPercentage = totalVotes > 0 ? (vote.noVotes / totalVotes) * 100 : 0;
            const passed = vote.yesVotes > vote.noVotes;

            return (
              <Card key={vote.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{vote.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {vote.description}
                      </CardDescription>
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        passed
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {passed ? (
                        <>
                          <Check className="h-3 w-3" /> Passed
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" /> Failed
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vote bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 font-medium text-success">
                          <Check className="h-4 w-4" /> YES
                        </span>
                        <span className="font-mono text-foreground">
                          {vote.yesVotes} ({yesPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-success transition-all duration-500"
                          style={{ width: `${yesPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 font-medium text-destructive">
                          <X className="h-4 w-4" /> NO
                        </span>
                        <span className="font-mono text-foreground">
                          {vote.noVotes} ({noPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-destructive transition-all duration-500"
                          style={{ width: `${noPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {totalVotes} total votes
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Ended {format(vote.endedAt, "MMM d, yyyy")}
                    </div>
                  </div>

                  {/* FHE badge */}
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-muted py-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Computed over encrypted data
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {completedVotes.length === 0 && (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No Completed Votes Yet
              </h3>
              <p className="max-w-sm text-muted-foreground">
                Results will appear here once active votes have ended.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer spacer for mobile nav */}
        <div className="h-20 md:hidden" />
      </div>
    </Layout>
  );
}
