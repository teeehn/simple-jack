"use strict";

import { Card, CardValue, Suit, TestCase } from "@/shared/types";

/**
 * Creates a test deck of 52 unique strings which represent
 *  cards in a deck.
 *
 * There are 4 Suits: Clubs, Diamonds, Hearts, Spades.
 *
 * Each suit consists of the following card identities: Ace, King, Queen, Jack,
 *  2, 3, 4, 5, 6, 7, 8, 9, 10.
 *
 * The format of a card is Suit-CardIdentity. For example: `Spades-Ace`, `Hearts-8`, `Clubs-King`.
 *
 * The test case argument testCase is either:
 * 1) An array of unique and properly formatted cards. For example:
 *  `['Spades-Ace', 'Hearts-8', 'Clubs-King']` or
 * 2) An object where each key is a player Id ranging from 1 to 6.
 *  The value of each key is an array of properly formatted cards representing the hand
 *  held by each player. In generating the test deck it is assumed that the cards would
 *  be dealt 1 at a time, sequentially to each player.
 *  Here is an example testCase object for 2 players:
 *  {
 *      "1": ['Spades-Ace', 'Clubs-9'],
 *      "2": ['Hearts-3', 'Diamonds-4', 'Hearts-Ace']
 *  }
 *
 * The function should return an array of 52 unique, valid cards, stacked so that the
 *  testCase cards are dealt as expected and the remainder of the deck is in random order.
 *
 * @param {object | array} testCase
 * @return {array}
 */

export function generateMockDeck(testCase?: TestCase | null): Card[] {
  // Define the complete deck of 52 cards
  const suits: Suit[] = ["Clubs", "Diamonds", "Hearts", "Spades"];
  const ranks: CardValue[] = [
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

  const fullDeck: Card[] = suits.flatMap((suit) =>
    ranks.map((rank): Card => `${suit}-${rank}`)
  );

  // If no test case is provided, return a shuffled full deck
  if (!testCase) {
    const shuffledDeck = [...fullDeck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  }

  // Validate that testCase cards are valid
  const validateCard = (card: unknown): card is Card => {
    if (typeof card !== "string" || card === null) return false;
    const parts = card.split("-");
    if (parts.length !== 2) return false;
    const [suit, rank] = parts;
    return suits.includes(suit as Suit) && ranks.includes(rank as CardValue);
  };

  let testCards: Card[] = [];

  if (Array.isArray(testCase)) {
    // Handle array format
    testCards = [...testCase];
  } else if (testCase && typeof testCase === "object") {
    // Handle object format (players)
    const playerIds = Object.keys(testCase)
      .map(Number)
      .sort((a, b) => a - b);

    // Validate player IDs are between 1 and 6
    if (playerIds.some((id) => id < 1 || id > 6)) {
      throw new Error("Player IDs must be between 1 and 6");
    }

    // Deal cards sequentially to players
    const maxHandSize = Math.max(
      ...Object.values(testCase).map((hand) => hand.length)
    );

    for (let cardIndex = 0; cardIndex < maxHandSize; cardIndex++) {
      for (const playerId of playerIds) {
        const playerHand = testCase[playerId.toString()];
        if (cardIndex < playerHand.length) {
          testCards.push(playerHand[cardIndex]);
        }
      }
    }
  } else {
    throw new Error("testCase must be an array or object");
  }

  // Validate all test cards
  const invalidCards = testCards.filter((card) => !validateCard(card));
  if (invalidCards.length > 0) {
    const invalidCardStrings = invalidCards.map((card) => String(card));
    throw new Error(`Invalid cards found: ${invalidCardStrings.join(", ")}`);
  }

  // Check for duplicates in test cards
  const uniqueTestCards = new Set(testCards);
  if (uniqueTestCards.size !== testCards.length) {
    throw new Error("Duplicate cards found in testCase");
  }

  // Check that all test cards exist in the full deck
  const invalidTestCards = testCards.filter((card) => !fullDeck.includes(card));
  if (invalidTestCards.length > 0) {
    throw new Error(
      `Test cards not in standard deck: ${invalidTestCards.join(", ")}`
    );
  }

  // Create remaining cards (excluding test cards)
  const remainingCards = fullDeck.filter((card) => !uniqueTestCards.has(card));

  // Shuffle remaining cards randomly
  const shuffledRemaining = [...remainingCards];
  for (let i = shuffledRemaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRemaining[i], shuffledRemaining[j]] = [
      shuffledRemaining[j],
      shuffledRemaining[i],
    ];
  }

  // Return test cards followed by shuffled remaining cards
  return [...testCards, ...shuffledRemaining];
}
