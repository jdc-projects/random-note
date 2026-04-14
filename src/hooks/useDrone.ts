"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Note } from "@/lib/types";
import { noteToMidi } from "@/lib/noteUtils";

function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function useDrone(note: Note | null, enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stop = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {
        // already stopped
      }
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !note) {
      stop();
      return;
    }

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    stop();

    const midi = noteToMidi(note);
    const freq = midiToFrequency(midi);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;

    return stop;
  }, [note, enabled, stop]);
}
