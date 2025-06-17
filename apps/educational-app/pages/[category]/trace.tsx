import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { getCharacterData, Character } from "../../utils/characterData";
import { speakText } from "../../utils/speechUtils";
import TracingCanvas from "../../components/TracingCanvas";

export default function TracePage() {
  const router = useRouter();
  const { category } = router.query;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (category && typeof category === "string") {
      const data = getCharacterData(
        category as "hiragana" | "katakana" | "alphabet"
      );
      setCharacters(data);
    }
  }, [category]);

  const currentCharacter = characters[currentIndex];

  const handleSuccess = async () => {
    setShowSuccess(true);

    // 成功音声を再生
    if (currentCharacter) {
      setIsPlaying(true);
      try {
        await speakText(`${currentCharacter.reading}、じょうずにかけたね！`);
      } catch (error) {
        console.error("音声再生エラー:", error);
      } finally {
        setIsPlaying(false);
      }
    }

    // 3秒後に次の文字へ
    setTimeout(() => {
      setShowSuccess(false);
      handleNext();
    }, 3000);
  };

  const handleNext = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(characters.length - 1);
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleSpeak = async () => {
    if (!currentCharacter || isPlaying) return;

    setIsPlaying(true);
    try {
      await speakText(currentCharacter.reading);
    } catch (error) {
      console.error("音声再生エラー:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleClear = () => {
    setShowSuccess(false);
  };

  if (!currentCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
        >
          ← ホーム
        </motion.button>

        <div className="text-lg font-bold text-gray-600">
          {currentIndex + 1} / {characters.length}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* 現在の文字表示 */}
        <motion.div
          className="card w-full max-w-sm"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-2">
              {currentCharacter.char}
            </div>
            <div className="text-xl font-bold text-gray-700 mb-4">
              {currentCharacter.reading}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeak}
              disabled={isPlaying}
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
            >
              🎵 おとをきく
            </motion.button>
          </div>
        </motion.div>

        {/* なぞり書きキャンバス */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <TracingCanvas
            character={currentCharacter.char}
            onSuccess={handleSuccess}
            onClear={handleClear}
          />
        </motion.div>

        {/* ナビゲーションボタン */}
        <div className="flex space-x-4 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-lg font-bold py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2"
          >
            <span className="text-xl">⬅️</span>
            <span>まえ</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg font-bold py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2"
          >
            <span>つぎ</span>
            <span className="text-xl">➡️</span>
          </motion.button>
        </div>
      </div>

      {/* 成功アニメーション */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: -100, rotate: -10 }}
              animate={{
                y: 0,
                rotate: [0, 5, -5, 0],
                transition: {
                  rotate: { repeat: 3, duration: 0.3 },
                },
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-3xl shadow-2xl text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-3xl font-bold mb-2">すごいね！</div>
              <div className="text-xl">じょうずにかけたよ！</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 進行状況バー */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / characters.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center mt-2 text-gray-600 font-bold text-sm">
          なぞりがきをがんばっているね！
        </div>
      </div>
    </div>
  );
}
