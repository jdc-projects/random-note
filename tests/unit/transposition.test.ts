import { describe, it, expect } from "vitest";
import { transposeToConcert } from "@/lib/transposition";
import type { Note } from "@/lib/types";

describe("transposeToConcert", () => {
  it("returns same note for C transposition", () => {
    const note: Note = { letter: "C", accidental: null, octave: 4 };
    const result = transposeToConcert(note, "C", "C major");
    expect(result.letter).toBe("C");
    expect(result.octave).toBe(4);
    expect(result.accidental).toBeNull();
  });

  describe("Bb transposition", () => {
    it("C → Bb", () => {
      const result = transposeToConcert(
        { letter: "C", accidental: null, octave: 4 },
        "Bb",
        "C major",
      );
      expect(result.letter).toBe("B");
      expect(result.accidental).toBe("flat");
    });

    it("D → C", () => {
      const result = transposeToConcert(
        { letter: "D", accidental: null, octave: 4 },
        "Bb",
        "D major",
      );
      expect(result.letter).toBe("C");
      expect(result.accidental).toBeNull();
    });

    it("G → F", () => {
      const result = transposeToConcert(
        { letter: "G", accidental: null, octave: 4 },
        "Bb",
        "G major",
      );
      expect(result.letter).toBe("F");
      expect(result.accidental).toBeNull();
    });

    it("F → Eb", () => {
      const result = transposeToConcert(
        { letter: "F", accidental: null, octave: 4 },
        "Bb",
        "F major",
      );
      expect(result.letter).toBe("E");
      expect(result.accidental).toBe("flat");
    });
  });

  describe("Eb transposition", () => {
    it("C → Eb", () => {
      const result = transposeToConcert(
        { letter: "C", accidental: null, octave: 4 },
        "Eb",
        "C major",
      );
      expect(result.letter).toBe("E");
      expect(result.accidental).toBe("flat");
    });

    it("G → Bb", () => {
      const result = transposeToConcert(
        { letter: "G", accidental: null, octave: 4 },
        "Eb",
        "G major",
      );
      expect(result.letter).toBe("B");
      expect(result.accidental).toBe("flat");
    });
  });

  describe("F transposition", () => {
    it("C → F", () => {
      const result = transposeToConcert(
        { letter: "C", accidental: null, octave: 4 },
        "F",
        "C major",
      );
      expect(result.letter).toBe("F");
      expect(result.accidental).toBeNull();
    });

    it("G → C", () => {
      const result = transposeToConcert(
        { letter: "G", accidental: null, octave: 4 },
        "F",
        "G major",
      );
      expect(result.letter).toBe("C");
      expect(result.accidental).toBeNull();
    });

    it("E → A", () => {
      const result = transposeToConcert(
        { letter: "E", accidental: null, octave: 4 },
        "F",
        "E major",
      );
      expect(result.letter).toBe("A");
      expect(result.accidental).toBeNull();
    });
  });

  it("preserves pitch class through round trip", () => {
    const note: Note = { letter: "D", accidental: null, octave: 4 };
    const concert = transposeToConcert(note, "Bb", "D major");
    const concertMidi =
      (concert.octave + 1) * 12 +
      [0, 2, 4, 5, 7, 9, 11][
        ["C", "D", "E", "F", "G", "A", "B"].indexOf(concert.letter)
      ] +
      (concert.accidental === "sharp"
        ? 1
        : concert.accidental === "flat"
          ? -1
          : 0);
    const originalMidi = (note.octave + 1) * 12 + 2;
    expect(concertMidi % 12).toBe((originalMidi - 2 + 12) % 12);
  });

  it("uses sharps for sharp key signatures", () => {
    const result = transposeToConcert(
      { letter: "C", accidental: null, octave: 4 },
      "Bb",
      "D major",
    );
    expect(result.letter).toBe("A");
    expect(result.accidental).toBe("sharp");
  });
});
