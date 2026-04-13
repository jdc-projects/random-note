"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(
  duration: number,
  onExpire: () => void,
  resetKey: number,
) {
  const [progress, setProgress] = useState(1);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(1);
    clear();

    const intervalMs = 50;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / (duration * 1000));
      setProgress(remaining);
      if (remaining <= 0) {
        clear();
        onExpireRef.current();
      }
    }, intervalMs);

    return clear;
  }, [duration, resetKey, clear]);

  return { progress };
}
