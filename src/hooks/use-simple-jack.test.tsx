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
      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, playerName: "TestUser" })
      );
      const { gameState } = result.current;
      expect(gameState).toStrictEqual({
        cardsDealtOnTurn: 0,
        commentary: [],
        currentPlayerIdx: 0,
        gameOver: false,
        highScore: 0,
        gameDeck: deck,
        players: undefined,
        playerName: "TestUser",
      });
    });

    test("2 players. Player 1 wins with 21 on two cards.", async () => {
      const deck: Card[] = generateMockDeck([
        "Spades-Jack",
        "Hearts-2",
        "Spades-Ace",
      ]);

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 3; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: TestUser, Hand: ['Spades-Jack', 'Spades-Ace'], Value: 21"
        )
      );
    });

    test("2 players. Player 1 busts with 25. Player 2 wins with 17 (Can't hit).", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Spades-King", "Spades-5", "Hearts-10"],
        "2": ["Clubs-7", "Diamonds-Jack"],
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2 })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { hitMe } = result.current;

      await waitFor(() => hitMe());

      act(() => jest.runAllTimers());

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: Dealer, Hand: ['Clubs-7', 'Diamonds-Jack'], Value: 17"
        )
      );

      await waitFor(() =>
        expect(result.current.gameState.playerHands![0].score).toBe(25)
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

      const { hitMe } = result.current;

      await waitFor(() => hitMe());

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 15; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: Player 2, Hand: ['Hearts-King', 'Spades-Jack'], Value: 20"
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
        useSimpleJackGame({ deck, players: 6, playerName: "TestUser" })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 15; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { hitMe } = result.current;

      await waitFor(() => hitMe());

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 15; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(null)
      );

      await waitFor(() =>
        expect(result.current.gameState.pushMessage).toBe(
          "Push - Player 2 and Dealer are tied with 20 points."
        )
      );

      const playerHands = result.current.gameState.playerHands;

      expect(playerHands![1].score).toBe(20);

      expect(playerHands![5].score).toBe(20);
    });

    test("All players bust scenario", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Spades-King", "Hearts-5", "Diamonds-7"],
        "2": ["Clubs-Queen", "Spades-6", "Hearts-8"],
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Run all timers for initial dealing
      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { hitMe } = result.current;

      // User hits and busts
      await waitFor(() => hitMe());

      // Run all remaining timers
      for (let i = 0; i < 10; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.pushMessage).toBe(
          "Push - All players have busted."
        )
      );

      await waitFor(() => expect(result.current.gameState.winner).toBe(-1));
    });

    test("Multiple Aces in each hand to evaluate. Player 2 wins with 21.", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Spades-Ace", "Hearts-Ace", "Clubs-8"],
        "2": ["Clubs-Ace", "Diamonds-Ace", "Hearts-9"],
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { hitMe } = result.current;

      await waitFor(() => hitMe());

      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: Dealer, Hand: ['Clubs-Ace', 'Diamonds-Ace', 'Hearts-9'], Value: 21"
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
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Run all timers for each card that must be dealt.
      for (let i = 0; i < 7; i += 1) {
        act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: TestUser, Hand: ['Spades-Ace', 'Hearts-King'], Value: 21"
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
          "Winner: Dealer, Hand: ['Spades-Ace', 'Hearts-10'], Value: 21"
        )
      );
    });

    test("Bug: User stands with 12, dealer busts with 23, user should win", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Spades-10", "Spades-2"],
        "2": ["Spades-8", "Hearts-4", "Clubs-4", "Spades-7"],
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Deal initial cards
      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { stand } = result.current;

      // User stands with 12
      await waitFor(() => stand());

      // Let dealer play out and bust
      for (let i = 0; i < 20; i += 1) {
        act(() => jest.runAllTimers());
      }

      // User should win since dealer busted
      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: TestUser, Hand: ['Spades-10', 'Spades-2'], Value: 12"
        )
      );

      // Verify dealer busted
      await waitFor(() =>
        expect(result.current.gameState.playerHands![1].score).toBe(23)
      );
      await waitFor(() =>
        expect(result.current.gameState.playerHands![1].isEliminated).toBe(true)
      );
    });

    test("Bug: Multiple players, only one doesn't bust, that player should win", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Hearts-5", "Diamonds-6"], // Player 1: 11
        "2": ["Spades-King", "Hearts-4", "Clubs-8"], // Player 2: 22 (bust)
        "3": ["Clubs-Queen", "Spades-5", "Hearts-7"], // Dealer: 22 (bust)
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 3, playerName: "TestUser" })
      );

      // Deal initial cards
      for (let i = 0; i < 6; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { stand } = result.current;

      // User stands with 11
      await waitFor(() => stand());

      // Let other players play out and bust
      for (let i = 0; i < 10; i += 1) {
        act(() => jest.runAllTimers());
      }

      // User should win since others busted
      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: TestUser, Hand: ['Hearts-5', 'Diamonds-6'], Value: 11"
        )
      );

      // Verify others busted
      await waitFor(() =>
        expect(result.current.gameState.playerHands![1].isEliminated).toBe(true)
      );
      await waitFor(() =>
        expect(result.current.gameState.playerHands![2].isEliminated).toBe(true)
      );
    });

    test("Bug: User has low score but wins when dealer busts", async () => {
      const deck: Card[] = generateMockDeck({
        "1": ["Hearts-2", "Diamonds-3", "Clubs-2"], // Player: 7
        "2": ["Spades-10", "Hearts-6", "Clubs-8"], // Dealer: 24 (bust)
      });

      const { result } = renderHook(() =>
        useSimpleJackGame({ deck, players: 2, playerName: "TestUser" })
      );

      // Deal initial cards
      for (let i = 0; i < 4; i += 1) {
        act(() => jest.runAllTimers());
      }

      const { hitMe, stand } = result.current;

      // User hits once to get 7, then stands
      await waitFor(() => hitMe());
      act(() => jest.runAllTimers());

      await waitFor(() => stand());

      // Let dealer play out and bust
      for (let i = 0; i < 10; i += 1) {
        act(() => jest.runAllTimers());
      }

      // User should win with 7 since dealer busted with 24
      await waitFor(() =>
        expect(result.current.gameState.gameSummary).toBe(
          "Winner: TestUser, Hand: ['Hearts-2', 'Diamonds-3', 'Clubs-2'], Value: 7"
        )
      );

      // Verify dealer busted
      await waitFor(() =>
        expect(result.current.gameState.playerHands![1].score).toBe(24)
      );
      await waitFor(() =>
        expect(result.current.gameState.playerHands![1].isEliminated).toBe(true)
      );
    });
  });
});
