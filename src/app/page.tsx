"use client";

import { useState, useCallback, useEffect } from "react";
import { Box } from "@mantine/core";
import type { AppConfig, AppScreen, StaffNote } from "@/lib/types";
import { generateNote } from "@/lib/noteGenerator";
import { ConfigScreen } from "@/components/ConfigScreen";
import { NotesScreen } from "@/components/NotesScreen";

const STORAGE_KEY = "random-note-config";

const DEFAULT_CONFIG: AppConfig = {
  clef: "treble",
  keySignature: "C major",
  singleAccidentals: false,
  doubleAccidentals: false,
  transposition: "C",
  ledgerLinesAbove: 0,
  ledgerLinesBelow: 0,
  timerSeconds: null,
  soundEnabled: false,
  octaveShift: false,
  singleAccidentalChance: 20,
  doubleAccidentalChance: 5,
};

function loadConfig(): AppConfig {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppConfig>;
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
}

export default function HomePage() {
  const [screen, setScreen] = useState<AppScreen>("config");
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [currentNote, setCurrentNote] = useState<StaffNote | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = loadConfig();
    setConfig(saved);
    setMounted(true);
  }, []);

  const handleStart = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    const note = generateNote(newConfig);
    setCurrentNote(note);
    setRevealOpen(false);
    setNoteCount(1);
    setScreen("notes");
  }, []);

  const handleNext = useCallback(() => {
    setCurrentNote(generateNote(config));
    setNoteCount((c) => c + 1);
  }, [config]);

  const handleChangeSettings = useCallback(() => {
    setScreen("config");
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box maw={600} mx="auto" p="md">
      {screen === "config" && (
        <ConfigScreen initialConfig={config} onStart={handleStart} />
      )}
      {screen === "notes" && currentNote && (
        <NotesScreen
          config={config}
          note={currentNote}
          onNext={handleNext}
          onChangeSettings={handleChangeSettings}
          revealOpen={revealOpen}
          onRevealToggle={() => setRevealOpen((o) => !o)}
          noteCount={noteCount}
        />
      )}
    </Box>
  );
}
