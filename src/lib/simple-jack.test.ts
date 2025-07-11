import { simpleJack } from "./simple-jack";
import { Card } from "@/shared/types";
import { generateMockDeck as createMockDeck } from "./utils";

describe("Simple Jack", () => {
  describe("Basic validations.", () => {
    test("Players must be a number 2 through 6", () => {
      const fullDeck: Card[] = createMockDeck();

      expect(() => simpleJack({ deck: fullDeck, players: 1 })).toThrow();
      expect(() => simpleJack({ deck: fullDeck, players: 7 })).toThrow();
      // @ts-expect-error: Missing player argument.
      expect(() => simpleJack({ deck: fullDeck })).toThrow();
      // @ts-expect-error: Player argument as a string.
      expect(() => simpleJack({ deck: fullDeck, players: "2" })).toThrow();
      expect(() => simpleJack({ deck: fullDeck, players: 5 })).not.toThrow();
    });
    test("Deck must be an array of length 52", () => {
      const fullDeck: Card[] = createMockDeck();

      expect(() => simpleJack({ deck: ["Spades-King"], players: 2 })).toThrow();
      // @ts-expect-error: Deck is a string instead of array.
      expect(() => simpleJack({ deck: "Spades-King", players: 2 })).toThrow();
      expect(() => simpleJack({ deck: fullDeck, players: 3 })).not.toThrow();
    });
    test("Deck must have 52 unique cards.", () => {
      expect(() =>
        simpleJack({
          deck: [
            "Spades-Jack",
            "Spades-Jack",
            "Spades-Ace",
            "Clubs-Ace",
            "Clubs-King",
            "Clubs-Queen",
            "Clubs-Jack",
            "Clubs-2",
            "Clubs-3",
            "Clubs-4",
            "Clubs-5",
            "Clubs-6",
            "Clubs-7",
            "Clubs-8",
            "Clubs-9",
            "Clubs-10",
            "Diamonds-Ace",
            "Diamonds-King",
            "Diamonds-Queen",
            "Diamonds-Jack",
            "Diamonds-2",
            "Diamonds-3",
            "Diamonds-4",
            "Diamonds-5",
            "Diamonds-6",
            "Diamonds-7",
            "Diamonds-8",
            "Diamonds-9",
            "Diamonds-10",
            "Hearts-Ace",
            "Hearts-King",
            "Hearts-Queen",
            "Hearts-Jack",
            "Hearts-3",
            "Hearts-4",
            "Hearts-5",
            "Hearts-6",
            "Hearts-7",
            "Hearts-8",
            "Hearts-9",
            "Hearts-10",
            "Spades-King",
            "Spades-Queen",
            "Spades-2",
            "Spades-3",
            "Spades-4",
            "Spades-5",
            "Spades-6",
            "Spades-7",
            "Spades-8",
            "Spades-9",
            "Spades-10",
          ],
          players: 2,
        })
      ).toThrow();
    });

    test("Deck can be an empty array, undefined, or null.", () => {
      let value;

      // empty array deck

      expect(() => simpleJack({ deck: [], players: 2 })).not.toThrow();

      value = simpleJack({ deck: [], players: 2 });

      expect(typeof value === "string" || value === null).toBe(true);

      // undefined deck

      expect(() => simpleJack({ players: 2 })).not.toThrow();

      value = simpleJack({ players: 2 });

      expect(typeof value === "string" || value === null).toBe(true);

      // null deck

      expect(() => simpleJack({ deck: null, players: 2 })).not.toThrow();

      value = simpleJack({ deck: null, players: 2 });

      expect(typeof value === "string" || value === null).toBe(true);
    });
  });
  describe("Basic game play scenarios.", () => {
    test("2 players. Player 1 wins with 21 on two cards.", () => {
      const deck: Card[] = [
        "Spades-Jack",
        "Hearts-2",
        "Spades-Ace",
        "Clubs-Ace",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-Jack",
        "Clubs-2",
        "Clubs-3",
        "Clubs-4",
        "Clubs-5",
        "Clubs-6",
        "Clubs-7",
        "Clubs-8",
        "Clubs-9",
        "Clubs-10",
        "Diamonds-Ace",
        "Diamonds-King",
        "Diamonds-Queen",
        "Diamonds-Jack",
        "Diamonds-2",
        "Diamonds-3",
        "Diamonds-4",
        "Diamonds-5",
        "Diamonds-6",
        "Diamonds-7",
        "Diamonds-8",
        "Diamonds-9",
        "Diamonds-10",
        "Hearts-Ace",
        "Hearts-King",
        "Hearts-Queen",
        "Hearts-Jack",
        "Hearts-3",
        "Hearts-4",
        "Hearts-5",
        "Hearts-6",
        "Hearts-7",
        "Hearts-8",
        "Hearts-9",
        "Hearts-10",
        "Spades-King",
        "Spades-Queen",
        "Spades-2",
        "Spades-3",
        "Spades-4",
        "Spades-5",
        "Spades-6",
        "Spades-7",
        "Spades-8",
        "Spades-9",
        "Spades-10",
      ];

      expect(simpleJack({ deck, players: 2 })).toBe(
        "Winner: 1, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21"
      );
    });
    test("2 players. Player 1 busts. Player 2 wins with 17 (Can't hit).", () => {
      const deck: Card[] = [
        "Spades-Jack",
        "Clubs-7",
        "Spades-6",
        "Diamonds-Jack",
        "Hearts-10",
        "Clubs-Ace",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-Jack",
        "Clubs-2",
        "Clubs-3",
        "Clubs-4",
        "Clubs-5",
        "Clubs-6",
        "Clubs-8",
        "Clubs-9",
        "Clubs-10",
        "Diamonds-Ace",
        "Diamonds-King",
        "Diamonds-Queen",
        "Diamonds-2",
        "Diamonds-3",
        "Diamonds-4",
        "Diamonds-5",
        "Diamonds-6",
        "Diamonds-7",
        "Diamonds-8",
        "Diamonds-9",
        "Diamonds-10",
        "Hearts-Ace",
        "Hearts-King",
        "Hearts-Queen",
        "Hearts-Jack",
        "Hearts-2",
        "Hearts-3",
        "Hearts-4",
        "Hearts-5",
        "Hearts-6",
        "Hearts-7",
        "Hearts-8",
        "Hearts-9",
        "Spades-Ace",
        "Spades-King",
        "Spades-Queen",
        "Spades-2",
        "Spades-3",
        "Spades-4",
        "Spades-5",
        "Spades-7",
        "Spades-8",
        "Spades-9",
        "Spades-10",
      ];

      expect(simpleJack({ deck, players: 2 })).toBe(
        "Winner: 2, Hand: ['Clubs-7', 'Diamonds-Jack'], Value: 17"
      );
    });
    test("6 players. Winner is 2 with score of 20.", () => {
      const deck: Card[] = [
        "Clubs-Jack",
        "Hearts-King",
        "Clubs-7",
        "Clubs-9",
        "Clubs-6",
        "Hearts-2",
        "Diamonds-4",
        "Spades-Jack",
        "Clubs-10",
        "Spades-9",
        "Clubs-4",
        "Diamonds-Jack",
        "Diamonds-Queen",
        "Hearts-7",
        "Diamonds-10",
        "Clubs-Ace",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-2",
        "Clubs-3",
        "Clubs-5",
        "Clubs-8",
        "Diamonds-Ace",
        "Diamonds-King",
        "Diamonds-2",
        "Diamonds-3",
        "Diamonds-5",
        "Diamonds-6",
        "Diamonds-7",
        "Diamonds-8",
        "Diamonds-9",
        "Hearts-Ace",
        "Hearts-Queen",
        "Hearts-Jack",
        "Hearts-3",
        "Hearts-4",
        "Hearts-5",
        "Hearts-6",
        "Hearts-8",
        "Hearts-9",
        "Hearts-10",
        "Spades-Ace",
        "Spades-King",
        "Spades-Queen",
        "Spades-2",
        "Spades-3",
        "Spades-4",
        "Spades-5",
        "Spades-6",
        "Spades-7",
        "Spades-8",
        "Spades-10",
      ];

      expect(simpleJack({ deck, players: 6 })).toBe(
        "Winner: 2, Hand: ['Hearts-King', 'Spades-Jack'], Value: 20"
      );
    });

    test("6 players. Players 2 and 6 tie with scores of 20.", () => {
      const deck: Card[] = [
        "Clubs-Jack",
        "Hearts-King",
        "Clubs-7",
        "Clubs-9",
        "Clubs-6",
        "Hearts-2",
        "Diamonds-4",
        "Spades-Jack",
        "Clubs-10",
        "Spades-9",
        "Clubs-4",
        "Diamonds-Jack",
        "Diamonds-Queen",
        "Hearts-7",
        "Diamonds-8",
        "Clubs-Ace",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-2",
        "Clubs-3",
        "Clubs-5",
        "Clubs-8",
        "Diamonds-Ace",
        "Diamonds-King",
        "Diamonds-2",
        "Diamonds-3",
        "Diamonds-5",
        "Diamonds-6",
        "Diamonds-7",
        "Diamonds-9",
        "Diamonds-10",
        "Hearts-Ace",
        "Hearts-Queen",
        "Hearts-Jack",
        "Hearts-3",
        "Hearts-4",
        "Hearts-5",
        "Hearts-6",
        "Hearts-8",
        "Hearts-9",
        "Hearts-10",
        "Spades-Ace",
        "Spades-King",
        "Spades-Queen",
        "Spades-2",
        "Spades-3",
        "Spades-4",
        "Spades-5",
        "Spades-6",
        "Spades-7",
        "Spades-8",
        "Spades-10",
      ];

      expect(simpleJack({ deck, players: 6 })).toBe(null);
    });
  });

  describe("Edge cases and exceptions.", () => {
    test("Invalid card causes exception", () => {
      const deck: string[] = [
        "Cubs-Jack",
        "Hearts-King",
        "Clubs-7",
        "Clubs-9",
        "Clubs-6",
        "Hearts-2",
        "Diamonds-4",
        "Spades-Jack",
        "Clubs-10",
        "Spades-9",
        "Clubs-4",
        "Diamonds-Jack",
        "Diamonds-Queen",
        "Hearts-7",
        "Diamonds-8",
      ].concat(new Array(52 - 15).fill(" "));

      expect(() => simpleJack({ deck: deck as never, players: 6 })).toThrow();
    });

    test("Duplicate card causes exception", () => {
      const deck: string[] = [
        "Clubs-Jack",
        "Hearts-King",
        "Clubs-7",
        "Clubs-9",
        "Clubs-6",
        "Hearts-2",
        "Diamonds-4",
        "Spades-Jack",
        "Clubs-10",
        "Spades-9",
        "Clubs-Jack",
        "Diamonds-Jack",
        "Diamonds-Queen",
        "Hearts-7",
        "Diamonds-8",
      ].concat(new Array(52 - 15).fill(" "));

      expect(() => simpleJack({ deck: deck as never, players: 6 })).toThrow();
    });
    test("Multiple Aces in each hand to evaluate. Player 2 wins with 21.", () => {
      const deck: Card[] = [
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-Ace",
        "Diamonds-Ace",
        "Clubs-8",
        "Hearts-4",
        "Spades-5",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-Jack",
        "Clubs-2",
        "Clubs-3",
        "Clubs-4",
        "Clubs-5",
        "Clubs-6",
        "Clubs-7",
        "Clubs-9",
        "Clubs-10",
        "Diamonds-King",
        "Diamonds-Queen",
        "Diamonds-Jack",
        "Diamonds-2",
        "Diamonds-3",
        "Diamonds-4",
        "Diamonds-5",
        "Diamonds-6",
        "Diamonds-7",
        "Diamonds-8",
        "Diamonds-9",
        "Diamonds-10",
        "Hearts-King",
        "Hearts-Queen",
        "Hearts-Jack",
        "Hearts-2",
        "Hearts-3",
        "Hearts-5",
        "Hearts-6",
        "Hearts-7",
        "Hearts-8",
        "Hearts-9",
        "Hearts-10",
        "Spades-King",
        "Spades-Queen",
        "Spades-Jack",
        "Spades-2",
        "Spades-3",
        "Spades-4",
        "Spades-6",
        "Spades-7",
        "Spades-8",
        "Spades-9",
        "Spades-10",
      ];

      expect(simpleJack({ deck, players: 2 })).toBe(
        "Winner: 2, Hand: ['Clubs-Ace', 'Diamonds-Ace', 'Hearts-4', 'Spades-5'], Value: 21"
      );
    });
  });
});
