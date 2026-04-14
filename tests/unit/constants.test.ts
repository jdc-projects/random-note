import { describe, it, expect } from "vitest";
import { getClefPositionNote, getKeyAccidental } from "@/lib/constants";

describe("getClefPositionNote", () => {
  describe("treble clef (bottom line = E4)", () => {
    it("returns E4 for position 0 (bottom line)", () => {
      const result = getClefPositionNote("treble", 0);
      expect(result).toEqual({ letter: "E", octave: 4 });
    });

    it("returns F4 for position 1", () => {
      const result = getClefPositionNote("treble", 1);
      expect(result).toEqual({ letter: "F", octave: 4 });
    });

    it("returns F5 for position 8 (top line)", () => {
      const result = getClefPositionNote("treble", 8);
      expect(result).toEqual({ letter: "F", octave: 5 });
    });

    it("returns C4 for ledger line below (position -2)", () => {
      const result = getClefPositionNote("treble", -2);
      expect(result).toEqual({ letter: "C", octave: 4 });
    });

    it("returns A5 for ledger line above (position 10)", () => {
      const result = getClefPositionNote("treble", 10);
      expect(result).toEqual({ letter: "A", octave: 5 });
    });

    it("wraps across octave boundary at position 5", () => {
      const result = getClefPositionNote("treble", 5);
      expect(result).toEqual({ letter: "C", octave: 5 });
    });
  });

  describe("bass clef (bottom line = G2)", () => {
    it("returns G2 for position 0", () => {
      const result = getClefPositionNote("bass", 0);
      expect(result).toEqual({ letter: "G", octave: 2 });
    });

    it("returns A2 for position 1", () => {
      const result = getClefPositionNote("bass", 1);
      expect(result).toEqual({ letter: "A", octave: 2 });
    });

    it("returns A3 for position 8 (top line)", () => {
      const result = getClefPositionNote("bass", 8);
      expect(result).toEqual({ letter: "A", octave: 3 });
    });
  });

  describe("alto clef (bottom line = F3)", () => {
    it("returns F3 for position 0", () => {
      const result = getClefPositionNote("alto", 0);
      expect(result).toEqual({ letter: "F", octave: 3 });
    });

    it("returns C4 for position 4 (middle line, middle C)", () => {
      const result = getClefPositionNote("alto", 4);
      expect(result).toEqual({ letter: "C", octave: 4 });
    });

    it("returns G4 for position 8", () => {
      const result = getClefPositionNote("alto", 8);
      expect(result).toEqual({ letter: "G", octave: 4 });
    });
  });

  describe("tenor clef (bottom line = D3)", () => {
    it("returns D3 for position 0", () => {
      const result = getClefPositionNote("tenor", 0);
      expect(result).toEqual({ letter: "D", octave: 3 });
    });

    it("returns A3 for position 4 (middle line)", () => {
      const result = getClefPositionNote("tenor", 4);
      expect(result).toEqual({ letter: "A", octave: 3 });
    });

    it("returns E4 for position 8", () => {
      const result = getClefPositionNote("tenor", 8);
      expect(result).toEqual({ letter: "E", octave: 4 });
    });
  });
});

describe("getKeyAccidental", () => {
  it("returns null for C major (no accidentals)", () => {
    expect(getKeyAccidental("C", "C major")).toBeNull();
    expect(getKeyAccidental("F", "C major")).toBeNull();
  });

  it("returns sharp for letters with sharps in key signature", () => {
    expect(getKeyAccidental("F", "G major")).toBe("sharp");
    expect(getKeyAccidental("F", "D major")).toBe("sharp");
    expect(getKeyAccidental("C", "D major")).toBe("sharp");
  });

  it("returns flat for letters with flats in key signature", () => {
    expect(getKeyAccidental("B", "F major")).toBe("flat");
    expect(getKeyAccidental("B", "Bb major")).toBe("flat");
    expect(getKeyAccidental("E", "Bb major")).toBe("flat");
  });

  it("returns null for letters without accidentals in key signature", () => {
    expect(getKeyAccidental("C", "G major")).toBeNull();
    expect(getKeyAccidental("D", "F major")).toBeNull();
  });

  it("returns null for unknown key signature", () => {
    expect(getKeyAccidental("C", "Unknown key")).toBeNull();
  });

  it("handles key signatures with many accidentals", () => {
    expect(getKeyAccidental("E", "C# major")).toBe("sharp");
    expect(getKeyAccidental("F", "Cb major")).toBe("flat");
  });

  it("works for minor keys", () => {
    expect(getKeyAccidental("F", "E minor")).toBe("sharp");
    expect(getKeyAccidental("B", "D minor")).toBe("flat");
    expect(getKeyAccidental("G", "A minor")).toBeNull();
  });
});
