import type {
  ClefType,
  KeySignature,
  NoteLetter,
  TranspositionPitch,
} from "./types";

export const NOTE_ORDER: NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

export const CLEF_BOTTOM_LINE: Record<
  ClefType,
  { letter: NoteLetter; octave: number }
> = {
  treble: { letter: "E", octave: 4 },
  bass: { letter: "G", octave: 2 },
  alto: { letter: "F", octave: 3 },
  tenor: { letter: "D", octave: 3 },
};

export const TRANSPOSITION_OFFSETS: Record<TranspositionPitch, number> = {
  C: 0,
  Bb: -2,
  Eb: 3,
  F: -7,
};

export const TIMER_OPTIONS = [
  { label: "No timer", value: null },
  { label: "5 seconds", value: 5 },
  { label: "10 seconds", value: 10 },
  { label: "15 seconds", value: 15 },
  { label: "20 seconds", value: 20 },
  { label: "30 seconds", value: 30 },
  { label: "60 seconds", value: 60 },
] as const;

export const KEY_SIGNATURES: Record<string, KeySignature> = {
  "C major": { name: "C major", mode: "major", accidentals: [] },
  "G major": {
    name: "G major",
    mode: "major",
    accidentals: [{ letter: "F", accidental: "sharp" }],
  },
  "D major": {
    name: "D major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
    ],
  },
  "A major": {
    name: "A major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
    ],
  },
  "E major": {
    name: "E major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
    ],
  },
  "B major": {
    name: "B major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
    ],
  },
  "F# major": {
    name: "F# major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
      { letter: "E", accidental: "sharp" },
    ],
  },
  "C# major": {
    name: "C# major",
    mode: "major",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
      { letter: "E", accidental: "sharp" },
      { letter: "B", accidental: "sharp" },
    ],
  },
  "F major": {
    name: "F major",
    mode: "major",
    accidentals: [{ letter: "B", accidental: "flat" }],
  },
  "Bb major": {
    name: "Bb major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
    ],
  },
  "Eb major": {
    name: "Eb major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
    ],
  },
  "Ab major": {
    name: "Ab major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
    ],
  },
  "Db major": {
    name: "Db major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
    ],
  },
  "Gb major": {
    name: "Gb major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
      { letter: "C", accidental: "flat" },
    ],
  },
  "Cb major": {
    name: "Cb major",
    mode: "major",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
      { letter: "C", accidental: "flat" },
      { letter: "F", accidental: "flat" },
    ],
  },
  "A minor": { name: "A minor", mode: "minor", accidentals: [] },
  "E minor": {
    name: "E minor",
    mode: "minor",
    accidentals: [{ letter: "F", accidental: "sharp" }],
  },
  "B minor": {
    name: "B minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
    ],
  },
  "F# minor": {
    name: "F# minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
    ],
  },
  "C# minor": {
    name: "C# minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
    ],
  },
  "G# minor": {
    name: "G# minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
    ],
  },
  "D# minor": {
    name: "D# minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
      { letter: "E", accidental: "sharp" },
    ],
  },
  "A# minor": {
    name: "A# minor",
    mode: "minor",
    accidentals: [
      { letter: "F", accidental: "sharp" },
      { letter: "C", accidental: "sharp" },
      { letter: "G", accidental: "sharp" },
      { letter: "D", accidental: "sharp" },
      { letter: "A", accidental: "sharp" },
      { letter: "E", accidental: "sharp" },
      { letter: "B", accidental: "sharp" },
    ],
  },
  "D minor": {
    name: "D minor",
    mode: "minor",
    accidentals: [{ letter: "B", accidental: "flat" }],
  },
  "G minor": {
    name: "G minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
    ],
  },
  "C minor": {
    name: "C minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
    ],
  },
  "F minor": {
    name: "F minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
    ],
  },
  "Bb minor": {
    name: "Bb minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
    ],
  },
  "Eb minor": {
    name: "Eb minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
      { letter: "C", accidental: "flat" },
    ],
  },
  "Ab minor": {
    name: "Ab minor",
    mode: "minor",
    accidentals: [
      { letter: "B", accidental: "flat" },
      { letter: "E", accidental: "flat" },
      { letter: "A", accidental: "flat" },
      { letter: "D", accidental: "flat" },
      { letter: "G", accidental: "flat" },
      { letter: "C", accidental: "flat" },
      { letter: "F", accidental: "flat" },
    ],
  },
};

export function getClefPositionNote(
  clef: ClefType,
  position: number,
): { letter: NoteLetter; octave: number } {
  const bottom = CLEF_BOTTOM_LINE[clef];
  const bottomIndex = NOTE_ORDER.indexOf(bottom.letter);
  const newIndex = (bottomIndex + position) % 7;
  const letter = NOTE_ORDER[newIndex >= 0 ? newIndex : newIndex + 7];
  const octaveShift = Math.floor((bottomIndex + position) / 7);
  const octave = bottom.octave + octaveShift;
  return { letter, octave };
}

export function getKeyAccidental(
  letter: NoteLetter,
  keySignatureName: string,
): "sharp" | "flat" | null {
  const keySig = KEY_SIGNATURES[keySignatureName];
  if (!keySig) {
    return null;
  }
  const entry = keySig.accidentals.find((a) => a.letter === letter);
  return entry ? entry.accidental : null;
}

export const KEY_SIGNATURE_NAMES = Object.keys(KEY_SIGNATURES);

export const MAJOR_KEYS_SHARP = [
  "C major",
  "G major",
  "D major",
  "A major",
  "E major",
  "B major",
  "F# major",
  "C# major",
];
export const MAJOR_KEYS_FLAT = [
  "F major",
  "Bb major",
  "Eb major",
  "Ab major",
  "Db major",
  "Gb major",
  "Cb major",
];
export const MINOR_KEYS_SHARP = [
  "A minor",
  "E minor",
  "B minor",
  "F# minor",
  "C# minor",
  "G# minor",
  "D# minor",
  "A# minor",
];
export const MINOR_KEYS_FLAT = [
  "D minor",
  "G minor",
  "C minor",
  "F minor",
  "Bb minor",
  "Eb minor",
  "Ab minor",
];

export const CLEF_OPTIONS: { label: string; value: ClefType }[] = [
  { label: "Treble", value: "treble" },
  { label: "Bass", value: "bass" },
  { label: "Alto", value: "alto" },
  { label: "Tenor", value: "tenor" },
];

export const TRANSPOSITION_OPTIONS: {
  label: string;
  value: TranspositionPitch;
}[] = [
  { label: "C (Concert)", value: "C" },
  { label: "Bb", value: "Bb" },
  { label: "Eb", value: "Eb" },
  { label: "F", value: "F" },
];
