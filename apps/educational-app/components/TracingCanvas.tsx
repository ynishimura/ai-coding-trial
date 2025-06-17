import { useRef, useEffect, useState, useCallback } from "react";

interface TracingCanvasProps {
  character: string;
  onSuccess: () => void;
  onClear: () => void;
}

interface Point {
  x: number;
  y: number;
}

export default function TracingCanvas({
  character,
  onSuccess,
  onClear,
}: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPaths, setDrawnPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  const canvasSize = 300;

  // キャンバスの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスクリア
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // お手本文字を薄く表示
    ctx.save();
    ctx.font = "200px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
    ctx.fillText(character, canvasSize / 2, canvasSize / 2);
    ctx.restore();

    // 描画済みパスを再描画
    drawnPaths.forEach((path) => {
      if (path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = "#ff4081";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    });
  }, [character, drawnPaths]);

  // 座標を取得するヘルパー関数
  const getPointFromEvent = (event: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize / rect.width;
    const scaleY = canvasSize / rect.height;

    if ("touches" in event) {
      // タッチイベント
      const touch = event.touches[0];
      if (!touch) return null;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      // マウスイベント
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    }
  };

  // 描画開始
  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    const point = getPointFromEvent(event);
    if (point) {
      setCurrentPath([point]);
    }
  }, []);

  // 描画中
  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      event.preventDefault();

      const point = getPointFromEvent(event);
      if (!point) return;

      setCurrentPath((prev) => [...prev, point]);

      // リアルタイム描画
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      ctx.beginPath();
      if (currentPath.length > 0) {
        ctx.moveTo(
          currentPath[currentPath.length - 1].x,
          currentPath[currentPath.length - 1].y
        );
      }
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = "#ff4081";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    [isDrawing, currentPath]
  );

  // 描画終了
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPath.length > 0) {
      setDrawnPaths((prev) => [...prev, currentPath]);
      setCurrentPath([]);

      // 簡単な成功判定（描画点数で判定）
      if (currentPath.length > 20) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    }
  }, [isDrawing, currentPath, onSuccess]);

  // クリア機能
  const clearCanvas = useCallback(() => {
    setDrawnPaths([]);
    setCurrentPath([]);
    onClear();
  }, [onClear]);

  // イベントリスナーの設定
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // マウスイベント
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();

    // タッチイベント
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border-4 border-purple-300 rounded-2xl bg-white shadow-lg cursor-crosshair touch-none"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <div className="absolute top-2 left-2 text-sm text-gray-500 font-bold bg-white px-2 py-1 rounded">
          お手本をなぞってね
        </div>
      </div>

      <button
        onClick={clearCanvas}
        className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-600 transition-colors"
      >
        🗑️ やりなおし
      </button>
    </div>
  );
}
