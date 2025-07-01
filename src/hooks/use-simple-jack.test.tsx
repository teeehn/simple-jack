import { act, renderHook, waitFor } from "@testing-library/react";

import { generateMockDeck } from "@/lib/utils";
import { useSimpleJackGame } from "./use-simple-jack";
import { Card } from "@/shared/types";

// Mock the deck validator to prevent errors on re-render.
//  Not sure why needed...

jest.mock("@/lib/simple-jack", () => {
  return {
    ...jest.requireActual("@/lib/simple-jack"),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validateDeck: jest.fn((deck: Card[]) => undefined),
  };
});

describe("useSimpleJackGame Hook", () => {
  describe("Game play", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    test("Rendering hook with mock deck returns initial state.", () => {
      const deck = generateMockDeck();
      const { result } = renderHook(() => useSimpleJackGame({ deck }));
      const { gameState } = result.current;
      expect(gameState).toStrictEqual({
        cardsDealtOnTurn: 0,
        commentary: [],
        currentPlayerIdx: 0,
        gameOver: false,
        highScore: 0,
        gameDeck: deck,
        players: undefined,
      });
    });

    test("2 players. Player 1 wins with 21 on two cards.", async () => {
      const deck: Card[] = generateMockDeck([
        "Spades-Jack",
        "Hearts-2",
        "Spades-Ace",
        "Clubs-Ace",
        "Clubs-King",
        "Clubs-Queen",
        "Clubs-Jack",
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      act(() => jest.runAllTimers());
      act(() => jest.runAllTimers());
      act(() => jest.runAllTimers());

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 1, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21"
        )
      );
    });
  });
});
