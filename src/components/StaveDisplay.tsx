"use client";

import { useRef, useEffect } from "react";
import { Factory } from "vexflow";
import type { StaffNote } from "@/lib/types";
import {
  needsAccidentalSymbol,
  accidentalToVexflow,
  staffNoteToVexflowKey,
  keySignatureToVexflow,
} from "@/lib/vexflowUtils";

interface StaveDisplayProps {
  note: StaffNote;
  clef: string;
  keySignature: string;
  octaveShift?: boolean;
}

function renderStave(
  container: HTMLElement,
  note: StaffNote,
  clef: string,
  keySignature: string,
  octaveShift: boolean,
) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const width = container.clientWidth || 500;

  const factory = new Factory({
    renderer: { elementId: "stave-container", width, height: 200 },
  });

  const system = factory.System({ width, y: 20 });

  const stave = factory.Stave({ x: 0, y: 0, width });
  if (octaveShift) {
    stave.addClef(clef, "default", "8vb");
  } else {
    stave.addClef(clef);
  }

  const vfKey = keySignatureToVexflow(keySignature);
  stave.addKeySignature(vfKey);

  const noteKey = staffNoteToVexflowKey(note);
  const staveNote = factory.StaveNote({ keys: [noteKey], duration: "1" });

  if (note.accidental && needsAccidentalSymbol(note, keySignature)) {
    staveNote.addModifier(
      factory.Accidental({ type: accidentalToVexflow(note.accidental) }),
    );
  }

  const voice = factory.Voice().addTickables([staveNote]);
  system.addStave({ stave, voices: [voice] });
  factory.draw();
}

export function StaveDisplay({ note, clef, keySignature, octaveShift = false }: StaveDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    renderStave(container, note, clef, keySignature, octaveShift);
  }, [note, clef, keySignature, octaveShift]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      renderStave(container, note, clef, keySignature, octaveShift);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [note, clef, keySignature, octaveShift]);

  const ariaLabel = `Musical stave showing note ${note.letter}${note.accidental ? ` ${note.accidental}` : ""} in octave ${note.octave}`;

  return (
    <div
      id="stave-container"
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      style={{ width: "100%" }}
    />
  );
}
