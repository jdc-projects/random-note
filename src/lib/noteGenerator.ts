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
  const positionRange = maxPosition - minPosition + 1;

  const pos = minPosition + Math.floor(rng() * positionRange);
  const { letter, octave } = getClefPositionNote(config.clef, pos);
  const keyAcc = getKeyAccidental(letter, config.keySignature);

  let accidental: AccidentalType | null = keyAcc;

  if (config.doubleAccidentals && rng() * 100 < config.doubleAccidentalChance) {
    const opts: AccidentalType[] = ["double-sharp", "double-flat"];
    accidental = opts[Math.floor(rng() * opts.length)];
  } else if (
    config.singleAccidentals &&
    rng() * 100 < config.singleAccidentalChance
  ) {
    const opts: AccidentalType[] = [];
    if (keyAcc !== "sharp") {
      opts.push("sharp");
    }
    if (keyAcc !== "flat") {
      opts.push("flat");
    }
    if (keyAcc !== null) {
      opts.push("natural");
    }
    if (opts.length > 0) {
      accidental = opts[Math.floor(rng() * opts.length)];
    }
  }

  return {
    letter,
    accidental,
    octave,
    staffPosition: pos,
  };
}

export function getPoolSize(config: AppConfig): number {
  const minPosition = -2 * config.ledgerLinesBelow;
  const maxPosition = 8 + 2 * config.ledgerLinesAbove;
  const positionCount = maxPosition - minPosition + 1;
  return positionCount;
}
