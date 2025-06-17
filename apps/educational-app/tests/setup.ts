import "@testing-library/jest-dom";
import { vi } from "vitest";

// Web Speech API のモック
Object.defineProperty(window, "speechSynthesis", {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
  },
  writable: true,
});

Object.defineProperty(window, "SpeechSynthesisUtterance", {
  value: class SpeechSynthesisUtterance {
    text = "";
    voice = null;
    volume = 1;
    rate = 1;
    pitch = 1;
    lang = "ja-JP";
    onstart = null;
    onend = null;
    onerror = null;
    onpause = null;
    onresume = null;
    onmark = null;
    onboundary = null;

    constructor(text?: string) {
      if (text) this.text = text;
    }
  },
  writable: true,
});

// HTMLCanvasElement のモック
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    setTransform: vi.fn(),
    transform: vi.fn(),
    createImageData: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    })),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    fillText: vi.fn(),
    strokeText: vi.fn(),
  })),
});

// Next.js router のモック
vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    route: "/",
  }),
}));

// framer-motion のモック
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    button: "button",
    img: "img",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));
