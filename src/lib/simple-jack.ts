"use strict";

export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type CardValue =
  | "Ace"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "Jack"
  | "Queen"
  | "King";
export type Card = `${Suit}-${CardValue}`;

interface ValidationData {
  suits: Record<Suit, Suit>;
  values: Record<CardValue, CardValue>;
}

interface PlayerHand {
  score: number;
  cards: Card[];
  playerId: number;
  cardsToString: () => string;
}

export function simpleJack(deck: Card[], players: number): string | null {
  // Validate that the number of players is correct.
  if (!players || players < 2 || players > 6 || typeof players !== "number") {
    throw new Error("There must be 2 to 6 players");
  }

  // Validation data.
  const validationData: ValidationData = {
    suits: {
      Clubs: "Clubs",
      Diamonds: "Diamonds",
      Hearts: "Hearts",
      Spades: "Spades",
    },
    values: {
      Ace: "Ace",
      Queen: "Queen",
      King: "King",
      Jack: "Jack",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
    },
  };

  // Helper function to validate a card.
  function isCardValid(testCard: Card): boolean {
    const [suit, value] = testCard.split("-");
    if (
      !validationData.suits[suit as Suit] ||
      !validationData.values[value as CardValue]
    ) {
      throw new Error("Card is not valid.");
    }
    return true;
  }

  // Validate the deck.
  if (!deck || !Array.isArray(deck)) {
    throw new Error("deck must be an array");
  }
  if (deck.length !== 52) {
    throw new Error("The deck must have 52 cards.");
  }
  if (new Set(deck).size !== 52) {
    throw new Error("The deck must have 52 unique cards.");
  }
  if (!deck.every((card) => isCardValid(card))) {
    throw new Error("All cards in deck must be valid.");
  }

  // Function to validate card when dealt.
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

  // Helper function to get the card value.
  function getCardValue(card: Card, currentScore: number): number {
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
      if (currentScore + 11 <= 21) {
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

  function PlayerCardHand(): PlayerHand {
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
      score: 0,
      cards,
      playerId: 0, // Will be set later
      cardsToString,
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
        playerHands[i] = PlayerCardHand();
        playerHands[i].playerId = i + 1;
      }

      if (playerHands[i]?.score < 17) {
        // Deal a card
        //  and check if the card is valid.

        // Check for an exhausted deck.
        if (deck.length <= 0) {
          gameOver = true;
          break;
        }

        const playerCard = validator(deck.shift()!);

        // Increment cards dealt on turn.
        cardsDealtOnTurn += 1;

        playerHands[i].score += getCardValue(playerCard, playerHands[i].score);

        playerHands[i].cards.push(playerCard);

        if (playerHands[i].score === 21) {
          winner = playerHands[i].playerId;
          gameOver = true;
          highScore = 21;
          break;
        } else if (playerHands[i].score < 21) {
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
