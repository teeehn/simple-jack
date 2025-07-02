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
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 3; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 1, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21"
        )
      );
    });

    test("2 players. Player 1 busts. Player 2 wins with 17 (Can't hit).", async () => {
      const deck: Card[] = generateMockDeck([
        "Spades-Jack",
        "Clubs-7",
        "Spades-6",
        "Diamonds-Jack",
        "Hearts-10",
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 5; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 2, Hand: ['Clubs-7', 'Diamonds-Jack'], Value: 17"
        )
      );
    });

    test("6 players. Winner is 2 with score of 20.", async () => {
      const deck: Card[] = generateMockDeck([
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
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 6 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 15; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 2, Hand: ['Hearts-King', 'Spades-Jack'], Value: 20"
        )
      );
    });

    test("6 players. Players 2 and 6 tie with scores of 20.", async () => {
      const deck: Card[] = generateMockDeck([
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
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 6 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 15; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(null)
      );
    });

    test("Multiple Aces in each hand to evaluate. Player 2 wins with 21.", async () => {
      const deck: Card[] = generateMockDeck([
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-Ace",
        "Diamonds-Ace",
        "Clubs-8",
        "Hearts-4",
        "Spades-5",
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 7; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 2, Hand: ['Clubs-Ace', 'Diamonds-Ace', 'Hearts-4', 'Spades-5'], Value: 21"
        )
      );
    });

    test("Ace followed by 10 value card wins with 21.", async () => {
      const deck: Card[] = generateMockDeck([
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-King",
        "Diamonds-Ace",
        "Clubs-8",
        "Hearts-4",
        "Spades-5",
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 7; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 1, Hand: ['Spades-Ace', 'Hearts-King'], Value: 21"
        )
      );
    });

    test("Another Ace followed by 10 value card wins with 21.", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Diamonds-8", "Clubs-King"],
        "2": ["Spades-Ace", "Hearts-10"],
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 7; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: 2, Hand: ['Spades-Ace', 'Hearts-10'], Value: 21"
        )
      );
    });
  });
});
