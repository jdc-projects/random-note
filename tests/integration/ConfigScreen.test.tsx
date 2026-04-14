import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { ConfigScreen } from "@/components/ConfigScreen";
import { renderWithMantine } from "../test-utils";
import type { AppConfig } from "@/lib/types";

afterEach(cleanup);

const defaultConfig: AppConfig = {
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

function findButton(text: RegExp) {
  return screen.getAllByRole("button").find((b) => text.test(b.textContent || ""))!;
}

function findSubmitButton() {
  return screen.getAllByRole("button").find((b) => b.getAttribute("type") === "submit")!;
}

describe("ConfigScreen", () => {
  it("renders all form fields", () => {
    renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
    expect(screen.getByText("Random Note Generator")).toBeInTheDocument();
    expect(screen.getByText("Clef")).toBeInTheDocument();
    expect(screen.getByText("Key Signature")).toBeInTheDocument();
    expect(screen.getByText("Pitch (Transposition)")).toBeInTheDocument();
    expect(screen.getByText("Ledger Lines Above")).toBeInTheDocument();
    expect(screen.getByText("Ledger Lines Below")).toBeInTheDocument();
    expect(screen.getByText("Timer")).toBeInTheDocument();
    expect(findButton(/start/i)).toBeInTheDocument();
  });

  it("calls onStart with initial config when Start is clicked", () => {
    const onStart = vi.fn();
    renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={onStart} />);
    fireEvent.click(findSubmitButton());
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({
        clef: "treble",
        keySignature: "C major",
        singleAccidentals: false,
        doubleAccidentals: false,
        transposition: "C",
      }),
    );
  });

  it("calls onStart with the provided initialConfig values", () => {
    const config: AppConfig = {
      ...defaultConfig,
      clef: "bass",
      keySignature: "G major",
      ledgerLinesAbove: 2,
    };
    const onStart = vi.fn();
    renderWithMantine(<ConfigScreen initialConfig={config} onStart={onStart} />);
    fireEvent.click(findSubmitButton());
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({
        clef: "bass",
        keySignature: "G major",
        ledgerLinesAbove: 2,
      }),
    );
  });

  it("has Double Accidentals disabled when Single Accidentals is off", () => {
    renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
    const switches = screen.getAllByRole("switch", { name: "Double Accidentals" });
    expect(switches[0]).toBeDisabled();
  });

  it("enables Double Accidentals when Single Accidentals is on", () => {
    const config = { ...defaultConfig, singleAccidentals: true };
    renderWithMantine(<ConfigScreen initialConfig={config} onStart={vi.fn()} />);
    const switches = screen.getAllByRole("switch", { name: "Double Accidentals" });
    expect(switches[0]).not.toBeDisabled();
  });

  it("renders Single Accidentals and Double Accidentals switches", () => {
    renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
    expect(screen.getAllByRole("switch", { name: "Single Accidentals" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("switch", { name: "Double Accidentals" }).length).toBeGreaterThanOrEqual(1);
  });
});
