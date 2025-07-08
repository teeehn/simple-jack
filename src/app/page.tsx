"use client";

import { useState } from "react";

import { EDealingSpeed } from "@/shared/types";
import { useSimpleJackGame } from "@/hooks/use-simple-jack";
import { Player } from "@/components/player";

export default function Home() {
  const [numPlayers, setNumPlayers] = useState<number | undefined>();
  const [playerName, setPlayerName] = useState<string>("");
  const [dealingSpeed, setDealingSpeed] = useState<EDealingSpeed>(
    EDealingSpeed.normal
  );

  const { gameState, resetGame, setGameState, hitMe, stand } =
    useSimpleJackGame();

  const startGame = (): void =>
    setGameState({
      ...gameState,
      dealingSpeed,
      players: numPlayers,
      playerName: playerName.trim() || "Player",
    });

  if (!gameState.players) {
    return (
      <div className="min-h-screen bg-green-800 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Simple Jack
          </h1>

          <div className="mb-6">
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name:
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value={EDealingSpeed.fast}>
                Fast ({`${EDealingSpeed.fast / 1000}s`})
              </option>
              <option value={EDealingSpeed.normal}>
                Normal ({`${EDealingSpeed.normal / 1000}s`})
              </option>
              <option value={EDealingSpeed.slow}>
                Slow ({`${EDealingSpeed.slow / 1000}s`})
              </option>
            </select>
          </div>

          <button
            onClick={startGame}
            disabled={!numPlayers || !playerName.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const getPlayerDisplayName = (playerId: number) => {
    if (playerId === 1) {
      return gameState.playerName || "Player";
    }
    if (playerId === gameState.players) {
      return "Dealer";
    }
    return `Player ${playerId}`;
  };

  const isUserTurn = gameState.currentPlayerIdx === 0;
  const userHand = gameState.playerHands?.[0];
  const canUserChoose =
    isUserTurn &&
    !gameState.gameOver &&
    userHand &&
    userHand.cards.length >= 2 &&
    !userHand.hasStood &&
    !userHand.isEliminated;

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Simple Jack</h1>
          <div className="text-white text-lg">
            {!gameState.gameOver && (
              <span>
                Dealing cards... Current player:{" "}
                {getPlayerDisplayName(gameState.currentPlayerIdx + 1)}
              </span>
            )}
            {gameState.gameOver && <span>Game Complete!</span>}
          </div>
        </div>

        {/* User Controls */}
        {canUserChoose && (
          <div className="text-center mb-6">
            <div className="bg-white rounded-lg p-4 shadow-lg inline-block">
              <p className="text-gray-800 mb-4 font-semibold">
                {gameState.playerName}, it's your turn! What would you like to
                do?
              </p>
              <div className="space-x-4">
                <button
                  onClick={hitMe}
                  className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors font-semibold"
                >
                  Hit me
                </button>
                <button
                  onClick={stand}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Stand
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gameState.playerHands &&
            gameState.playerHands.map((player) => (
              <Player
                key={player.playerId}
                hand={player}
                winner={gameState.winner}
                isCurrentPlayer={
                  gameState.currentPlayerIdx === player.playerId! - 1
                }
                isGameOver={gameState.gameOver}
                displayName={getPlayerDisplayName(player.playerId!)}
              />
            ))}
        </div>

        {/* Commentary */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Game Commentary
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {gameState.commentary.map((comment, index) => (
              <div key={index} className="text-gray-700 p-2 bg-gray-50 rounded">
                {comment}
              </div>
            ))}
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
