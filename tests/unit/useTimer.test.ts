import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "@/hooks/useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with progress at 1", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    expect(result.current.progress).toBe(1);
  });

  it("decreases progress over time", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.progress).toBeLessThan(1);
    expect(result.current.progress).toBeGreaterThan(0);
  });

  it("calls onExpire when duration elapses", () => {
    const onExpire = vi.fn();
    renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExpire).toHaveBeenCalledOnce();
  });

  it("clamps progress to 0 (never negative)", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.progress).toBe(0);
  });

  it("resets when resetKey changes", () => {
    const onExpire = vi.fn();
    const { result, rerender } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.progress).toBeLessThan(1);

    rerender({ duration: 5, resetKey: 1 });
    expect(result.current.progress).toBe(1);
  });

  it("clears interval on unmount", () => {
    const onExpire = vi.fn();
    const { unmount } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, resetKey: 0 } },
    );

    unmount();
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(onExpire).not.toHaveBeenCalled();
  });

  it("uses latest onExpire callback when called", () => {
    const onExpire1 = vi.fn();
    const onExpire2 = vi.fn();
    const { rerender } = renderHook(
      ({ duration, onExpire, resetKey }) =>
        useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 5, onExpire: onExpire1, resetKey: 0 } },
    );

    rerender({ duration: 5, onExpire: onExpire2, resetKey: 0 });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExpire1).not.toHaveBeenCalled();
    expect(onExpire2).toHaveBeenCalledOnce();
  });

  it("progress reaches approximately 0.5 at halfway point", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(
      ({ duration, resetKey }) => useTimer(duration, onExpire, resetKey),
      { initialProps: { duration: 10, resetKey: 0 } },
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.progress).toBeCloseTo(0.5, 1);
  });
});
