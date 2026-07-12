import { Card } from "@/shared/types";
import {
  isCardValid,
  assertCardValid,
  validateDeck,
  validatePlayers,
  getCardValue,
} from "../lib/simple-jack";
import { generateMockDeck } from "../lib/utils/mock-deck-generator";

describe("isCardValid", () => {
  test("returns true for valid cards", () => {
    expect(isCardValid("Spades-Ace")).toBe(true);
    expect(isCardValid("Hearts-King")).toBe(true);
    expect(isCardValid("Clubs-10")).toBe(true);
    expect(isCardValid("Diamonds-2")).toBe(true);
  });

  test("returns false for an invalid suit", () => {
    expect(isCardValid("Cubs-Ace" as Card)).toBe(false);
  });

  test("returns false for an invalid value", () => {
    expect(isCardValid("Spades-15" as Card)).toBe(false);
  });

  test("returns false for null or undefined", () => {
    expect(isCardValid(null as unknown as Card)).toBe(false);
    expect(isCardValid(undefined as unknown as Card)).toBe(false);
  });
});

describe("assertCardValid", () => {
  test("does not throw for a valid card", () => {
    expect(() => assertCardValid("Spades-Ace")).not.toThrow();
  });

  test("throws for an invalid suit", () => {
    expect(() => assertCardValid("Cubs-Ace" as Card)).toThrow(
      "Card is not valid."
    );
  });

  test("throws for an invalid value", () => {
    expect(() => assertCardValid("Spades-15" as Card)).toThrow(
      "Card is not valid."
    );
  });
});

describe("validateDeck", () => {
  test("throws when deck is null", () => {
    expect(() => validateDeck(null as unknown as Card[])).toThrow(
      "deck must be an array"
    );
  });

  test("throws when deck is not an array", () => {
    expect(() => validateDeck("not-a-deck" as unknown as Card[])).toThrow(
      "deck must be an array"
    );
  });

  test("throws when deck has fewer than 52 cards", () => {
    expect(() => validateDeck(["Spades-Ace"] as Card[])).toThrow(
      "The deck must have 52 cards."
    );
  });

  test("throws when deck has duplicate cards", () => {
    const deck = generateMockDeck();
    deck[1] = deck[0];
    expect(() => validateDeck(deck)).toThrow(
      "The deck must have 52 unique cards."
    );
  });

  test("throws when deck contains an invalid card", () => {
    const deck = generateMockDeck();
    deck[0] = "Invalid-Card" as Card;
    expect(() => validateDeck(deck)).toThrow("Card is not valid.");
  });
});

describe("validatePlayers", () => {
  test("throws for fewer than 2 players", () => {
    expect(() => validatePlayers(1)).toThrow();
  });

  test("throws for more than 6 players", () => {
    expect(() => validatePlayers(7)).toThrow();
  });

  test("throws for a non-number value", () => {
    expect(() => validatePlayers("3" as unknown as number)).toThrow();
  });

  test("throws for undefined", () => {
    expect(() => validatePlayers(undefined as unknown as number)).toThrow();
  });
});

describe("getCardValue", () => {
  test("returns 10 for face cards", () => {
    expect(getCardValue("Spades-King")).toBe(10);
    expect(getCardValue("Hearts-Queen")).toBe(10);
    expect(getCardValue("Clubs-Jack")).toBe(10);
  });

  test("returns 11 for an ace when current score allows it", () => {
    expect(getCardValue("Spades-Ace")).toBe(11);
    expect(getCardValue("Spades-Ace", 5)).toBe(11);
    expect(getCardValue("Spades-Ace", 10)).toBe(11); // 10+11=21, still valid
  });

  test("returns 1 for an ace when 11 would bust", () => {
    expect(getCardValue("Spades-Ace", 11)).toBe(1); // 11+11=22 > 21
    expect(getCardValue("Spades-Ace", 15)).toBe(1);
  });

  test("returns the numeric value for number cards", () => {
    expect(getCardValue("Spades-2")).toBe(2);
    expect(getCardValue("Hearts-7")).toBe(7);
    expect(getCardValue("Clubs-10")).toBe(10);
  });

  test("throws when card is null or undefined", () => {
    expect(() => getCardValue(null as unknown as Card)).toThrow(
      "Card has empty value."
    );
    expect(() => getCardValue(undefined as unknown as Card)).toThrow(
      "Card has empty value."
    );
  });

  test("throws for a non-numeric, non-face-card value", () => {
    expect(() => getCardValue("Spades-abc" as Card)).toThrow(
      "Card value is not valid."
    );
  });
});
