import { useEffect, useState } from "react";

import { IGameState, PlayerHand } from "@/shared/types";
import { MUST_STAND_SCORE, SIMPLE_JACK_SCORE } from "@/shared/constants";
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
      highScore,
      playerHands,
      players,
      winner,
    } = gameState;

    if (!gameOver && playerHands) {
      // Initialize player hand object on first turn.

      if (!playerHands[i]) {
        playerHands[i] = playerCardHand(i + 1);
      }

      if (playerHands[i]?.score < MUST_STAND_SCORE) {
        // First check for an exhausted deck.

        if (gameDeck!.length <= 0) {
          setGameState({
            ...gameState,
            gameOver: true,
          });
        } else {
          // Deal a card.

          const playerCard = validator(gameDeck!.shift()!);

          playerHands[i].score += getCardValue(
            playerCard,
            playerHands[i].score
          );

          playerHands[i].cards.push(playerCard);

          const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

          // Check for winner and update highScore

          if (playerHands[i].score === SIMPLE_JACK_SCORE) {
            // End the game and set the winner.

            setTimeout(
              () =>
                setGameState({
                  ...gameState,
                  gameOver: true,
                  highScore: SIMPLE_JACK_SCORE,
                  playerHands,
                  winner: playerHands[i].playerId,
                }),
              1000
            );
          } else if (playerHands[i].score < SIMPLE_JACK_SCORE) {
            setTimeout(
              () =>
                setGameState({
                  ...gameState,
                  // Increment cards on turn or reset.
                  cardsDealtOnTurn:
                    nextPlayerIdx === 0 ? 0 : cardsDealtOnTurn + 1,
                  currentPlayerIdx: nextPlayerIdx,
                  highScore:
                    playerHands[i].score > highScore
                      ? playerHands[i].score
                      : highScore,
                  playerHands,
                  gameDeck,
                }),
              1000
            );
          } else {
            setTimeout(
              () =>
                setGameState({
                  ...gameState,
                  // Increment cards on turn or reset.
                  cardsDealtOnTurn:
                    nextPlayerIdx === 0 ? 0 : cardsDealtOnTurn + 1,
                  currentPlayerIdx: nextPlayerIdx,
                  playerHands,
                  gameDeck,
                }),
              1000
            );
          }
        }
      } else {
        // If the player can't take a hit try the next player if able.

        // Check to see if no cards have been dealt this round.

        const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

        if (nextPlayerIdx === 0) {
          // Now back at the first player.

          if (cardsDealtOnTurn === 0) {
            // If no cards have been dealt in the round end the game.

            setGameState({
              ...gameState,
              gameOver: true,
            });
          } else {
            // Deal to the first player.

            setGameState({
              ...gameState,
              currentPlayerIdx: nextPlayerIdx,
              // Reset cardsDealtOnTurn.
              cardsDealtOnTurn: 0,
            });
          }
        } else {
          // Deal to the next player.

          setGameState({
            ...gameState,
            currentPlayerIdx: nextPlayerIdx,
          });
        }
      }
    }

    if (gameOver && playerHands && !winner) {
      const highScores = playerHands.filter((hand) => hand.score === highScore);
      if (highScores.length === 1) {
        // We have a winner.

        setGameState({
          ...gameState,
          winner: highScores[0].playerId,
        });
      } else {
        // Push

        setGameState({
          ...gameState,
          winner: -1,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return {
    gameState,
    setGameState,
  };
}
