import type { AccidentalType, Note, NoteLetter } from "./types";

export const LETTER_TO_SEMITONE: Record<NoteLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const ACCIDENTAL_OFFSET: Record<AccidentalType, number> = {
  sharp: 1,
  flat: -1,
  natural: 0,
  "double-sharp": 2,
  "double-flat": -2,
};

export const NOTE_NAMES: NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

export function noteToMidi(note: Note): number {
  const base = LETTER_TO_SEMITONE[note.letter];
  const accOffset = note.accidental ? ACCIDENTAL_OFFSET[note.accidental] : 0;
  return (note.octave + 1) * 12 + base + accOffset;
}

export function midiToNote(midi: number, preferSharps: boolean): Note {
  const octave = Math.floor(midi / 12) - 1;
  const semitone = ((midi % 12) + 12) % 12;

  const sharpMap: Record<
    number,
    { letter: NoteLetter; accidental: AccidentalType | null }
  > = {
    0: { letter: "C", accidental: null },
    1: { letter: "C", accidental: "sharp" },
    2: { letter: "D", accidental: null },
    3: { letter: "D", accidental: "sharp" },
    4: { letter: "E", accidental: null },
    5: { letter: "F", accidental: null },
    6: { letter: "F", accidental: "sharp" },
    7: { letter: "G", accidental: null },
    8: { letter: "G", accidental: "sharp" },
    9: { letter: "A", accidental: null },
    10: { letter: "A", accidental: "sharp" },
    11: { letter: "B", accidental: null },
  };

  const flatMap: Record<
    number,
    { letter: NoteLetter; accidental: AccidentalType | null }
  > = {
    0: { letter: "C", accidental: null },
    1: { letter: "D", accidental: "flat" },
    2: { letter: "D", accidental: null },
    3: { letter: "E", accidental: "flat" },
    4: { letter: "E", accidental: null },
    5: { letter: "F", accidental: null },
    6: { letter: "G", accidental: "flat" },
    7: { letter: "G", accidental: null },
    8: { letter: "A", accidental: "flat" },
    9: { letter: "A", accidental: null },
    10: { letter: "B", accidental: "flat" },
    11: { letter: "B", accidental: null },
  };

  const entry = preferSharps ? sharpMap[semitone] : flatMap[semitone];
  return { letter: entry.letter, accidental: entry.accidental, octave };
}

export function formatNoteName(note: Note): string {
  const accMap: Record<AccidentalType, string> = {
    sharp: "#",
    flat: "b",
    natural: "",
    "double-sharp": "##",
    "double-flat": "bb",
  };
  const acc = note.accidental ? accMap[note.accidental] : "";
  return `${note.letter}${acc}${note.octave}`;
}
