// 音声読み上げ機能
export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // SpeechSynthesis APIがサポートされているかチェック
    if (!("speechSynthesis" in window)) {
      console.warn("このブラウザは音声合成をサポートしていません");
      resolve();
      return;
    }

    // 既存の音声をストップ
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // 日本語設定
    utterance.lang = "ja-JP";
    utterance.rate = 0.8; // 少しゆっくり話す
    utterance.pitch = 1.2; // 少し高めの音程で子ども向け
    utterance.volume = 1;

    // 読み上げ完了時のコールバック
    utterance.onend = () => {
      resolve();
    };

    // エラー時のコールバック
    utterance.onerror = (event) => {
      console.error("音声合成エラー:", event.error);
      reject(event.error);
    };

    // 音声合成開始
    speechSynthesis.speak(utterance);
  });
};

// 音声読み上げを停止
export const stopSpeaking = (): void => {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
};

// 利用可能な音声をチェック
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // 音声リストの読み込みを待つ
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    }
  });
};

// 日本語音声を優先して設定
export const setJapaneseVoice = async (
  utterance: SpeechSynthesisUtterance
): Promise<void> => {
  const voices = await getAvailableVoices();
  const japaneseVoice = voices.find(
    (voice) => voice.lang.includes("ja") || voice.name.includes("Japanese")
  );

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }
};
