"use client";

import { useState } from "react";
import { Card, CardValue, Suit } from "@/shared/types";
import { useSimpleJackGame } from "@/hooks/use-simple-jack";

function getCardFaceValue(card: Card): CardValue {
  return card.split("-")[1] as CardValue;
}

function getSuitSymbol(card: Card): string {
  const suit = card.split("-")[0] as Suit;
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
}

function getSuitColor(card: Card): string {
  const suit = card.split("-")[0] as Suit;
  return suit === "Hearts" || suit === "Diamonds"
    ? "text-red-600"
    : "text-black";
}

export default function Home() {
  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [dealingSpeed, setDealingSpeed] = useState<number>(2000);

  const { gameState, resetGame, setGameState } = useSimpleJackGame();

  const startGame = (): void =>
    setGameState({
      ...gameState,
      players: numPlayers,
    });

  // Auto-deal cards when in dealing phase

  if (!gameState.players) {
    return (
      <div className="min-h-screen bg-green-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Simple Jack
          </h1>

          <div className="mb-6">
            <label
              htmlFor="numPlayers"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Players (2-6):
            </label>
            <select
              id="numPlayers"
              value={numPlayers}
              onChange={(e) => {
                if (e.target.value) {
                  setNumPlayers(parseInt(e.target.value));
                } else {
                  setNumPlayers(undefined);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option key={`select`} value={``}>
                - select -
              </option>
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="dealingSpeed"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dealing Speed:
            </label>
            <select
              id="dealingSpeed"
              value={dealingSpeed}
              onChange={(e) => setDealingSpeed(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1000}>Fast (1s)</option>
              <option value={2000}>Normal (2s)</option>
              <option value={3000}>Slow (3s)</option>
            </select>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Simple Jack</h1>
          <div className="text-white text-lg">
            {!gameState.gameOver && (
              <span>
                Dealing cards... Current player:{" "}
                {gameState.currentPlayerIdx + 1}
              </span>
            )}
            {gameState.gameOver && <span>Game Complete!</span>}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gameState.playerHands &&
            gameState.playerHands!.map((player) => (
              <div
                key={player.playerId}
                className={`bg-white rounded-lg p-6 shadow-lg`}
                //  ${
                //   gameState.currentPlayerIdx === player.playerId! - 1 &&
                //   !gameState.gameOver
                //     ? "ring-4 ring-yellow-400"
                //     : ""
                // } ${player.isEliminated ? "opacity-50" : ""} ${
                //   gameState.winner === player.playerId
                //     ? "ring-4 ring-green-500"
                //     : ""
                // }`
                // }
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Player {player.playerId}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {player.score}
                    </div>
                    {/* {player.isEliminated && (
                    <div className="text-red-600 font-semibold">BUST</div>
                  )} */}
                    {gameState.winner === player.playerId && (
                      <div className="text-green-600 font-semibold">
                        WINNER!
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {player.cards.map((card, index) => (
                    <div
                      key={index}
                      className={`bg-white border-2 border-gray-300 rounded-lg p-2 text-center shadow-sm ${getSuitColor(
                        card
                      )}`}
                    >
                      <div className="text-lg font-bold">
                        {getCardFaceValue(card)}
                      </div>
                      <div className="text-xl">{getSuitSymbol(card)}</div>
                    </div>
                  ))}
                  {/* Empty card slots */}
                  {Array.from({
                    length: Math.max(0, 6 - player.cards.length),
                  }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2 h-16"
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Commentary */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Game Commentary
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {/* {gameState.commentary.map((comment, index) => (
              <div key={index} className="text-gray-700 p-2 bg-gray-50 rounded">
                {comment}
              </div>
            ))} */}
          </div>
        </div>

        {/* Game Controls */}
        {gameState.gameOver && (
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Play New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
