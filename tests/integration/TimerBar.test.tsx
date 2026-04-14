import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import { TimerBar } from "@/components/TimerBar";
import { renderWithMantine } from "../test-utils";

afterEach(cleanup);

describe("TimerBar", () => {
  it("renders a progress bar", () => {
    renderWithMantine(<TimerBar duration={5} onExpire={vi.fn()} resetKey={0} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has aria-label with remaining time", () => {
    renderWithMantine(<TimerBar duration={5} onExpire={vi.fn()} resetKey={0} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", expect.stringContaining("remaining"));
  });

  it("starts with value 100 (full progress)", () => {
    renderWithMantine(<TimerBar duration={5} onExpire={vi.fn()} resetKey={0} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });
});
