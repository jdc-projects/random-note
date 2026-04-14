export type NoteLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type AccidentalType =
  | "sharp"
  | "flat"
  | "natural"
  | "double-sharp"
  | "double-flat";

export type ClefType = "treble" | "bass" | "alto" | "tenor";

export type TranspositionPitch = "C" | "Bb" | "Eb" | "F";

export type KeyMode = "major" | "minor";

export interface KeyAccidental {
  letter: NoteLetter;
  accidental: "sharp" | "flat";
}

export interface KeySignature {
  name: string;
  mode: KeyMode;
  accidentals: KeyAccidental[];
}

export interface Note {
  letter: NoteLetter;
  accidental: AccidentalType | null;
  octave: number;
}

export interface StaffNote extends Note {
  staffPosition: number;
}

export interface AppConfig {
  clef: ClefType;
  keySignature: string;
  singleAccidentals: boolean;
  doubleAccidentals: boolean;
  transposition: TranspositionPitch;
  ledgerLinesAbove: number;
  ledgerLinesBelow: number;
  timerSeconds: number | null;
  soundEnabled: boolean;
  octaveShift: boolean;
}

export type AppScreen = "config" | "notes";
