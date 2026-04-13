import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const noop = () => {};
const fakeCanvas2dContext = {
  measureText: () => ({ width: 0 }),
  fillText: noop,
  strokeText: noop,
  fillRect: noop,
  strokeRect: noop,
  clearRect: noop,
  save: noop,
  restore: noop,
  beginPath: noop,
  closePath: noop,
  moveTo: noop,
  lineTo: noop,
  rect: noop,
  fill: noop,
  stroke: noop,
  arc: noop,
  scale: noop,
  rotate: noop,
  translate: noop,
  setFont: noop,
  canvas: { width: 500, height: 200 },
};

HTMLCanvasElement.prototype.getContext = function (
  contextId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (contextId === "2d") {
    return fakeCanvas2dContext;
  }
  return null;
};
