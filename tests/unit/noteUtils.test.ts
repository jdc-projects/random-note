import { describe, it, expect } from "vitest";
import { noteToMidi, midiToNote, formatNoteName } from "@/lib/noteUtils";
import type { Note } from "@/lib/types";

describe("noteToMidi", () => {
  it("converts C4 to 60", () => {
    expect(noteToMidi({ letter: "C", accidental: null, octave: 4 })).toBe(60);
  });

  it("converts A4 to 69", () => {
    expect(noteToMidi({ letter: "A", accidental: null, octave: 4 })).toBe(69);
  });

  it("converts F#4 to 66", () => {
    expect(noteToMidi({ letter: "F", accidental: "sharp", octave: 4 })).toBe(
      66,
    );
  });

  it("converts Bb3 to 58", () => {
    expect(noteToMidi({ letter: "B", accidental: "flat", octave: 3 })).toBe(58);
  });

  it("converts C-1 to 0", () => {
    expect(noteToMidi({ letter: "C", accidental: null, octave: -1 })).toBe(0);
  });

  it("handles double sharps", () => {
    expect(
      noteToMidi({ letter: "C", accidental: "double-sharp", octave: 4 }),
    ).toBe(62);
  });

  it("handles double flats", () => {
    expect(
      noteToMidi({ letter: "D", accidental: "double-flat", octave: 4 }),
    ).toBe(60);
  });

  it("handles natural explicitly", () => {
    expect(noteToMidi({ letter: "C", accidental: "natural", octave: 4 })).toBe(
      60,
    );
  });
});

describe("midiToNote", () => {
  it("converts 60 to C4 (sharps)", () => {
    const note = midiToNote(60, true);
    expect(note.letter).toBe("C");
    expect(note.octave).toBe(4);
    expect(note.accidental).toBeNull();
  });

  it("converts 61 to C#4 (sharps) or Db4 (flats)", () => {
    const sharp = midiToNote(61, true);
    expect(sharp.letter).toBe("C");
    expect(sharp.accidental).toBe("sharp");

    const flat = midiToNote(61, false);
    expect(flat.letter).toBe("D");
    expect(flat.accidental).toBe("flat");
  });

  it("converts 69 to A4", () => {
    const note = midiToNote(69, true);
    expect(note.letter).toBe("A");
    expect(note.octave).toBe(4);
    expect(note.accidental).toBeNull();
  });

  it("round-trips natural notes", () => {
    const naturals: Note[] = [
      { letter: "C", accidental: null, octave: 4 },
      { letter: "D", accidental: null, octave: 4 },
      { letter: "E", accidental: null, octave: 4 },
      { letter: "F", accidental: null, octave: 4 },
      { letter: "G", accidental: null, octave: 4 },
      { letter: "A", accidental: null, octave: 4 },
      { letter: "B", accidental: null, octave: 4 },
    ];
    for (const note of naturals) {
      const midi = noteToMidi(note);
      const roundTrip = midiToNote(midi, true);
      expect(roundTrip.letter).toBe(note.letter);
      expect(roundTrip.octave).toBe(note.octave);
      expect(roundTrip.accidental).toBeNull();
    }
  });

  it("handles octave boundaries", () => {
    const note = midiToNote(12, true);
    expect(note.letter).toBe("C");
    expect(note.octave).toBe(0);
  });

  it("handles negative MIDI values gracefully", () => {
    const note = midiToNote(0, true);
    expect(note.letter).toBe("C");
    expect(note.octave).toBe(-1);
  });
});

describe("formatNoteName", () => {
  it("formats natural notes", () => {
    expect(formatNoteName({ letter: "C", accidental: null, octave: 4 })).toBe(
      "C4",
    );
  });

  it("formats sharp notes", () => {
    expect(
      formatNoteName({ letter: "F", accidental: "sharp", octave: 4 }),
    ).toBe("F#4");
  });

  it("formats flat notes", () => {
    expect(formatNoteName({ letter: "E", accidental: "flat", octave: 3 })).toBe(
      "Eb3",
    );
  });

  it("formats double sharp", () => {
    expect(
      formatNoteName({ letter: "C", accidental: "double-sharp", octave: 4 }),
    ).toBe("C##4");
  });

  it("formats double flat", () => {
    expect(
      formatNoteName({ letter: "D", accidental: "double-flat", octave: 4 }),
    ).toBe("Dbb4");
  });
});
