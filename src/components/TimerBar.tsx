"use client";

import { Progress } from "@mantine/core";
import { useTimer } from "@/hooks/useTimer";

interface TimerBarProps {
  duration: number;
  onExpire: () => void;
  resetKey: number;
}

export function TimerBar({ duration, onExpire, resetKey }: TimerBarProps) {
  const { progress } = useTimer(duration, onExpire, resetKey);

  return (
    <Progress
      value={progress * 100}
      size="lg"
      aria-label={`Timer: ${Math.round(progress * duration)}s remaining`}
    />
  );
}
