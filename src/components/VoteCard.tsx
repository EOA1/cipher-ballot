import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { Check, X, Lock, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Vote {
  id: string;
  title: string;
  description: string;
  endTime: Date;
  totalVotes: number;
  hasVoted: boolean;
  isActive: boolean;
}

interface VoteCardProps {
  vote: Vote;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
  isLoading?: boolean;
}

export function VoteCard({ vote, onVoteYes, onVoteNo, isLoading }: VoteCardProps) {
  const isExpired = new Date() > vote.endTime;

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
            <Users className="h-4 w-4" />
            <span>{vote.totalVotes} votes</span>
          </div>
        </div>

        {/* Voting Buttons */}
        {!isExpired && !vote.hasVoted && (
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
        {vote.hasVoted && !isExpired && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm font-medium text-muted-foreground">
            <Check className="h-4 w-4 text-success" />
            Your encrypted vote has been submitted
          </div>
        )}

        {/* Expired state */}
        {isExpired && (
          <Button variant="outline" className="w-full" asChild>
            <a href={`/results#${vote.id}`}>View Results</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
