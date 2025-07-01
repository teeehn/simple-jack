import { useEffect, useState } from "react";

import { Card, IGameProps, IGameState, PlayerHand } from "@/shared/types";
import { MUST_STAND_SCORE, SIMPLE_JACK_SCORE } from "@/shared/constants";
import {
  getCardValue,
  playerCardHand,
  validateCard,
  validateDeck,
  validatePlayers,
} from "@/lib/simple-jack";
import {
  createGameSummary,
  gameCommentary,
  generateMockDeck as generateDeck,
} from "@/lib/utils";

export function useSimpleJackGame(props?: IGameProps) {
  const gameDeck = props?.deck ? props.deck : generateDeck();

  // Validate the deck.

  validateDeck(gameDeck);

  // Initialize the game state.

  const [gameState, setGameState] = useState<IGameState>({
    cardsDealtOnTurn: 0,
    commentary: [],
    currentPlayerIdx: 0,
    gameOver: false,
    highScore: 0,
    players: props?.players,
    gameDeck,
  });

  const resetGame = () => {
    // Generate and validate a new deck.

    const gameDeck = generateDeck();
    validateDeck(gameDeck);

    // Reset the game state.

    setGameState({
      cardsDealtOnTurn: 0,
      commentary: [],
      currentPlayerIdx: 0,
      gameOver: false,
      highScore: 0,
      gameDeck,
    });
  };

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
      commentary,
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
          setGameState(
            createGameSummary({
              ...gameState,
              commentary,
              gameOver: true,
            })
          );
        } else {
          // Deal a card.

          const playerCard: Card = validator(gameDeck!.shift()!);

          playerHands[i].score += getCardValue(
            playerCard,
            playerHands[i].score
          );

          playerHands[i].cards.push(playerCard);

          commentary.unshift(
            gameCommentary.playerDraws(
              playerHands[i]?.playerId as number,
              playerCard
            )
          );

          const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

          // Check for winner and update highScore

          if (playerHands[i].score === SIMPLE_JACK_SCORE) {
            // End the game and set the winner.

            commentary.unshift(
              gameCommentary.player21(playerHands[i]?.playerId as number)
            );

            setTimeout(
              () =>
                setGameState(
                  createGameSummary({
                    ...gameState,
                    commentary,
                    gameOver: true,
                    highScore: SIMPLE_JACK_SCORE,
                    playerHands,
                    winner: playerHands[i].playerId,
                  })
                ),
              1000
            );
          } else if (playerHands[i].score < SIMPLE_JACK_SCORE) {
            // commentary.unshift(
            //   gameCommentary.playerMustDraw(
            //     playerHands[i].playerId as number,
            //     playerHands[i].score
            //   )
            // );

            setTimeout(
              () =>
                setGameState({
                  ...gameState,
                  // Increment cards on turn or reset.
                  cardsDealtOnTurn:
                    nextPlayerIdx === 0 ? 0 : cardsDealtOnTurn + 1,
                  commentary,
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
            // Player busts.

            playerHands[i].isEliminated = true;

            // commentary.unshift(
            //   gameCommentary.playerBusts(
            //     playerHands[i].playerId as number,
            //     playerHands[i].score
            //   )
            // );

            setTimeout(
              () =>
                setGameState({
                  ...gameState,
                  // Increment cards on turn or reset.
                  cardsDealtOnTurn:
                    nextPlayerIdx === 0 ? 0 : cardsDealtOnTurn + 1,
                  commentary,
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

        // commentary.unshift(
        //   gameCommentary.playerMustStand(
        //     playerHands[i].playerId as number,
        //     playerHands[i].score
        //   )
        // );

        // Check to see if no cards have been dealt this round.

        const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

        if (nextPlayerIdx === 0) {
          // Now back at the first player.

          if (cardsDealtOnTurn === 0) {
            // If no cards have been dealt in the round end the game.

            setGameState({
              ...gameState,
              commentary,
              gameOver: true,
            });
          } else {
            // Deal to the first player.

            setGameState({
              ...gameState,
              // Reset cardsDealtOnTurn.
              cardsDealtOnTurn: 0,
              commentary,
              currentPlayerIdx: nextPlayerIdx,
            });
          }
        } else {
          // Deal to the next player.

          setGameState({
            ...gameState,
            commentary,
            currentPlayerIdx: nextPlayerIdx,
          });
        }
      }
    }

    if (gameOver && playerHands && !winner) {
      const highScores = playerHands.filter((hand) => hand.score === highScore);
      if (highScores.length === 1) {
        // We have a winner.

        commentary.unshift(
          gameCommentary.playerWinsHighestScore(
            highScores[0].playerId as number,
            highScores[0].score
          )
        );

        setGameState(
          createGameSummary({
            ...gameState,
            commentary,
            winner: highScores[0].playerId,
          })
        );
      } else {
        // Push

        // TODO: Add commentary here.

        setGameState(
          createGameSummary({
            ...gameState,
            commentary,
            winner: -1,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return {
    gameState,
    resetGame,
    setGameState,
  };
}
