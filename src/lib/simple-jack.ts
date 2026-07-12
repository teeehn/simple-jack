"use strict";

import { getCardParts } from "@/lib/utils";

import { Card, CardValue, PlayerHand, Suit } from "@/shared/types";

import {
  validationData,
  DECK_SIZE,
  MAX_PLAYERS,
  MIN_PLAYERS,
  SIMPLE_JACK_SCORE,
} from "@/shared/constants";

/**
 * isCardValid - Returns true if the card is valid, false otherwise.
 *
 * @param testCard {Card}
 * @returns boolean
 */
export function isCardValid(testCard: Card): boolean {
  if (!testCard) return false; // getCardParts throws on null/undefined; predicates must not throw
  const { suit, value } = getCardParts(testCard);
  return (
    !!validationData.suits[suit as Suit] &&
    !!validationData.values[value as CardValue]
  );
}

/**
 * assertCardValid - Throws an error if the card is not valid.
 *
 * @param testCard {Card}
 */
export function assertCardValid(testCard: Card): void {
  if (!isCardValid(testCard)) {
    throw new Error("Card is not valid.");
  }
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
  deck.forEach((card) => assertCardValid(card));
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
export function getCardValue(card: Card, currentScore?: number): number {
  if (!card) {
    throw new Error("Card has empty value.");
  }
  const rawValue = getCardParts(card).value;
  if (rawValue === "King" || rawValue === "Queen" || rawValue === "Jack") {
    return 10;
  } else if (rawValue === "Ace") {
    // Ace can be 11 or 1.
    // Calculates the correct value based on current score.
    const currentScoreValue = currentScore || 0;
    if (currentScoreValue + 11 <= SIMPLE_JACK_SCORE) {
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
 * createDealValidator - Returns a function that validates a card and tracks
 *  it in the cards dealt for the current game. Throws if the card is invalid.
 *
 * @returns {function}
 */
export function createDealValidator(): (testCard: Card) => Card {
  const cardsDealt: Card[] = [];
  return function (testCard: Card): Card {
    assertCardValid(testCard);
    cardsDealt.push(testCard);
    return testCard;
  };
}

export function playerCardHand(id: number, initialCards: Card[] = []): PlayerHand {
  const cards: Card[] = [...initialCards];
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
