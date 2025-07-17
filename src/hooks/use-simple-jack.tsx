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
  generateMockDeck as generateDeck,
  getHandScore,
} from "@/lib/utils";

export function useSimpleJackGame(props?: IGameProps) {
  const gameDeck = props?.deck ? props.deck : generateDeck();
  const playerName = props?.playerName ? props.playerName : undefined;

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
    playerName,
    gameDeck,
  });

  const resetGame = () => {
    // Generate and validate a new deck.

    const gameDeck = generateDeck();
    validateDeck(gameDeck);

    // Reset the game state but preserve player settings.

    setGameState((prevState) => {
      // Initialize fresh player hands
      const playerHands: PlayerHand[] = prevState.players
        ? Array.from({ length: prevState.players }, (_, i) =>
            playerCardHand(i + 1)
          )
        : [];

      return {
        cardsDealtOnTurn: 0,
        commentary: [],
        currentPlayerIdx: 0,
        gameOver: false,
        highScore: 0,
        gameDeck,
        // Preserve these settings from previous game
        players: prevState.players,
        playerName: prevState.playerName,
        dealingSpeed: prevState.dealingSpeed,
        // Initialize fresh player hands immediately
        playerHands: prevState.players ? playerHands : undefined,
        // Clear game-specific state
        winner: undefined,
        pushMessage: undefined,
        gameSummary: undefined,
      };
    });
  };

  const newGame = () => {
    resetGame();
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

      // Force the next player transition immediately
      const nextPlayerIdx = 1 < gameState.players! ? 1 : 0;

      // Use the same timeout pattern as dealCardToCurrentPlayer to ensure proper state transition
      setTimeout(() => {
        setGameState({
          ...gameState,
          commentary,
          currentPlayerIdx: nextPlayerIdx,
          playerHands,
          cardsDealtOnTurn:
            nextPlayerIdx === 0 ? 0 : gameState.cardsDealtOnTurn,
        });
      }, gameState.dealingSpeed || 100);
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

    // Initialize the card deal validator.

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
            createGameSummary(
              {
                ...gameState,
                commentary: updatedCommentary,
                gameOver: true,
                highScore: SIMPLE_JACK_SCORE,
                playerHands: updatedPlayerHands,
                winner: updatedPlayerHands[i].playerId,
              },
              getPlayerDisplayName
            )
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

  const hitMe = () => {
    if (gameState.currentPlayerIdx === 0 && gameState.playerHands?.[0]) {
      dealCardToCurrentPlayer();
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
      playerHands,
      players,
      winner,
    } = gameState;

    if (!gameOver && playerHands) {
      // Check if it's the user's turn and they have 2+ cards and haven't stood yet.

      const isUserTurn = i === 0;
      const userHand = playerHands[0];
      const userCanChoose =
        isUserTurn &&
        userHand &&
        userHand.cards.length >= 2 &&
        !userHand.hasStood &&
        !userHand.isEliminated;

      // If it's the user's turn and they can choose, wait for their decision.
      // BUT if the user has stood, we should move to the next player immediately

      if (userCanChoose) {
        return;
      }

      // Handle the case where user has stood but currentPlayerIdx hasn't updated yet
      if (isUserTurn && userHand?.hasStood && i === 0) {
        const nextPlayerIdx = 1 < players! ? 1 : 0;
        setGameState({
          ...gameState,
          currentPlayerIdx: nextPlayerIdx,
          cardsDealtOnTurn:
            nextPlayerIdx === 0 ? 0 : gameState.cardsDealtOnTurn,
        });
        return;
      }

      if (
        playerHands[i]?.score < MUST_STAND_SCORE &&
        !playerHands[i]?.hasStood
      ) {
        if (gameDeck!.length <= 0) {
          setGameState(
            createGameSummary(
              {
                ...gameState,
                commentary,
                gameOver: true,
              },
              getPlayerDisplayName
            )
          );
        } else {
          dealCardToCurrentPlayer();
        }
      } else {
        const nextPlayerIdx = i + 1 < players! ? i + 1 : 0;

        if (nextPlayerIdx === 0) {
          // Back to the first player.

          if (cardsDealtOnTurn === 0) {
            // If no cards have been dealt in the round, end the game.

            setGameState({
              ...gameState,
              commentary,
              gameOver: true,
            });
          } else {
            // Deal to the first player.

            setGameState({
              ...gameState,
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
      const activePlayers = playerHands.filter((hand) => !hand.isEliminated);

      if (activePlayers.length === 0) {
        // All players busted
        const updatedCommentary = [...commentary];
        updatedCommentary.unshift("All players have busted!");

        setGameState(
          createGameSummary(
            {
              ...gameState,
              commentary: updatedCommentary,
              winner: -1,
              pushMessage: "Push - All players have busted.",
            },
            getPlayerDisplayName
          )
        );
      } else {
        // Find the actual highest score among active (non-eliminated) players
        const actualHighScore = Math.max(
          ...activePlayers.map((hand) => hand.score)
        );

        const highScores = activePlayers.filter(
          (hand) => hand.score === actualHighScore
        );

        if (highScores.length === 1) {
          // We have a winner.

          const updatedCommentary = [...commentary];
          updatedCommentary.unshift(
            `${getPlayerDisplayName(
              highScores[0].playerId as number
            )} wins with the highest score of ${highScores[0].score}!`
          );

          setGameState(
            createGameSummary(
              {
                ...gameState,
                commentary: updatedCommentary,
                winner: highScores[0].playerId,
                highScore: actualHighScore,
              },
              getPlayerDisplayName
            )
          );
        } else {
          // Push - multiple players tied

          const tiedPlayerNames = highScores
            .map((hand) => getPlayerDisplayName(hand.playerId as number))
            .join(" and ");

          const updatedCommentary = [...commentary];
          updatedCommentary.unshift(
            `Push - ${tiedPlayerNames} are tied with ${actualHighScore} points.`
          );

          setGameState(
            createGameSummary(
              {
                ...gameState,
                commentary: updatedCommentary,
                winner: -1,
                pushMessage: `Push - ${tiedPlayerNames} are tied with ${actualHighScore} points.`,
                highScore: actualHighScore,
              },
              getPlayerDisplayName
            )
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return {
    gameState,
    resetGame,
    newGame,
    setGameState,
    hitMe,
    stand,
  };
}
