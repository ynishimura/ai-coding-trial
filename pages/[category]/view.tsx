import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { getCharacterData, Character } from "../../utils/characterData";
import { speakText } from "../../utils/speechUtils";

export default function ViewPage() {
  const router = useRouter();
  const { category } = router.query;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const handleNext = () => {
    if (currentIndex < characters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // 最後の文字の場合は最初に戻る
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(characters.length - 1); // 最初の文字の場合は最後に戻る
    }
  };

  const handleHome = () => {
    router.push("/");
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
      <div className="flex justify-between items-center mb-8">
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
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 文字表示エリア */}
        <motion.div
          className="card mb-8 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCharacter.char}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* 参考画像 */}
              {currentCharacter.imageUrl && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <img
                    src={currentCharacter.imageUrl}
                    alt={currentCharacter.description || currentCharacter.char}
                    className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl shadow-lg mx-auto mb-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {currentCharacter.description && (
                    <div className="text-lg md:text-xl font-bold text-gray-600 mb-2">
                      {currentCharacter.description}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="character-display text-purple-600 mb-4">
                {currentCharacter.char}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
                {currentCharacter.reading}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 音声再生ボタン */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpeak}
          disabled={isPlaying}
          className={`${
            isPlaying ? "animate-pulse" : ""
          } bg-gradient-to-r from-pink-400 to-purple-500 text-white text-2xl md:text-3xl font-bold py-6 px-12 rounded-full shadow-xl mb-8 flex items-center space-x-4 transform transition-all duration-200`}
        >
          <span className="text-4xl">{isPlaying ? "🔊" : "🎵"}</span>
          <span>{isPlaying ? "さいせいちゅう..." : "おとをきく"}</span>
        </motion.button>

        {/* ナビゲーションボタン */}
        <div className="flex space-x-4 w-full max-w-md">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">⬅️</span>
            <span>まえ</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center space-x-2"
          >
            <span>つぎ</span>
            <span className="text-2xl">➡️</span>
          </motion.button>
        </div>
      </div>

      {/* 進行状況バー */}
      <div className="mt-8">
        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / characters.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center mt-2 text-gray-600 font-bold">
          がんばっているね！
        </div>
      </div>
    </div>
  );
}
