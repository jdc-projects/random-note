"use client";

import { Collapse, Paper, Text, Group, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { Note } from "@/lib/types";
import { formatNoteName } from "@/lib/noteUtils";

interface NoteRevealProps {
  writtenNote: Note;
  concertNote: Note | null;
  open: boolean;
  onToggle: () => void;
}

export function NoteReveal({
  writtenNote,
  concertNote,
  open,
  onToggle,
}: NoteRevealProps) {
  return (
    <Paper withBorder p="sm">
      <UnstyledButton
        onClick={onToggle}
        style={{ width: "100%" }}
        aria-expanded={open}
        aria-controls="note-reveal-content"
      >
        <Group justify="space-between">
          <Text fw={500}>Reveal Note</Text>
          {open ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </Group>
      </UnstyledButton>
      <Collapse expanded={open} id="note-reveal-content">
        <Group gap="xs" mt="sm">
          <Text fw={500}>Written:</Text>
          <Text>{formatNoteName(writtenNote)}</Text>
        </Group>
        {concertNote && (
          <Group gap="xs" mt="xs">
            <Text fw={500}>Concert:</Text>
            <Text>{formatNoteName(concertNote)}</Text>
          </Group>
        )}
      </Collapse>
    </Paper>
  );
}
