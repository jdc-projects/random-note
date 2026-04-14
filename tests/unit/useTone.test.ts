import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTone } from "@/hooks/useTone";
import type { Note, InstrumentType } from "@/lib/types";

function createMockInstrument() {
  return {
    load: Promise.resolve(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

vi.mock("smplr", () => {
  const instruments: ReturnType<typeof createMockInstrument>[] = [];
  const Soundfont = vi.fn(function (this: any) {
    const inst = createMockInstrument();
    instruments.push(inst);
    Object.assign(this, inst);
    return this;
  });
  return { Soundfont, instruments };
});

function createMockAudioContext() {
  const mockGain = {
    gain: { value: 0 },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  const mockOsc = {
    type: "",
    frequency: { value: 0 },
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const ctx = {
    state: "running" as string,
    resume: vi.fn(),
    createOscillator: vi.fn(() => mockOsc),
    createGain: vi.fn(() => mockGain),
    destination: Symbol("destination"),
  };
  return { ctx, mockOsc, mockGain };
}

const C4: Note = { letter: "C", accidental: null, octave: 4 };
const A4: Note = { letter: "A", accidental: null, octave: 4 };

describe("useTone", () => {
  let originalAudioContext: typeof globalThis.AudioContext;
  let mockCtx: ReturnType<typeof createMockAudioContext>;

  beforeEach(() => {
    originalAudioContext = globalThis.AudioContext;
    mockCtx = createMockAudioContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = vi.fn(function (this: any) {
      return mockCtx.ctx;
    }) as unknown as typeof AudioContext;
    (globalThis as any).AudioContext = Ctor;
  });

  afterEach(() => {
    globalThis.AudioContext = originalAudioContext;
    vi.clearAllMocks();
  });

  function renderTone(
    note: Note | null,
    enabled: boolean,
    instrument: InstrumentType = "sine",
  ) {
    return renderHook(
      ({ note: n, enabled: e, instrument: i }) => useTone(n, e, i),
      { initialProps: { note, enabled, instrument } },
    );
  }

  describe("sine wave", () => {
    it("creates oscillator and starts playing", () => {
      renderTone(C4, true, "sine");

      expect(mockCtx.ctx.createOscillator).toHaveBeenCalledOnce();
      expect(mockCtx.ctx.createGain).toHaveBeenCalledOnce();
      expect(mockCtx.mockOsc.start).toHaveBeenCalledOnce();
      expect(mockCtx.mockOsc.connect).toHaveBeenCalledWith(mockCtx.mockGain);
      expect(mockCtx.mockGain.connect).toHaveBeenCalledWith(
        mockCtx.ctx.destination,
      );
    });

    it("sets sine wave type and correct frequency for C4", () => {
      renderTone(C4, true, "sine");

      expect(mockCtx.mockOsc.type).toBe("sine");
      expect(mockCtx.mockOsc.frequency.value).toBeCloseTo(261.63, 1);
    });

    it("sets correct frequency for A4", () => {
      renderTone(A4, true, "sine");

      expect(mockCtx.mockOsc.frequency.value).toBeCloseTo(440, 1);
    });

    it("sets gain to 0.25", () => {
      renderTone(C4, true, "sine");

      expect(mockCtx.mockGain.gain.value).toBe(0.25);
    });

    it("stops oscillator when disabled", () => {
      const { rerender } = renderTone(C4, true, "sine");
      expect(mockCtx.mockOsc.start).toHaveBeenCalledOnce();

      rerender({ note: C4, enabled: false, instrument: "sine" });

      expect(mockCtx.mockOsc.stop).toHaveBeenCalled();
      expect(mockCtx.mockOsc.disconnect).toHaveBeenCalled();
      expect(mockCtx.mockGain.disconnect).toHaveBeenCalled();
    });

    it("stops and creates new oscillator when note changes", () => {
      const { rerender } = renderTone(C4, true, "sine");
      const firstOsc = mockCtx.mockOsc;

      rerender({ note: A4, enabled: true, instrument: "sine" });

      expect(firstOsc.stop).toHaveBeenCalled();
      expect(mockCtx.ctx.createOscillator).toHaveBeenCalledTimes(2);
    });
  });

  describe("soundfont instruments", () => {
    it("creates a Soundfont instance for trumpet", async () => {
      const { Soundfont } = await import("smplr");

      renderTone(C4, true, "trumpet");

      expect(Soundfont).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          instrument: "trumpet",
          loadLoopData: true,
        }),
      );
    });

    it("calls start with midi note and loop after load", async () => {
      const smplr = await import("smplr");
      const instruments = (smplr as unknown as { instruments: ReturnType<typeof createMockInstrument>[] }).instruments;

      renderTone(C4, true, "trumpet");

      await vi.waitFor(() => {
        const inst = instruments[instruments.length - 1];
        expect(inst.start).toHaveBeenCalledWith({
          note: 60,
          loop: true,
        });
      });
    });

    it("reuses Soundfont instance when instrument does not change", async () => {
      const { Soundfont } = await import("smplr");

      const { rerender } = renderTone(C4, true, "trumpet");
      rerender({ note: A4, enabled: true, instrument: "trumpet" });

      expect(Soundfont).toHaveBeenCalledOnce();
    });

    it("creates new Soundfont when instrument changes", async () => {
      const { Soundfont } = await import("smplr");

      const { rerender } = renderTone(C4, true, "trumpet");
      rerender({ note: C4, enabled: true, instrument: "tuba" });

      expect(Soundfont).toHaveBeenCalledTimes(2);
    });

    it("stops soundfont when disabled", async () => {
      const smplr = await import("smplr");
      const instruments = (smplr as unknown as { instruments: ReturnType<typeof createMockInstrument>[] }).instruments;

      const { rerender } = renderTone(C4, true, "trumpet");
      const inst = instruments[instruments.length - 1];

      rerender({ note: C4, enabled: false, instrument: "trumpet" });

      expect(inst.stop).toHaveBeenCalled();
    });
  });

  describe("race condition", () => {
    it("does not play stale note if generation has moved on", async () => {
      const smplr = await import("smplr");
      const { Soundfont } = smplr;
      const instruments = (smplr as unknown as { instruments: ReturnType<typeof createMockInstrument>[] }).instruments;
      let resolveLoad: () => void;
      const pendingLoad = new Promise<void>((r) => {
        resolveLoad = r;
      });

      (
        Soundfont as unknown as ReturnType<typeof vi.fn>
      ).mockImplementationOnce(function (this: any) {
        const inst = { load: pendingLoad, start: vi.fn(), stop: vi.fn() };
        Object.assign(this, inst);
        instruments.push(inst);
        return this;
      });

      const { rerender } = renderTone(C4, true, "trumpet");

      rerender({ note: A4, enabled: true, instrument: "trumpet" });

      resolveLoad!();

      const staleInst = instruments[instruments.length - 2];
      const latestInst = instruments[instruments.length - 1];

      await vi.waitFor(() => {
        expect(staleInst.start).not.toHaveBeenCalled();
        expect(latestInst.start).toHaveBeenCalledWith({
          note: 69,
          loop: true,
        });
      });
    });
  });

  describe("edge cases", () => {
    it("does nothing when note is null", () => {
      renderTone(null, true, "sine");

      expect(mockCtx.ctx.createOscillator).not.toHaveBeenCalled();
    });

    it("does nothing when disabled and note is null", () => {
      renderTone(null, false, "sine");

      expect(mockCtx.ctx.createOscillator).not.toHaveBeenCalled();
    });

    it("resumes suspended AudioContext", () => {
      mockCtx.ctx.state = "suspended";
      renderTone(C4, true, "sine");

      expect(mockCtx.ctx.resume).toHaveBeenCalled();
    });

    it("reuses AudioContext across calls", () => {
      const { rerender } = renderTone(C4, true, "sine");
      rerender({ note: A4, enabled: true, instrument: "sine" });

      expect(globalThis.AudioContext).toHaveBeenCalledOnce();
    });

    it("stops all sound on unmount", () => {
      const { unmount } = renderTone(C4, true, "sine");

      unmount();

      expect(mockCtx.mockOsc.stop).toHaveBeenCalled();
      expect(mockCtx.mockOsc.disconnect).toHaveBeenCalled();
    });
  });

  describe("8vb octave shift", () => {
    it("receives note already shifted down one octave from caller", () => {
      const shiftedNote: Note = { letter: "C", accidental: null, octave: 3 };
      renderTone(shiftedNote, true, "sine");

      const expectedMidi = 48;
      const expectedFreq = 440 * 2 ** ((expectedMidi - 69) / 12);
      expect(mockCtx.mockOsc.frequency.value).toBeCloseTo(expectedFreq, 1);
    });
  });
});
