import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { NotesScreen } from "@/components/NotesScreen";
import { renderWithMantine } from "../test-utils";
import type { AppConfig, StaffNote } from "@/lib/types";

afterEach(cleanup);

const config: AppConfig = {
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

const note: StaffNote = {
  letter: "C",
  accidental: null,
  octave: 4,
  staffPosition: 2,
};

function findButton(text: RegExp) {
  return screen.getAllByRole("button").find((b) => text.test(b.textContent || ""))!;
}

describe("NotesScreen", () => {
  it("renders the stave display with aria-label", () => {
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={false} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    expect(screen.getByRole("img", { name: /musical stave/i })).toBeInTheDocument();
  });

  it("clicking Next calls onNext", () => {
    const onNext = vi.fn();
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={onNext} onChangeSettings={vi.fn()}
        revealOpen={false} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    fireEvent.click(findButton(/next/i));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("clicking Change Settings calls onChangeSettings", () => {
    const onChangeSettings = vi.fn();
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={onChangeSettings}
        revealOpen={false} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    fireEvent.click(findButton(/change settings/i));
    expect(onChangeSettings).toHaveBeenCalledTimes(1);
  });

  it("NoteReveal is collapsed by default", () => {
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={false} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    const btn = findButton(/reveal note/i);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking Reveal Note calls onRevealToggle", () => {
    const onRevealToggle = vi.fn();
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={false} onRevealToggle={onRevealToggle} noteCount={1} />,
    );
    fireEvent.click(findButton(/reveal note/i));
    expect(onRevealToggle).toHaveBeenCalledTimes(1);
  });

  it("shows written and concert note names when expanded with non-C transposition", () => {
    const transposingConfig: AppConfig = { ...config, transposition: "Bb" };
    renderWithMantine(
      <NotesScreen config={transposingConfig} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={true} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    expect(screen.getAllByText("Written:").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Concert:").length).toBeGreaterThanOrEqual(1);
  });

  it("does not show concert note when transposition is C", () => {
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={true} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    expect(screen.getAllByText("Written:").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Concert:")).not.toBeInTheDocument();
  });

  it("does not render timer bar when timerSeconds is null", () => {
    renderWithMantine(
      <NotesScreen config={config} note={note} onNext={vi.fn()} onChangeSettings={vi.fn()}
        revealOpen={false} onRevealToggle={vi.fn()} noteCount={1} />,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
