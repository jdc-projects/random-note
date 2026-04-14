import { describe, it, expect } from "vitest";
import { generateNote, getPoolSize } from "@/lib/noteGenerator";
import { getClefPositionNote, getKeyAccidental } from "@/lib/constants";
import type { AppConfig } from "@/lib/types";

const baseConfig: AppConfig = {
  clef: "treble",
  keySignature: "C major",
  singleAccidentals: false,
  doubleAccidentals: false,
  transposition: "C",
  ledgerLinesAbove: 0,
  ledgerLinesBelow: 0,
  timerSeconds: null,
  soundEnabled: false,
  octaveShift: false,
};

describe("generateNote", () => {
  it("generates notes within staff positions 0-8 with no ledger lines", () => {
    for (let i = 0; i < 100; i++) {
      const note = generateNote(baseConfig);
      expect(note.staffPosition).toBeGreaterThanOrEqual(0);
      expect(note.staffPosition).toBeLessThanOrEqual(8);
    }
  });

  it("extends positions with ledger lines above", () => {
    const config = { ...baseConfig, ledgerLinesAbove: 2 };
    for (let i = 0; i < 100; i++) {
      const note = generateNote(config);
      expect(note.staffPosition).toBeGreaterThanOrEqual(0);
      expect(note.staffPosition).toBeLessThanOrEqual(12);
    }
  });

  it("extends positions with ledger lines below", () => {
    const config = { ...baseConfig, ledgerLinesBelow: 1 };
    for (let i = 0; i < 100; i++) {
      const note = generateNote(config);
      expect(note.staffPosition).toBeGreaterThanOrEqual(-2);
      expect(note.staffPosition).toBeLessThanOrEqual(8);
    }
  });

  it("only generates in-key notes when accidentals are disabled", () => {
    for (let i = 0; i < 200; i++) {
      const note = generateNote(baseConfig);
      const keyAcc = getKeyAccidental(note.letter, baseConfig.keySignature);
      expect(note.accidental).toBe(keyAcc);
    }
  });

  it("generates sharp/flat/natural variants with single accidentals", () => {
    const config = { ...baseConfig, singleAccidentals: true };
    const accidentals = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const note = generateNote(config);
      if (note.accidental) accidentals.add(note.accidental);
    }
    expect(accidentals.size).toBeGreaterThan(1);
  });

  it("generates double sharp/double flat with double accidentals", () => {
    const config = {
      ...baseConfig,
      singleAccidentals: true,
      doubleAccidentals: true,
    };
    const accidentals = new Set<string | null>();
    for (let i = 0; i < 1000; i++) {
      const note = generateNote(config);
      accidentals.add(note.accidental);
    }
    expect(accidentals.has("double-sharp")).toBe(true);
    expect(accidentals.has("double-flat")).toBe(true);
  });

  it("respects the clef for note names", () => {
    const note = generateNote({ ...baseConfig, clef: "bass" }, () => 0);
    const expected = getClefPositionNote("bass", note.staffPosition);
    expect(note.letter).toBe(expected.letter);
    expect(note.octave).toBe(expected.octave);
  });

  it("respects key signature accidentals", () => {
    const config = { ...baseConfig, keySignature: "G major" };
    for (let i = 0; i < 100; i++) {
      const note = generateNote(config);
      if (note.letter === "F") {
        expect(note.accidental).toBe("sharp");
      }
    }
  });

  it("uses injected rng for deterministic output", () => {
    let val = 0.5;
    const rng = () => val;
    const note1 = generateNote(baseConfig, rng);
    val = 0.5;
    const note2 = generateNote(baseConfig, rng);
    expect(note1).toEqual(note2);
  });
});

describe("getPoolSize", () => {
  it("returns 9 with no ledger lines and no accidentals", () => {
    expect(getPoolSize(baseConfig)).toBe(9);
  });

  it("includes ledger line positions", () => {
    expect(getPoolSize({ ...baseConfig, ledgerLinesAbove: 2 })).toBe(13);
    expect(getPoolSize({ ...baseConfig, ledgerLinesBelow: 1 })).toBe(11);
  });

  it("includes accidental variants", () => {
    expect(getPoolSize({ ...baseConfig, singleAccidentals: true })).toBe(27);
  });

  it("includes double accidental variants", () => {
    expect(
      getPoolSize({
        ...baseConfig,
        singleAccidentals: true,
        doubleAccidentals: true,
      }),
    ).toBe(45);
  });
});
