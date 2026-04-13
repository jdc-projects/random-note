import type { AccidentalType, AppConfig, StaffNote } from "./types";
import { getClefPositionNote, getKeyAccidental } from "./constants";

export {
  needsAccidentalSymbol,
  accidentalToVexflow,
  staffNoteToVexflowKey,
} from "./vexflowUtils";

export function generateNote(
  config: AppConfig,
  rng: () => number = Math.random,
): StaffNote {
  const minPosition = -2 * config.ledgerLinesBelow;
  const maxPosition = 8 + 2 * config.ledgerLinesAbove;

  const pool: StaffNote[] = [];

  for (let pos = minPosition; pos <= maxPosition; pos++) {
    const { letter, octave } = getClefPositionNote(config.clef, pos);
    const keyAcc = getKeyAccidental(letter, config.keySignature);

    pool.push({
      letter,
      accidental: keyAcc,
      octave,
      staffPosition: pos,
    });

    if (config.singleAccidentals) {
      if (keyAcc !== "sharp") {
        pool.push({
          letter,
          accidental: "sharp" as AccidentalType,
          octave,
          staffPosition: pos,
        });
      }
      if (keyAcc !== "flat") {
        pool.push({
          letter,
          accidental: "flat" as AccidentalType,
          octave,
          staffPosition: pos,
        });
      }
      if (keyAcc !== null) {
        pool.push({
          letter,
          accidental: "natural" as AccidentalType,
          octave,
          staffPosition: pos,
        });
      }
    }

    if (config.doubleAccidentals) {
      pool.push({
        letter,
        accidental: "double-sharp" as AccidentalType,
        octave,
        staffPosition: pos,
      });
      pool.push({
        letter,
        accidental: "double-flat" as AccidentalType,
        octave,
        staffPosition: pos,
      });
    }
  }

  return pool[Math.floor(rng() * pool.length)];
}

export function getPoolSize(config: AppConfig): number {
  const minPosition = -2 * config.ledgerLinesBelow;
  const maxPosition = 8 + 2 * config.ledgerLinesAbove;
  const positionCount = maxPosition - minPosition + 1;

  let perPosition = 1;
  if (config.singleAccidentals) {
    perPosition += 2;
  }
  if (config.doubleAccidentals) {
    perPosition += 2;
  }

  return positionCount * perPosition;
}
