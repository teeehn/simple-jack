import { useEffect, useState } from "react";

import { IGameState, PlayerHand } from "@/shared/types";
import { MUST_STAND_SCORE } from "@/shared/constants";
import {
  getCardValue,
  playerCardHand,
  validateCard,
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

  // Initialize the card deal validator.

  const validator = validateCard();

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

  useEffect(() => {
    const {
      cardsDealtOnTurn,
      currentPlayerIdx: i,
      gameDeck,
      gameOver,
      playerHands,
      players,
    } = gameState;
    if (!gameOver && playerHands) {
      // Initialize player hand object on first turn.
      if (!playerHands[i]) {
        playerHands[i] = playerCardHand(i + 1);
      }
      if (playerHands[i]?.score < MUST_STAND_SCORE) {
        // Deal a card
        //  and check if the card is valid.

        // Check for an exhausted deck.

        if (gameDeck!.length <= 0) {
          setGameState({
            ...gameState,
            gameOver: true,
          });
        } else {
          const playerCard = validator(gameDeck!.shift()!);

          playerHands[i].score += getCardValue(
            playerCard,
            playerHands[i].score
          );

          playerHands[i].cards.push(playerCard);

          setTimeout(
            () =>
              setGameState({
                ...gameState,
                // Increment cards on turn.
                cardsDealtOnTurn: cardsDealtOnTurn + 1,
                currentPlayerIdx: i + 1 < players! ? i + 1 : 0,
                playerHands,
                gameDeck,
              }),
            1000
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return {
    gameState,
    setGameState,
  };
}
