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
  instrument: "sine" as const,
  octaveShift: false,
  singleAccidentalChance: 20,
  doubleAccidentalChance: 5,
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
    expect(screen.getByText(/Timer:/)).toBeInTheDocument();
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

  describe("Sound toggle", () => {
    it("does not show Instrument dropdown when sound is off", () => {
      renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
      expect(screen.queryByLabelText("Instrument")).not.toBeInTheDocument();
    });

    it("shows Instrument dropdown when sound is on", () => {
      const config = { ...defaultConfig, soundEnabled: true };
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={vi.fn()} />);
      const inputs = screen.getAllByLabelText("Instrument");
      expect(inputs.find((el) => el.getAttribute("data-path") === "instrument")).toBeInTheDocument();
    });

    it("includes soundEnabled in submitted config", () => {
      const config = { ...defaultConfig, soundEnabled: true, instrument: "trumpet" as const };
      const onStart = vi.fn();
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={onStart} />);
      fireEvent.click(findSubmitButton());
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({ soundEnabled: true, instrument: "trumpet" }),
      );
    });
  });

  describe("8vb toggle", () => {
    it("renders the 8vb switch", () => {
      renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
      expect(screen.getAllByRole("switch", { name: /8vb/i }).length).toBeGreaterThanOrEqual(1);
    });

    it("includes octaveShift in submitted config when enabled", () => {
      const config = { ...defaultConfig, octaveShift: true };
      const onStart = vi.fn();
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={onStart} />);
      fireEvent.click(findSubmitButton());
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({ octaveShift: true }),
      );
    });
  });

  describe("Timer slider", () => {
    it("renders the timer section with slider", () => {
      renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
      expect(screen.getByText(/Timer:/)).toBeInTheDocument();
    });

    it("includes timerSeconds in submitted config", () => {
      const config = { ...defaultConfig, timerSeconds: 5 };
      const onStart = vi.fn();
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={onStart} />);
      fireEvent.click(findSubmitButton());
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({ timerSeconds: 5 }),
      );
    });
  });

  describe("Advanced settings", () => {
    it("has an Advanced Settings toggle button", () => {
      renderWithMantine(<ConfigScreen initialConfig={defaultConfig} onStart={vi.fn()} />);
      expect(findButton(/advanced settings/i)).toBeInTheDocument();
    });

    it("shows accidental chance inputs when Advanced Settings is clicked", () => {
      const config = { ...defaultConfig, singleAccidentals: true };
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={vi.fn()} />);
      fireEvent.click(findButton(/advanced settings/i));
      expect(screen.getByText("Single Accidental Chance (%)")).toBeInTheDocument();
      expect(screen.getByText("Double Accidental Chance (%)")).toBeInTheDocument();
    });

    it("includes accidental chances in submitted config", () => {
      const config = {
        ...defaultConfig,
        singleAccidentals: true,
        singleAccidentalChance: 30,
        doubleAccidentalChance: 10,
      };
      const onStart = vi.fn();
      renderWithMantine(<ConfigScreen initialConfig={config} onStart={onStart} />);
      fireEvent.click(findSubmitButton());
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({
          singleAccidentalChance: 30,
          doubleAccidentalChance: 10,
        }),
      );
    });
  });
});
