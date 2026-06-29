import { useState } from "react";
import { EDealingSpeed } from "@/shared/types";

interface GameSetupProps {
  onStartGame: (config: {
    playerName: string;
    numPlayers: number;
    dealingSpeed: EDealingSpeed;
  }) => void;
  onCancel?: () => void;
  initialPlayerName?: string;
  initialNumPlayers?: number;
  initialDealingSpeed?: EDealingSpeed;
}

export function GameSetup({
  onStartGame,
  onCancel,
  initialPlayerName,
  initialNumPlayers,
  initialDealingSpeed,
}: GameSetupProps) {
  const [numPlayers, setNumPlayers] = useState<number | undefined>(initialNumPlayers);
  const [playerName, setPlayerName] = useState<string>(initialPlayerName ?? "");
  const [dealingSpeed, setDealingSpeed] = useState<EDealingSpeed>(
    initialDealingSpeed ?? EDealingSpeed.normal
  );

  const handleStartGame = () => {
    if (numPlayers && playerName.trim()) {
      onStartGame({
        playerName: playerName.trim(),
        numPlayers,
        dealingSpeed,
      });
    }
  };

  const isFormValid = numPlayers && playerName.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🃏 Simple Jack
          </h1>
          <p className="text-gray-600 text-lg">Get ready to play some cards!</p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2"
            >
              <span>👤</span>
              <span>Your Name:</span>
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all text-black font-medium shadow-sm hover:shadow-md"
              maxLength={20}
            />
          </div>

          <div>
            <label
              htmlFor="numPlayers"
              className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2"
            >
              <span>👥</span>
              <span>Number of Players (2-6):</span>
            </label>
            <select
              id="numPlayers"
              value={numPlayers || ""}
              onChange={(e) => {
                if (e.target.value) {
                  setNumPlayers(parseInt(e.target.value));
                } else {
                  setNumPlayers(undefined);
                }
              }}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all text-black font-medium shadow-sm hover:shadow-md"
            >
              <option value="">- Select Number of Players -</option>
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dealingSpeed"
              className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2"
            >
              <span>⚡</span>
              <span>Dealing Speed:</span>
            </label>
            <select
              id="dealingSpeed"
              value={dealingSpeed}
              onChange={(e) => setDealingSpeed(parseInt(e.target.value))}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all text-black font-medium shadow-sm hover:shadow-md"
            >
              <option value={EDealingSpeed.fast}>
                ⚡ Fast ({EDealingSpeed.fast / 1000}s per card)
              </option>
              <option value={EDealingSpeed.normal}>
                🎯 Normal ({EDealingSpeed.normal / 1000}s per card)
              </option>
              <option value={EDealingSpeed.slow}>
                🐌 Slow ({EDealingSpeed.slow / 1000}s per card)
              </option>
            </select>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!isFormValid}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform ${
              isFormValid
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105 active:scale-95"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isFormValid ? (
              <span className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Start Game</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <span>⏳</span>
                <span>Fill in all fields</span>
              </span>
            )}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✖️</span>
                <span>Cancel</span>
              </span>
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="text-gray-500 text-sm">
            <p className="mb-2">🎲 Ready to test your luck?</p>
            <p>Get as close to 21 as possible without going over!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
