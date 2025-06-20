"use client";

import { useState, useEffect } from "react";

interface Card {
  suit: string;
  value: string;
  displayValue: string;
}

interface PlayerHand {
  playerId: number;
  cards: Card[];
  score: number;
  isEliminated: boolean;
  canDraw: boolean;
}

interface GameState {
  players: PlayerHand[];
  currentPlayerIndex: number;
  gamePhase: "dealing" | "finished";
  winner: number | null;
  commentary: string[];
  deck: string[];
  isDealing: boolean;
}

function createDeck(): string[] {
  const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
  const values = [
    "Ace",
    "King",
    "Queen",
    "Jack",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];
  const deck: string[] = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push(`${suit}-${value}`);
    });
  });

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function parseCard(cardString: string): Card {
  const [suit, value] = cardString.split("-");
  let displayValue = value;

  if (value === "Jack" || value === "Queen" || value === "King") {
    displayValue = value.charAt(0);
  } else if (value === "Ace") {
    displayValue = "A";
  }

  return { suit, value, displayValue };
}

function calculateHandScore(cards: Card[]): number {
  let score = 0;
  let aces = 0;

  // First pass: count non-aces and aces
  cards.forEach((card) => {
    if (card.value === "Ace") {
      aces++;
    } else if (
      card.value === "King" ||
      card.value === "Queen" ||
      card.value === "Jack"
    ) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  });

  // Second pass: add aces optimally
  for (let i = 0; i < aces; i++) {
    if (score + 11 <= 21) {
      score += 11;
    } else {
      score += 1;
    }
  }

  return score;
}

function getSuitSymbol(suit: string): string {
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

function getSuitColor(suit: string): string {
  return suit === "Hearts" || suit === "Diamonds"
    ? "text-red-600"
    : "text-black";
}

export default function Home() {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [dealingSpeed, setDealingSpeed] = useState<number>(2000);

  const startGame = () => {
    const deck = createDeck();
    const players: PlayerHand[] = [];

    for (let i = 0; i < numPlayers; i++) {
      players.push({
        playerId: i + 1,
        cards: [],
        score: 0,
        isEliminated: false,
        canDraw: true,
      });
    }

    setGameState({
      players,
      currentPlayerIndex: 0,
      gamePhase: "dealing",
      winner: null,
      commentary: ["Game started! Dealing cards..."],
      deck,
      isDealing: false,
    });
  };

  const dealNextCard = () => {
    if (!gameState || gameState.gamePhase === "finished") return;

    setGameState((prev) => ({ ...prev!, isDealing: true }));

    setTimeout(() => {
      setGameState((prev) => {
        if (!prev) return null;

        const newState = { ...prev };
        const currentPlayer = newState.players[newState.currentPlayerIndex];

        // Check if current player needs a card
        if (
          currentPlayer.score < 17 &&
          !currentPlayer.isEliminated &&
          newState.deck.length > 0
        ) {
          const cardString = newState.deck.shift()!;
          const card = parseCard(cardString);
          currentPlayer.cards.push(card);
          currentPlayer.score = calculateHandScore(currentPlayer.cards);

          let commentary = `Player ${currentPlayer.playerId} draws ${card.suit}-${card.value}. `;

          if (currentPlayer.score === 21) {
            commentary += `Player ${currentPlayer.playerId} has exactly 21 points and wins!`;
            newState.winner = currentPlayer.playerId;
            newState.gamePhase = "finished";
          } else if (currentPlayer.score > 21) {
            commentary += `Player ${currentPlayer.playerId} busts with ${currentPlayer.score} points and is eliminated.`;
            currentPlayer.isEliminated = true;
          } else if (currentPlayer.score >= 17) {
            commentary += `Player ${currentPlayer.playerId} has ${currentPlayer.score} points and must stand.`;
            currentPlayer.canDraw = false;
          } else {
            commentary += `Player ${currentPlayer.playerId} has ${currentPlayer.score} points and must take another card.`;
          }

          newState.commentary.push(commentary);
        }

        // Move to next player
        let nextPlayerIndex =
          (newState.currentPlayerIndex + 1) % newState.players.length;
        let foundPlayerNeedingCard = false;

        // Check if any player still needs cards
        for (let i = 0; i < newState.players.length; i++) {
          const player = newState.players[nextPlayerIndex];
          if (player.score < 17 && !player.isEliminated) {
            foundPlayerNeedingCard = true;
            break;
          }
          nextPlayerIndex = (nextPlayerIndex + 1) % newState.players.length;
        }

        if (
          !foundPlayerNeedingCard ||
          newState.deck.length === 0 ||
          newState.winner
        ) {
          // Game over - determine winner
          if (!newState.winner) {
            const activePlayers = newState.players.filter(
              (p) => !p.isEliminated
            );
            if (activePlayers.length === 0) {
              newState.commentary.push("All players busted! No winner.");
            } else {
              const highestScore = Math.max(
                ...activePlayers.map((p) => p.score)
              );
              const winners = activePlayers.filter(
                (p) => p.score === highestScore
              );

              if (winners.length === 1) {
                newState.winner = winners[0].playerId;
                newState.commentary.push(
                  `Player ${winners[0].playerId} wins with ${highestScore} points!`
                );
              } else {
                newState.commentary.push(
                  `Tie game! Players ${winners
                    .map((w) => w.playerId)
                    .join(", ")} all have ${highestScore} points.`
                );
              }
            }
          }
          newState.gamePhase = "finished";
        } else {
          newState.currentPlayerIndex = nextPlayerIndex;
        }

        return { ...newState, isDealing: false };
      });
    }, dealingSpeed);
  };

  const resetGame = () => {
    setGameState(null);
  };

  // Auto-deal cards when in dealing phase
  useEffect(() => {
    if (gameState?.gamePhase === "dealing" && !gameState.isDealing) {
      const timer = setTimeout(dealNextCard, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState?.gamePhase,
    gameState?.isDealing,
    gameState?.currentPlayerIndex,
  ]);

  if (!gameState) {
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
              onChange={(e) => setNumPlayers(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
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
            {gameState.gamePhase === "dealing" && (
              <span>
                Dealing cards... Current player:{" "}
                {gameState.currentPlayerIndex + 1}
              </span>
            )}
            {gameState.gamePhase === "finished" && <span>Game Complete!</span>}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gameState.players.map((player) => (
            <div
              key={player.playerId}
              className={`bg-white rounded-lg p-6 shadow-lg ${
                gameState.currentPlayerIndex === player.playerId - 1 &&
                gameState.gamePhase === "dealing"
                  ? "ring-4 ring-yellow-400"
                  : ""
              } ${player.isEliminated ? "opacity-50" : ""} ${
                gameState.winner === player.playerId
                  ? "ring-4 ring-green-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Player {player.playerId}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {player.score}
                  </div>
                  {player.isEliminated && (
                    <div className="text-red-600 font-semibold">BUST</div>
                  )}
                  {gameState.winner === player.playerId && (
                    <div className="text-green-600 font-semibold">WINNER!</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {player.cards.map((card, index) => (
                  <div
                    key={index}
                    className={`bg-white border-2 border-gray-300 rounded-lg p-2 text-center shadow-sm ${getSuitColor(
                      card.suit
                    )}`}
                  >
                    <div className="text-lg font-bold">{card.displayValue}</div>
                    <div className="text-xl">{getSuitSymbol(card.suit)}</div>
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
            {gameState.commentary.map((comment, index) => (
              <div key={index} className="text-gray-700 p-2 bg-gray-50 rounded">
                {comment}
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        {gameState.gamePhase === "finished" && (
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
