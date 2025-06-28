import { useEffect, useState } from "react";

import { IGameState, PlayerHand } from "@/shared/types";
import {
  //   playerCardHand,
  //   validateCard,
  validateDeck,
  validatePlayers,
} from "@/lib/simple-jack";
import { generateMockDeck as generateDeck } from "@/lib/utils/mock-deck-generator";

export function useSimpleJackGame() {
  const gameDeck = generateDeck();

  // Validate the deck.

  validateDeck(gameDeck);

  // Initialize the game state.

  const [gameState, setGameState] = useState<IGameState>({
    currentPlayerIdx: 0,
    cardsDealtOnTurn: 0,
    gameOver: false,
    highScore: 0,
    gameDeck,
  });

  useEffect(() => {
    // This will initialize the game when the number of players is passed.
    if (gameState.players) {
      // Validate number of players

      validatePlayers(gameState.players);

      // Store the players' hands.

      const playerHands: PlayerHand[] = new Array(gameState.players);

      setGameState({
        ...gameState,
        playerHands,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.players]);

  return {
    gameState,
    setGameState,
  };
}
