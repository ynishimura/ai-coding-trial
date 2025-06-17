import { describe, it, expect, beforeEach, vi } from "vitest";
import { speakText } from "../../utils/speechUtils";

// SpeechSynthesis API のモック
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

Object.defineProperty(window, "speechSynthesis", {
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
    getVoices: vi.fn(() => []),
  },
  writable: true,
});

describe("speechUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("speakText", () => {
    it("should call speechSynthesis.speak with correct utterance", async () => {
      const text = "あ";

      await speakText(text);

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
      expect(utterance.lang).toBe("ja-JP");
      expect(utterance.rate).toBe(0.8);
      expect(utterance.pitch).toBe(1.2);
    });

    it("should handle empty text", async () => {
      await speakText("");

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe("");
    });

    it("should handle hiragana text", async () => {
      const text = "ひらがな";

      await speakText(text);

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
    });

    it("should handle katakana text", async () => {
      const text = "カタカナ";

      await speakText(text);

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
    });

    it("should handle alphabet text", async () => {
      const text = "えー";

      await speakText(text);

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utterance = mockSpeak.mock.calls[0][0];
      expect(utterance.text).toBe(text);
    });

    it("should resolve when speech ends successfully", async () => {
      const text = "テスト";

      // speakTextを呼び出すと同時に、onendを模擬的にトリガー
      const promise = speakText(text);

      // 次のイベントループでonendを呼び出す
      setTimeout(() => {
        const utterance = mockSpeak.mock.calls[0][0];
        if (utterance.onend) {
          utterance.onend(new Event("end"));
        }
      }, 0);

      await expect(promise).resolves.toBeUndefined();
    });

    it("should reject when speech encounters an error", async () => {
      const text = "エラーテスト";

      // speakTextを呼び出すと同時に、onerrorを模擬的にトリガー
      const promise = speakText(text);

      // 次のイベントループでonerrorを呼び出す
      setTimeout(() => {
        const utterance = mockSpeak.mock.calls[0][0];
        if (utterance.onerror) {
          utterance.onerror(new Event("error"));
        }
      }, 0);

      await expect(promise).rejects.toEqual(new Event("error"));
    });

    it("should handle speechSynthesis not being available", async () => {
      // speechSynthesisを一時的に削除
      const originalSpeechSynthesis = window.speechSynthesis;
      delete (window as any).speechSynthesis;

      await expect(speakText("テスト")).rejects.toThrow(
        "SpeechSynthesis is not supported"
      );

      // 復元
      window.speechSynthesis = originalSpeechSynthesis;
    });

    it("should cancel previous speech before starting new one", async () => {
      await speakText("最初のテキスト");
      await speakText("次のテキスト");

      expect(mockCancel).toHaveBeenCalledTimes(2);
      expect(mockSpeak).toHaveBeenCalledTimes(2);
    });
  });
});
