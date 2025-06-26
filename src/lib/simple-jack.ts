"use strict";

import { Card, CardValue, PlayerHand, Suit } from "@/shared/types";
import { generateMockDeck } from "@/lib/utils/mock-deck-generator";

import {
  validationData,
  DECK_SIZE,
  MAX_PLAYERS,
  MIN_PLAYERS,
  MUST_STAND_SCORE,
  SIMPLE_JACK_SCORE,
} from "@/shared/constants";

/**
 * isCardValid - Validates a card based on validation data.
 *  Returns true if the card is valid.
 *  Throws an error if not valid.
 *
 * @param testCard {Card}
 * @returns boolean
 */
export function isCardValid(testCard: Card): boolean {
  const [suit, value] = testCard.split("-");
  if (
    !validationData.suits[suit as Suit] ||
    !validationData.values[value as CardValue]
  ) {
    throw new Error("Card is not valid.");
  }
  return true;
}

/**
 * validateDeck - Throws an Error if the deck is not valid.
 *
 * @param deck {Card[]}
 */
export function validateDeck(deck: Card[]): void {
  if (!deck || !Array.isArray(deck)) {
    throw new Error("deck must be an array");
  }
  if (deck.length !== DECK_SIZE) {
    throw new Error(`The deck must have ${DECK_SIZE} cards.`);
  }
  if (new Set(deck).size !== DECK_SIZE) {
    throw new Error(`The deck must have ${DECK_SIZE} unique cards.`);
  }
  if (!deck.every((card) => isCardValid(card))) {
    throw new Error("All cards in deck must be valid.");
  }
}

/**
 * validatePlayers - Throws an error if the number of players is invalid.
 *
 * @param players {number}
 */
export function validatePlayers(players: number) {
  if (
    !players ||
    players < MIN_PLAYERS ||
    players > MAX_PLAYERS ||
    typeof players !== "number"
  ) {
    throw new Error(`There must be ${MIN_PLAYERS} to ${MAX_PLAYERS} players.`);
  }
}

/**
 * getCardValue - Determines the card value.
 *
 * @param card {Card}
 * @param currentScore {number}
 * @returns {number}
 */
export function getCardValue(card: Card, currentScore: number): number {
  if (!card) {
    throw new Error("Card has empty value.");
  }
  const cardPartArr = card.split("-");
  const rawValue = cardPartArr[1];
  if (rawValue === "King" || rawValue === "Queen" || rawValue === "Jack") {
    return 10;
  } else if (rawValue === "Ace") {
    // Ace can be 11 or 1.
    // Calculates the correct value based on current score.
    if (currentScore + 11 <= SIMPLE_JACK_SCORE) {
      return 11;
    } else {
      return 1;
    }
  } else {
    const parsedValue = Number(rawValue);
    if (isNaN(parsedValue)) {
      throw new Error("Card value is not valid.");
    }
    return parsedValue;
  }
}

/**
 * validateCard
 *
 * Returns a function which validates a card and saves
 *  the card to the cardsDealt property.
 *  If the card is invalid it throws an error.
 *
 * @returns {function}
 */
function validateCard(): (testCard: Card) => Card {
  const cardsDealt: Card[] = [];
  return function (testCard: Card): Card {
    if (isCardValid(testCard)) {
      cardsDealt.push(testCard);
      return testCard;
    }
    throw new Error("Invalid card dealt");
  };
}

export function simpleJack(props: {
  deck?: Card[] | null;
  players: number;
}): string | null {
  const { deck, players } = props;

  // Validate that the number of players is correct.
  validatePlayers(players);

  // Generate a deck if none is provided, otherwise validate the provided deck
  const gameDeck = deck ? [...deck] : generateMockDeck();
  validateDeck(gameDeck);

  function playerCardHand(id: number): PlayerHand {
    const cards: Card[] = [];
    const cardsToString = function (): string {
      const str = `[${cards.reduce((acc, card, idx, arr) => {
        if (idx === arr.length - 1) {
          return acc + "'" + card + "'";
        } else {
          return acc + "'" + card + "'" + ", ";
        }
      }, "")}]`;
      return str;
    };
    return {
      cards,
      cardsToString,
      playerId: id,
      score: 0,
    };
  }

  // Initialize.
  let winner: number | undefined;
  let gameOver = false;
  let highScore = 0;

  // Store the players' hands.

  const playerHands: PlayerHand[] = new Array(players);

  // Keep dealing until the game is over.

  const validator = validateCard();

  while (!gameOver) {
    // Initialize cards dealt on turn.
    let cardsDealtOnTurn = 0;

    // Deal cards to each player if required.
    for (let i = 0; i < players; i += 1) {
      // Initialize player hand object on first turn.
      if (!playerHands[i]) {
        playerHands[i] = playerCardHand(i + 1);
      }

      if (playerHands[i]?.score < MUST_STAND_SCORE) {
        // Deal a card
        //  and check if the card is valid.

        // Check for an exhausted deck.
        if (gameDeck.length <= 0) {
          gameOver = true;
          break;
        }

        const playerCard = validator(gameDeck.shift()!);

        // Increment cards dealt on turn.
        cardsDealtOnTurn += 1;

        playerHands[i].score += getCardValue(playerCard, playerHands[i].score);

        playerHands[i].cards.push(playerCard);

        if (playerHands[i].score === SIMPLE_JACK_SCORE) {
          winner = playerHands[i].playerId;
          gameOver = true;
          highScore = SIMPLE_JACK_SCORE;
          break;
        } else if (playerHands[i].score < SIMPLE_JACK_SCORE) {
          highScore =
            playerHands[i].score > highScore ? playerHands[i].score : highScore;
        }
      }
    }

    if (cardsDealtOnTurn === 0) {
      // Exits outer loop.
      gameOver = true;
    }
  }

  if (!winner) {
    const highScores = playerHands.filter((hand) => hand.score === highScore);
    if (highScores.length === 1) {
      winner = highScores[0].playerId;
    } else {
      return null;
    }
  }

  return winner
    ? `Winner: ${winner}, Hand: ${playerHands[
        winner - 1
      ].cardsToString()}, Value: ${highScore}`
    : null;
}
