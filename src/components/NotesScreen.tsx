"use client";

import { Stack, Button, Group } from "@mantine/core";
import { IconPlayerTrackNext, IconSettings } from "@tabler/icons-react";
import type { AppConfig, StaffNote } from "@/lib/types";
import { transposeToConcert } from "@/lib/transposition";
import { StaveDisplay } from "./StaveDisplay";
import { NoteReveal } from "./NoteReveal";
import { TimerBar } from "./TimerBar";

interface NotesScreenProps {
  config: AppConfig;
  note: StaffNote;
  onNext: () => void;
  onChangeSettings: () => void;
  revealOpen: boolean;
  onRevealToggle: () => void;
  noteCount: number;
}

export function NotesScreen({
  config,
  note,
  onNext,
  onChangeSettings,
  revealOpen,
  onRevealToggle,
  noteCount,
}: NotesScreenProps) {
  const concertNote =
    config.transposition !== "C"
      ? transposeToConcert(note, config.transposition, config.keySignature)
      : null;

  return (
    <Stack gap="md">
      <StaveDisplay
        note={note}
        clef={config.clef}
        keySignature={config.keySignature}
      />

      {config.timerSeconds !== null && (
        <TimerBar
          duration={config.timerSeconds}
          onExpire={onNext}
          resetKey={noteCount}
        />
      )}

      <NoteReveal
        writtenNote={note}
        concertNote={concertNote}
        open={revealOpen}
        onToggle={onRevealToggle}
      />

      <Group justify="space-between">
        <Button
          variant="default"
          leftSection={<IconSettings size={16} />}
          onClick={onChangeSettings}
        >
          Change Settings
        </Button>
        <Button
          leftSection={<IconPlayerTrackNext size={16} />}
          onClick={onNext}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
}
