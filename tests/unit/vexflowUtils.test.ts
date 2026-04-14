import { describe, it, expect } from "vitest";
import {
  keySignatureToVexflow,
  needsAccidentalSymbol,
  accidentalToVexflow,
  staffNoteToVexflowKey,
} from "@/lib/vexflowUtils";

describe("keySignatureToVexflow", () => {
  it("returns the note name for major keys", () => {
    expect(keySignatureToVexflow("C major")).toBe("C");
    expect(keySignatureToVexflow("G major")).toBe("G");
    expect(keySignatureToVexflow("Bb major")).toBe("Bb");
    expect(keySignatureToVexflow("F# major")).toBe("F#");
  });

  it("appends 'm' for minor keys", () => {
    expect(keySignatureToVexflow("A minor")).toBe("Am");
    expect(keySignatureToVexflow("E minor")).toBe("Em");
    expect(keySignatureToVexflow("Bb minor")).toBe("Bbm");
  });
});

describe("needsAccidentalSymbol", () => {
  it("returns false when note has no accidental", () => {
    expect(
      needsAccidentalSymbol({ letter: "C", accidental: null }, "C major"),
    ).toBe(false);
  });

  it("returns false when note accidental matches key signature", () => {
    expect(
      needsAccidentalSymbol({ letter: "F", accidental: "sharp" }, "G major"),
    ).toBe(false);
    expect(
      needsAccidentalSymbol({ letter: "B", accidental: "flat" }, "F major"),
    ).toBe(false);
  });

  it("returns false when key has no accidental and note is natural", () => {
    expect(
      needsAccidentalSymbol({ letter: "C", accidental: "natural" }, "C major"),
    ).toBe(false);
  });

  it("returns true when note has accidental different from key", () => {
    expect(
      needsAccidentalSymbol({ letter: "F", accidental: "sharp" }, "C major"),
    ).toBe(true);
    expect(
      needsAccidentalSymbol({ letter: "C", accidental: "flat" }, "C major"),
    ).toBe(true);
  });

  it("returns true when adding a natural to an in-key accidental letter", () => {
    expect(
      needsAccidentalSymbol({ letter: "F", accidental: "natural" }, "G major"),
    ).toBe(true);
    expect(
      needsAccidentalSymbol({ letter: "B", accidental: "natural" }, "F major"),
    ).toBe(true);
  });

  it("returns true for double sharps/flats regardless of key", () => {
    expect(
      needsAccidentalSymbol(
        { letter: "C", accidental: "double-sharp" },
        "C major",
      ),
    ).toBe(true);
    expect(
      needsAccidentalSymbol(
        { letter: "D", accidental: "double-flat" },
        "C major",
      ),
    ).toBe(true);
  });

  it("returns true when sharp on a flat-key letter", () => {
    expect(
      needsAccidentalSymbol({ letter: "B", accidental: "sharp" }, "F major"),
    ).toBe(true);
  });
});

describe("accidentalToVexflow", () => {
  it("maps sharp to #", () => {
    expect(accidentalToVexflow("sharp")).toBe("#");
  });

  it("maps flat to b", () => {
    expect(accidentalToVexflow("flat")).toBe("b");
  });

  it("maps natural to n", () => {
    expect(accidentalToVexflow("natural")).toBe("n");
  });

  it("maps double-sharp to ##", () => {
    expect(accidentalToVexflow("double-sharp")).toBe("##");
  });

  it("maps double-flat to bb", () => {
    expect(accidentalToVexflow("double-flat")).toBe("bb");
  });
});

describe("staffNoteToVexflowKey", () => {
  it("converts a natural note to lowercase letter/octave format", () => {
    expect(
      staffNoteToVexflowKey({ letter: "C", accidental: null, octave: 4 }),
    ).toBe("c/4");
    expect(
      staffNoteToVexflowKey({ letter: "G", accidental: null, octave: 5 }),
    ).toBe("g/5");
  });

  it("includes sharp accidental", () => {
    expect(
      staffNoteToVexflowKey({ letter: "F", accidental: "sharp", octave: 4 }),
    ).toBe("f#/4");
  });

  it("includes flat accidental", () => {
    expect(
      staffNoteToVexflowKey({ letter: "B", accidental: "flat", octave: 3 }),
    ).toBe("bb/3");
  });

  it("includes double-sharp accidental", () => {
    expect(
      staffNoteToVexflowKey({
        letter: "C",
        accidental: "double-sharp",
        octave: 4,
      }),
    ).toBe("c##/4");
  });

  it("includes double-flat accidental", () => {
    expect(
      staffNoteToVexflowKey({
        letter: "D",
        accidental: "double-flat",
        octave: 4,
      }),
    ).toBe("dbb/4");
  });

  it("omits natural accidental from key string", () => {
    expect(
      staffNoteToVexflowKey({ letter: "C", accidental: "natural", octave: 4 }),
    ).toBe("c/4");
  });
});
