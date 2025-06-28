import { useState } from "react";

import { Card, IGameState, PlayerHand } from "@/shared/types";
import {
  //   playerCardHand,
  //   validateCard,
  validateDeck,
  validatePlayers,
} from "@/lib/simple-jack";
import { generateMockDeck as generateDeck } from "@/lib/utils/mock-deck-generator";

export function useSimpleJackGame(
  numberOfPlayers: number,
  deck?: Card[] | null
) {
  // Validate that the number of players is correct.

  validatePlayers(numberOfPlayers);

  const gameDeck =
    !deck || (Array.isArray(deck) && deck.length === 0) ? generateDeck() : deck;

  // Validate the deck.

  validateDeck(gameDeck);

  // Store the players' hands.

  const playerHands: PlayerHand[] = new Array(numberOfPlayers);

  // Initialize the game state.

  const [gameState, setGameState] = useState<IGameState>({
    currentPlayerIdx: 0,
    cardsDealtOnTurn: 0,
    gameOver: false,
    highScore: 0,
    players: numberOfPlayers,
    gameDeck,
    playerHands,
  });

  return {
    gameState,
    setGameState,
  };
}
