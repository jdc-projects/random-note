import type { Note, TranspositionPitch } from "./types";
import { noteToMidi, midiToNote } from "./noteUtils";
import { TRANSPOSITION_OFFSETS, KEY_SIGNATURES } from "./constants";

function getTonicSemitone(keySignatureName: string): number {
  const tonicLetter = keySignatureName.split(" ")[0];
  const LETTER_TO_SEMI: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };
  let base = LETTER_TO_SEMI[tonicLetter] ?? 0;
  if (
    keySignatureName.startsWith("F#") ||
    keySignatureName.startsWith("G#") ||
    keySignatureName.startsWith("A#") ||
    keySignatureName.startsWith("C#") ||
    keySignatureName.startsWith("D#")
  ) {
    base += 1;
  }
  if (
    keySignatureName.startsWith("Bb") ||
    keySignatureName.startsWith("Eb") ||
    keySignatureName.startsWith("Ab") ||
    keySignatureName.startsWith("Db") ||
    keySignatureName.startsWith("Gb") ||
    keySignatureName.startsWith("Cb")
  ) {
    base -= 1;
  }
  return ((base % 12) + 12) % 12;
}

function concertKeyUsesSharps(
  writtenKeySignatureName: string,
  pitch: TranspositionPitch,
): boolean {
  const tonicSemi = getTonicSemitone(writtenKeySignatureName);
  const offset = TRANSPOSITION_OFFSETS[pitch];
  const concertTonicSemi = (((tonicSemi + offset) % 12) + 12) % 12;

  const sharpTonicSemis = new Set([0, 7, 2, 9, 4, 11, 6, 1]);
  const flatTonicSemis = new Set([5, 10, 3, 8, 1, 6, 11]);

  if (
    sharpTonicSemis.has(concertTonicSemi) &&
    !flatTonicSemis.has(concertTonicSemi)
  ) {
    return true;
  }
  if (
    flatTonicSemis.has(concertTonicSemi) &&
    !sharpTonicSemis.has(concertTonicSemi)
  ) {
    return false;
  }

  const keySig = KEY_SIGNATURES[writtenKeySignatureName];
  if (keySig && keySig.accidentals.length > 0) {
    return keySig.accidentals[0].accidental === "sharp";
  }
  return true;
}

export function transposeToConcert(
  written: Note,
  pitch: TranspositionPitch,
  writtenKeySignatureName: string = "C major",
): Note {
  if (pitch === "C") {
    return { ...written };
  }
  const midi = noteToMidi(written) + TRANSPOSITION_OFFSETS[pitch];
  const preferSharps = concertKeyUsesSharps(writtenKeySignatureName, pitch);
  return midiToNote(midi, preferSharps);
}
