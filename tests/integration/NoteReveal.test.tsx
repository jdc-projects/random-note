import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { NoteReveal } from "@/components/NoteReveal";
import { renderWithMantine } from "../test-utils";
import type { Note } from "@/lib/types";

afterEach(cleanup);

const writtenNote: Note = { letter: "C", accidental: null, octave: 4 };
const concertNote: Note = { letter: "B", accidental: "flat", octave: 3 };

describe("NoteReveal", () => {
  it("renders collapsed by default", () => {
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={null} open={false} onToggle={vi.fn()} />,
    );
    const btn = screen.getAllByRole("button").find((b) => /reveal note/i.test(b.textContent || ""))!;
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("shows written note name when expanded", () => {
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={null} open={true} onToggle={vi.fn()} />,
    );
    expect(screen.getByText("C4")).toBeInTheDocument();
  });

  it("shows concert note when provided and expanded", () => {
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={concertNote} open={true} onToggle={vi.fn()} />,
    );
    expect(screen.getByText("C4")).toBeInTheDocument();
    expect(screen.getByText("Bb3")).toBeInTheDocument();
  });

  it("does not show concert note section when concert note is null", () => {
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={null} open={true} onToggle={vi.fn()} />,
    );
    expect(screen.queryByText("Concert:")).not.toBeInTheDocument();
  });

  it("calls onToggle when button is clicked", () => {
    const onToggle = vi.fn();
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={null} open={false} onToggle={onToggle} />,
    );
    const btn = screen.getAllByRole("button").find((b) => /reveal note/i.test(b.textContent || ""))!;
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("has aria-controls pointing to the collapse content", () => {
    renderWithMantine(
      <NoteReveal writtenNote={writtenNote} concertNote={null} open={false} onToggle={vi.fn()} />,
    );
    const btn = screen.getAllByRole("button").find((b) => /reveal note/i.test(b.textContent || ""))!;
    expect(btn).toHaveAttribute("aria-controls", "note-reveal-content");
  });
});
