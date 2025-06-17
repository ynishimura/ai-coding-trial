import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { getCharacterData, Character } from "../../utils/characterData";
import { speakText } from "../../utils/speechUtils";

export default function QuizPage() {
  const router = useRouter();
  const { category } = router.query;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Character | null>(
    null
  );
  const [choices, setChoices] = useState<Character[]>([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    if (category && typeof category === "string") {
      const data = getCharacterData(
        category as "hiragana" | "katakana" | "alphabet"
      );
      setCharacters(data);
      generateQuestion(data);
    }
  }, [category]);

  // ランダムな問題を生成
  const generateQuestion = (characterList: Character[]) => {
    if (characterList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * characterList.length);
    const correctAnswer = characterList[randomIndex];
    setCurrentQuestion(correctAnswer);

    // 選択肢を生成（正解 + 間違い3つ）
    const wrongChoices = characterList
      .filter((char) => char.char !== correctAnswer.char)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allChoices = [correctAnswer, ...wrongChoices].sort(
      () => Math.random() - 0.5
    );

    setChoices(allChoices);
  };

  // 音声で問題を読み上げ
  const playQuestion = async () => {
    if (!currentQuestion || isPlaying) return;

    setIsPlaying(true);
    try {
      await speakText(`${currentQuestion.reading}はどれかな？`);
    } catch (error) {
      console.error("音声再生エラー:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  // 選択肢をクリックした時の処理
  const handleChoiceClick = async (selectedChoice: Character) => {
    const correct = selectedChoice.char === currentQuestion?.char;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      try {
        await speakText("せいかい！すごいね！");
      } catch (error) {
        console.error("音声再生エラー:", error);
      }
    } else {
      try {
        await speakText(`はずれ。こたえは${currentQuestion?.reading}だよ。`);
      } catch (error) {
        console.error("音声再生エラー:", error);
      }
    }

    // 2秒後に次の問題へ
    setTimeout(() => {
      setShowResult(false);
      setIsCorrect(null);

      if (questionCount + 1 >= totalQuestions) {
        // クイズ終了
        showFinalResult();
      } else {
        setQuestionCount(questionCount + 1);
        generateQuestion(characters);
      }
    }, 2500);
  };

  // 最終結果表示
  const showFinalResult = () => {
    setCurrentQuestion(null);
    setChoices([]);
  };

  // ホームに戻る
  const handleHome = () => {
    router.push("/");
  };

  // もう一度プレイ
  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setShowResult(false);
    setIsCorrect(null);
    generateQuestion(characters);
  };

  // 最終結果画面
  if (!currentQuestion && questionCount >= totalQuestions) {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card w-full max-w-md text-center"
        >
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🎉" : percentage >= 60 ? "😊" : "💪"}
          </div>
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            クイズしゅうりょう！
          </h2>
          <div className="text-xl font-bold text-gray-700 mb-2">
            スコア: {score} / {totalQuestions}
          </div>
          <div className="text-lg text-gray-600 mb-6">
            {percentage >= 80
              ? "すばらしい！"
              : percentage >= 60
              ? "よくできました！"
              : "がんばりました！"}
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-lg"
            >
              🔄 もういちど
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHome}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xl font-bold py-4 px-6 rounded-2xl shadow-lg"
            >
              🏠 ホーム
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
        >
          ← ホーム
        </motion.button>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-600">
            もんだい {questionCount + 1} / {totalQuestions}
          </div>
          <div className="text-sm text-gray-500">スコア: {score}</div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* 問題エリア */}
        <motion.div
          className="card mb-8 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
              この文字はどれかな？
            </h2>

            {/* 参考画像 */}
            {currentQuestion.imageUrl && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src={currentQuestion.imageUrl}
                  alt={currentQuestion.description || currentQuestion.char}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl shadow-lg mx-auto mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {currentQuestion.description && (
                  <div className="text-lg md:text-xl font-bold text-gray-600 mb-2">
                    {currentQuestion.description}
                  </div>
                )}
              </motion.div>
            )}

            <div className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
              [{currentQuestion.reading}]
            </div>

            {/* 音声再生ボタン */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playQuestion}
              disabled={isPlaying}
              className={`${
                isPlaying ? "animate-pulse" : ""
              } bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-full shadow-xl flex items-center space-x-3 mx-auto`}
            >
              <span className="text-3xl">{isPlaying ? "🔊" : "🎵"}</span>
              <span>{isPlaying ? "さいせいちゅう..." : "もんだいをきく"}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 選択肢 */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {choices.map((choice, index) => (
            <motion.button
              key={choice.char}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoiceClick(choice)}
              disabled={showResult}
              className="bg-white border-4 border-purple-300 text-purple-600 text-6xl font-bold py-8 px-4 rounded-3xl shadow-lg hover:border-purple-500 transition-all duration-200 min-h-[120px] flex items-center justify-center"
            >
              {choice.char}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* 結果表示 */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: -100, rotate: isCorrect ? 0 : -10 }}
              animate={{
                y: 0,
                rotate: isCorrect ? [0, 5, -5, 0] : [0, 2, -2, 0],
                transition: {
                  rotate: { repeat: 2, duration: 0.3 },
                },
              }}
              className={`${
                isCorrect
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-red-400 to-pink-500"
              } text-white p-8 rounded-3xl shadow-2xl text-center`}
            >
              <div className="text-6xl mb-4">{isCorrect ? "🎉" : "😅"}</div>
              <div className="text-3xl font-bold mb-2">
                {isCorrect ? "せいかい！" : "はずれ"}
              </div>
              <div className="text-xl">
                {isCorrect
                  ? "すごいね！"
                  : `こたえは「${currentQuestion?.char}」だよ`}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 進行状況バー */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{
              width: `${((questionCount + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center mt-2 text-gray-600 font-bold text-sm">
          クイズをがんばっているね！
        </div>
      </div>
    </div>
  );
}
