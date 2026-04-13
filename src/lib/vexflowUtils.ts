import { getKeyAccidental } from "@/lib/constants";
import type { NoteLetter } from "./types";

export function keySignatureToVexflow(name: string): string {
  const parts = name.split(" ");
  const noteName = parts[0];
  const mode = parts[1];
  if (mode === "major") {
    return noteName;
  }
  return `${noteName}m`;
}

export function needsAccidentalSymbol(
  note: { letter: string; accidental: string | null },
  keySignatureName: string,
): boolean {
  const keyAcc = getKeyAccidental(note.letter as NoteLetter, keySignatureName);
  const noteAcc = note.accidental;
  if (noteAcc === null) {
    return false;
  }
  if (keyAcc === null && noteAcc === "natural") {
    return false;
  }
  if (keyAcc === noteAcc) {
    return false;
  }
  return true;
}

export function accidentalToVexflow(accidental: string): string {
  const map: Record<string, string> = {
    sharp: "#",
    flat: "b",
    natural: "n",
    "double-sharp": "##",
    "double-flat": "bb",
  };
  return map[accidental];
}

export function staffNoteToVexflowKey(note: {
  letter: string;
  accidental: string | null;
  octave: number;
}): string {
  const letter = note.letter.toLowerCase();
  const accMap: Record<string, string> = {
    sharp: "#",
    flat: "b",
    natural: "n",
    "double-sharp": "##",
    "double-flat": "bb",
  };
  const acc =
    note.accidental && note.accidental !== "natural"
      ? accMap[note.accidental]
      : "";
  return `${letter}${acc}/${note.octave}`;
}
