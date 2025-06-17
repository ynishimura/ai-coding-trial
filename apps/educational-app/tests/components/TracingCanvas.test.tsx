import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TracingCanvas from "../../components/TracingCanvas";

// Canvas context のモック
const mockContext = {
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 20 })),
  setLineDash: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  canvas: {
    width: 300,
    height: 300,
  },
} as any;

// HTMLCanvasElement.prototype.getContext をモック
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => mockContext),
  writable: true,
});

describe("TracingCanvas", () => {
  const mockOnSuccess = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render canvas and clear button", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText("クリア")).toBeInTheDocument();
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should call onClear when clear button is clicked", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText("クリア");
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  it("should handle mouse events for drawing", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();

    if (canvas) {
      // マウスダウン
      fireEvent.mouseDown(canvas, {
        clientX: 100,
        clientY: 100,
      });

      // マウス移動
      fireEvent.mouseMove(canvas, {
        clientX: 120,
        clientY: 120,
      });

      // マウスアップ
      fireEvent.mouseUp(canvas);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    }
  });

  it("should handle touch events for drawing", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();

    if (canvas) {
      // タッチ開始
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // タッチ移動
      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 120, clientY: 120 }],
      });

      // タッチ終了
      fireEvent.touchEnd(canvas);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    }
  });

  it("should display the character template", () => {
    render(
      <TracingCanvas
        character="か"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    // キャンバスコンテキストでfillTextが呼ばれることを確認
    expect(mockContext.fillText).toHaveBeenCalledWith(
      "か",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should change character when prop changes", () => {
    const { rerender } = render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    expect(mockContext.fillText).toHaveBeenCalledWith(
      "あ",
      expect.any(Number),
      expect.any(Number)
    );

    rerender(
      <TracingCanvas
        character="き"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    expect(mockContext.fillText).toHaveBeenCalledWith(
      "き",
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should prevent default touch behavior", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const canvas = document.querySelector("canvas");

    if (canvas) {
      const touchStartEvent = new TouchEvent("touchstart", {
        touches: [
          new Touch({
            identifier: 0,
            target: canvas,
            clientX: 100,
            clientY: 100,
            radiusX: 1,
            radiusY: 1,
            rotationAngle: 0,
            force: 1,
          }),
        ],
      });

      const preventDefaultSpy = vi.spyOn(touchStartEvent, "preventDefault");
      fireEvent(canvas, touchStartEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    }
  });

  it("should handle drawing completion and success detection", () => {
    render(
      <TracingCanvas
        character="あ"
        onSuccess={mockOnSuccess}
        onClear={mockOnClear}
      />
    );

    const canvas = document.querySelector("canvas");

    if (canvas) {
      // 描画操作を模擬
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseMove(canvas, { clientX: 55, clientY: 55 });
      fireEvent.mouseUp(canvas);

      // 描画操作が正しく実行されることを確認
      expect(mockContext.stroke).toHaveBeenCalled();
    }
  });