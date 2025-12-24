import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="text-sm font-medium">Voting Ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TimeUnit value={timeLeft.days} label="d" />
      <span className="text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.hours} label="h" />
      <span className="text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.minutes} label="m" />
      <span className="text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.seconds} label="s" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="font-mono text-sm font-semibold tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
