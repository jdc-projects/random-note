import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generateNote, getPoolSize } from "@/lib/noteGenerator";
import { transposeToConcert } from "@/lib/transposition";
import { noteToMidi } from "@/lib/noteUtils";
import { getKeyAccidental, KEY_SIGNATURE_NAMES } from "@/lib/constants";
import type { AppConfig, ClefType, TranspositionPitch } from "@/lib/types";

const CLEFS: ClefType[] = ["treble", "bass", "alto", "tenor"];
const TRANSPOSITIONS: TranspositionPitch[] = ["C", "Bb", "Eb", "F"];

const configArb = fc.record({
  clef: fc.constantFrom(...CLEFS),
  keySignature: fc.constantFrom(...KEY_SIGNATURE_NAMES),
  singleAccidentals: fc.boolean(),
  doubleAccidentals: fc.boolean(),
  transposition: fc.constantFrom(...TRANSPOSITIONS),
  ledgerLinesAbove: fc.integer({ min: 0, max: 5 }),
  ledgerLinesBelow: fc.integer({ min: 0, max: 5 }),
  timerSeconds: fc.oneof(fc.constant(null), fc.integer({ min: 1, max: 60 })),
}) satisfies fc.Arbitrary<AppConfig>;

describe("property: note generation", () => {
  it("every generated note is within the valid position range", () => {
    fc.assert(
      fc.property(configArb, (config) => {
        const note = generateNote(config);
        const minPos = -2 * config.ledgerLinesBelow;
        const maxPos = 8 + 2 * config.ledgerLinesAbove;
        expect(note.staffPosition).toBeGreaterThanOrEqual(minPos);
        expect(note.staffPosition).toBeLessThanOrEqual(maxPos);
      }),
    );
  });

  it("the note pool is never empty for any valid config", () => {
    fc.assert(
      fc.property(configArb, (config) => {
        expect(getPoolSize(config)).toBeGreaterThan(0);
      }),
    );
  });

  it("transposition round-trip preserves the pitch class (MIDI mod 12)", () => {
    fc.assert(
      fc.property(configArb, (config) => {
        if (config.transposition === "C") return;
        const note = generateNote(config);
        const originalMidi = noteToMidi(note);
        const concert = transposeToConcert(note, config.transposition, config.keySignature);
        const concertMidi = noteToMidi(concert);
        const offset = { C: 0, Bb: -2, Eb: 3, F: -7 }[config.transposition];
        expect(concertMidi % 12).toBe(((originalMidi + offset) % 12 + 12) % 12);
      }),
    );
  });

  it("in-key notes match the key signature accidentals", () => {
    fc.assert(
      fc.property(
        configArb.filter((c) => !c.singleAccidentals && !c.doubleAccidentals),
        (config) => {
          for (let i = 0; i < 50; i++) {
            const note = generateNote(config);
            const keyAcc = getKeyAccidental(note.letter, config.keySignature);
            expect(note.accidental).toBe(keyAcc);
          }
        },
      ),
    );
  });
});
