import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { Check, X, Lock, Clock, Users, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vote {
  id: string;
  title: string;
  description: string;
  endTime: Date;
  totalVotes: number;
  hasVoted: boolean;
  isActive: boolean;
  resolved?: boolean;
  yesVotes?: number;
  noVotes?: number;
}

interface VoteCardProps {
  vote: Vote;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
  isLoading?: boolean;
}

export function VoteCard({ vote, onVoteYes, onVoteNo, isLoading }: VoteCardProps) {
  const isExpired = new Date() > vote.endTime;
  const isResolved = vote.resolved && vote.yesVotes !== undefined && vote.noVotes !== undefined;
  const totalRevealed = (vote.yesVotes || 0) + (vote.noVotes || 0);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Encrypted badge */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
        <Lock className="h-3 w-3" />
        Encrypted
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="pr-20 text-lg font-semibold leading-tight">
          {vote.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {vote.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <CountdownTimer endTime={vote.endTime} />
          </div>
          <div className="flex items-center gap-1.5">
            {isResolved ? (
              <>
                <Eye className="h-4 w-4" />
                <span>{totalRevealed} votes</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="text-xs">Hidden until revealed</span>
              </>
            )}
          </div>
        </div>

        {/* Revealed Results */}
        {isResolved && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-success">Yes: {vote.yesVotes}</span>
              <span className="text-destructive">No: {vote.noVotes}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-success transition-all"
                style={{ 
                  width: totalRevealed > 0 
                    ? `${((vote.yesVotes || 0) / totalRevealed) * 100}%` 
                    : '50%' 
                }}
              />
            </div>
          </div>
        )}

        {/* Voting Buttons */}
        {!isExpired && !vote.hasVoted && !isResolved && (
          <div className="flex gap-3">
            <Button
              onClick={onVoteYes}
              disabled={isLoading}
              className="flex-1 bg-success hover:bg-success/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Vote YES
            </Button>
            <Button
              onClick={onVoteNo}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Vote NO
            </Button>
          </div>
        )}

        {/* Already voted state */}
        {vote.hasVoted && !isExpired && !isResolved && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm font-medium text-muted-foreground">
            <Check className="h-4 w-4 text-success" />
            Your encrypted vote has been submitted
          </div>
        )}

        {/* Expired state */}
        {isExpired && !isResolved && (
          <Button variant="outline" className="w-full" asChild>
            <a href={`/results#${vote.id}`}>View Results</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
