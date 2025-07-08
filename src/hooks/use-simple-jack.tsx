import { useEffect, useState } from "react";

import {
  Card,
  EDealingSpeed,
  IGameProps,
  IGameState,
  PlayerHand,
} from "@/shared/types";
import { MUST_STAND_SCORE, SIMPLE_JACK_SCORE } from "@/shared/constants";
import {
  playerCardHand,
  validateCard,
  validateDeck,
  validatePlayers,
} from "@/lib/simple-jack";
import {
  createGameSummary,
  gameCommentary,
  generateMockDeck as generateDeck,
  getHandScore,
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
    const gameDeck = generateDeck();
    validateDeck(gameDeck);

    setGameState({
      cardsDealtOnTurn: 0,
      commentary: [],
      currentPlayerIdx: 0,
      gameOver: false,
      highScore: 0,
      gameDeck,
    });
  };
  const getPlayerDisplayName = (playerId: number) => {
    if (playerId === 1) {
      return gameState.playerName || "Player";
    }
    if (playerId === gameState.players) {
      return "Dealer";
    }
    return `Player ${playerId}`;
  };

  const hitMe = () => {
    if (gameState.currentPlayerIdx === 0 && gameState.playerHands?.[0]) {
      dealCardToCurrentPlayer();
    }
  };

  const stand = () => {
    if (gameState.currentPlayerIdx === 0 && gameState.playerHands?.[0]) {
      const playerHands = [...gameState.playerHands];
      playerHands[0].hasStood = true;

      const commentary = [...gameState.commentary];
      commentary.unshift(
        `${getPlayerDisplayName(1)} chooses to stand with ${
          playerHands[0].score
        }`
      );

      const nextPlayerIdx = 1 < gameState.players! ? 1 : 0;

      setGameState({
        ...gameState,
        commentary,
        currentPlayerIdx: nextPlayerIdx,
        playerHands,
        cardsDealtOnTurn: nextPlayerIdx === 0 ? 0 : gameState.cardsDealtOnTurn,
      });
    }
  };

  const dealCardToCurrentPlayer = () => {
    const {
      commentary,
      currentPlayerIdx: i,
      gameDeck,
      playerHands,
    } = gameState;

    if (!playerHands || !gameDeck || gameDeck.length <= 0) return;

    const validator = validateCard();
    const playerCard: Card = validator(gameDeck.shift()!);
    const updatedPlayerHands = [...playerHands];

    updatedPlayerHands[i].cards.push(playerCard);
    updatedPlayerHands[i].score = getHandScore(updatedPlayerHands[i].cards);

    const updatedCommentary = [...commentary];
    updatedCommentary.unshift(
      `${getPlayerDisplayName(
        updatedPlayerHands[i].playerId as number
      )} draws ${playerCard.replace("-", " of ")}`
    );

    const nextPlayerIdx = i + 1 < gameState.players! ? i + 1 : 0;

    if (updatedPlayerHands[i].score === SIMPLE_JACK_SCORE) {
      updatedCommentary.unshift(
        `${getPlayerDisplayName(
          updatedPlayerHands[i].playerId as number
        )} hits 21!`
      );

      setTimeout(
        () =>
          setGameState(
            createGameSummary({
              ...gameState,
              commentary: updatedCommentary,
              gameOver: true,
              highScore: SIMPLE_JACK_SCORE,
              playerHands: updatedPlayerHands,
              winner: updatedPlayerHands[i].playerId,
            })
          ),
        gameState.dealingSpeed || EDealingSpeed.normal
      );
    } else if (updatedPlayerHands[i].score < SIMPLE_JACK_SCORE) {
      setTimeout(
        () =>
          setGameState({
            ...gameState,
            cardsDealtOnTurn:
              nextPlayerIdx === 0 ? 0 : gameState.cardsDealtOnTurn + 1,
            commentary: updatedCommentary,
            currentPlayerIdx: nextPlayerIdx,
            highScore:
              updatedPlayerHands[i].score > gameState.highScore
                ? updatedPlayerHands[i].score
                : gameState.highScore,
            playerHands: updatedPlayerHands,
            gameDeck,
          }),
        gameState.dealingSpeed || EDealingSpeed.normal
      );
    } else {
      updatedPlayerHands[i].isEliminated = true;
      updatedCommentary.unshift(
        `${getPlayerDisplayName(
          updatedPlayerHands[i].playerId as number
        )} busts with ${updatedPlayerHands[i].score}!`
      );

      setTimeout(
        () =>
          setGameState({
            ...gameState,
            cardsDealtOnTurn:
              nextPlayerIdx === 0 ? 0 : gameState.cardsDealtOnTurn + 1,
            commentary: updatedCommentary,
            currentPlayerIdx: nextPlayerIdx,
            playerHands: updatedPlayerHands,
            gameDeck,
          }),
        gameState.dealingSpeed || EDealingSpeed.normal
      );
    }
  };

  useEffect(() => {
    // This will initialize the game when the number of players is passed.
    if (gameState.players) {
      // Validate number of players

      validatePlayers(gameState.players);

      // Store the players' hands - initialize all players immediately.

      const playerHands: PlayerHand[] = Array.from(
        { length: gameState.players },
        (_, i) => playerCardHand(i + 1)
      );

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
      // Check if it's the user's turn and they have 2+ cards
      const isUserTurn = i === 0;
      const userHand = playerHands[0];
      const userCanChoose =
        isUserTurn &&
        userHand &&
        userHand.cards.length >= 2 &&
        !userHand.hasStood &&
        !userHand.isEliminated;

      // If it's the user's turn and they can choose, wait for their decision
      if (userCanChoose) {
        return;
      }

      if (
        playerHands[i]?.score < MUST_STAND_SCORE &&
        !playerHands[i]?.hasStood
      ) {
        if (gameDeck!.length <= 0) {
          setGameState(
            createGameSummary({
              ...gameState,
              commentary,
              gameOver: true,
            })
          );
        } else {
          dealCardToCurrentPlayer();
        }
      } else {
        const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

        if (nextPlayerIdx === 0) {
          if (cardsDealtOnTurn === 0) {
            setGameState({
              ...gameState,
              commentary,
              gameOver: true,
            });
          } else {
            setGameState({
              ...gameState,
              cardsDealtOnTurn: 0,
              commentary,
              currentPlayerIdx: nextPlayerIdx,
            });
          }
        } else {
          setGameState({
            ...gameState,
            commentary,
            currentPlayerIdx: nextPlayerIdx,
          });
        }
      }
    }

    if (gameOver && playerHands && !winner) {
      const activePlayers = playerHands.filter((hand) => !hand.isEliminated);
      const highScores = activePlayers.filter(
        (hand) => hand.score === highScore
      );

      if (highScores.length === 1) {
        const updatedCommentary = [...commentary];
        updatedCommentary.unshift(
          `${getPlayerDisplayName(
            highScores[0].playerId as number
          )} wins with the highest score of ${highScores[0].score}!`
        );

        setGameState(
          createGameSummary({
            ...gameState,
            commentary: updatedCommentary,
            winner: highScores[0].playerId,
          })
        );
      } else {
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
    hitMe,
    stand,
  };
}
