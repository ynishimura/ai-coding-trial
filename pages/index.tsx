import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedCharacterType, setSelectedCharacterType] =
    useState<string>("");

  const characterTypes = [
    {
      id: "hiragana",
      name: "ひらがな",
      color: "from-pink-400 to-rose-500",
      emoji: "🌸",
      description: "あいうえお",
    },
    {
      id: "katakana",
      name: "カタカナ",
      color: "from-blue-400 to-indigo-500",
      emoji: "⭐",
      description: "アイウエオ",
    },
    {
      id: "alphabet",
      name: "アルファベット",
      color: "from-green-400 to-emerald-500",
      emoji: "🎈",
      description: "ABC",
    },
  ];

  const learningModes = [
    {
      id: "view",
      name: "もじをみる",
      emoji: "👀",
      description: "文字を見て音を聞こう",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: "trace",
      name: "なぞってかく",
      emoji: "✏️",
      description: "指でなぞって覚えよう",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "quiz",
      name: "クイズ",
      emoji: "🎯",
      description: "正しい文字を選ぼう",
      color: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      {/* タイトル */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          もじのがくしゅう
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-bold">
          たのしくもじをおぼえよう！
        </p>
      </motion.div>

      {!selectedCharacterType ? (
        /* 文字種類選択画面 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-700">
            どのもじをならう？
          </h2>
          <div className="space-y-4">
            {characterTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacterType(type.id)}
                className={`w-full bg-gradient-to-r ${type.color} text-white p-6 rounded-3xl shadow-xl flex items-center justify-between transform transition-all duration-300`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{type.emoji}</span>
                  <div className="text-left">
                    <div className="text-2xl font-bold">{type.name}</div>
                    <div className="text-lg opacity-90">{type.description}</div>
                  </div>
                </div>
                <span className="text-3xl">→</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        /* 学習モード選択画面 */
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <button
              onClick={() => setSelectedCharacterType("")}
              className="text-lg font-bold text-gray-600 mb-4 flex items-center mx-auto hover:text-gray-800 transition-colors"
            >
              ← もどる
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
              なにをする？
            </h2>
          </div>
          <div className="space-y-4">
            {learningModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/${selectedCharacterType}/${mode.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full bg-gradient-to-r ${mode.color} text-white p-6 rounded-3xl shadow-xl flex items-center justify-between cursor-pointer transform transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{mode.emoji}</span>
                      <div className="text-left">
                        <div className="text-2xl font-bold">{mode.name}</div>
                        <div className="text-lg opacity-90">
                          {mode.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-3xl">→</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 保護者向け説明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center max-w-lg"
      >
        <p className="text-sm md:text-base text-gray-500">
          2-3歳のお子様向けの文字学習アプリです。
          <br />
          音声をタップして聞いたり、指でなぞって文字を覚えることができます。
        </p>
      </motion.div>
    </div>
  );
}
