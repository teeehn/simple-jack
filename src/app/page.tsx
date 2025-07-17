"use client";

import { useState } from "react";
import { useSimpleJackGame } from "@/hooks/use-simple-jack";
import { Player } from "@/components/player";
import { GameSetup } from "@/components/game-setup";
import { GameControls } from "@/components/game-controls";
import { EDealingSpeed } from "@/shared/types";

export default function Home() {
  const { gameState, newGame, setGameState, hitMe, stand } =
    useSimpleJackGame();
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  const startGame = (config: {
    playerName: string;
    numPlayers: number;
    dealingSpeed: EDealingSpeed;
  }) => {
    setGameState({
      ...gameState,
      dealingSpeed: config.dealingSpeed,
      players: config.numPlayers,
      playerName: config.playerName,
    });
    setHasCompletedSetup(true);
  };

  const changeSettings = () => {
    setHasCompletedSetup(false);
  };

  // Show setup screen only if user hasn't completed initial setup
  if (!hasCompletedSetup || !gameState.players) {
    return <GameSetup onStartGame={startGame} />;
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
  const canUserChoose = Boolean(
    isUserTurn &&
      !gameState.gameOver &&
      userHand &&
      userHand.cards.length >= 2 &&
      !userHand.hasStood &&
      !userHand.isEliminated
  );

  return (
    <div className="h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 flex flex-col">
      {/* Header with Game Status and Controls */}
      <div className="flex-shrink-0 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Game Title and Current Player */}
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                🃏 Simple Jack
              </h1>
              {!Boolean(gameState.gameOver) && gameState.playerHands && (
                <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-white text-sm font-semibold">
                    <span className="flex items-center space-x-2">
                      <span className="animate-pulse">🎯</span>
                      <span>
                        Current:{" "}
                        {getPlayerDisplayName(gameState.currentPlayerIdx + 1)}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              {gameState.pushMessage && (
                <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-bold">
                  PUSH
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex-shrink-0">
              <GameControls
                canUserChoose={canUserChoose}
                onHit={hitMe}
                onStand={stand}
                gameOver={Boolean(gameState.gameOver)}
                onNewGame={newGame}
                onChangeSettings={changeSettings}
              />
            </div>
          </div>

          {/* Commentary - Compact horizontal scrolling */}
          {gameState.commentary && gameState.commentary.length > 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
                <span className="text-white text-sm font-semibold flex-shrink-0">
                  📢
                </span>
                {gameState.commentary.slice(0, 3).map((comment, index) => (
                  <div
                    key={index}
                    className="text-white text-sm bg-black bg-opacity-20 px-3 py-1 rounded-full flex-shrink-0"
                  >
                    {comment}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Players Grid - Takes remaining space */}
      <div className="flex-1 overflow-auto p-4 pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            {gameState.playerHands &&
              gameState.playerHands.map((player) => (
                <Player
                  key={player.playerId}
                  hand={player}
                  winner={gameState.winner}
                  isCurrentPlayer={
                    gameState.currentPlayerIdx === player.playerId! - 1
                  }
                  isGameOver={Boolean(gameState.gameOver)}
                  displayName={getPlayerDisplayName(player.playerId!)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
