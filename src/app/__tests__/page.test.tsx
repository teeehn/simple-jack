import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { useSimpleJackGame } from "@/hooks/use-simple-jack";

import { generateMockDeck } from "@/lib/utils";

jest.mock("@/hooks/use-simple-jack", () => ({
  useSimpleJackGame: jest.fn(),
}));

import Home from "../page";

describe("Simple Jack Game UI", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    (useSimpleJackGame as jest.Mock).mockImplementation(() => {
      const { useSimpleJackGame: testHook } = jest.requireActual(
        "@/hooks/use-simple-jack"
      );

      return {
        ...testHook(),
      };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("Initial Setup Screen", () => {
    test("renders the setup screen with all required elements", () => {
      render(<Home />);

      expect(screen.getByText(/simple jack/i)).toBeInTheDocument();
      expect(screen.getByText(/your name/i)).toBeInTheDocument();
      expect(screen.getAllByText(/number of players/i)).toHaveLength(2); // Label and option text
      expect(screen.getByText(/dealing speed/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /fill in all fields/i })
      ).toBeInTheDocument();
    });

    test("allows selecting number of players from 2 to 6", () => {
      render(<Home />);

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      expect(playerSelect).toBeInTheDocument();

      // Check that all player options are available
      fireEvent.change(playerSelect, { target: { value: "2" } });
      fireEvent.change(playerSelect, { target: { value: "3" } });
      fireEvent.change(playerSelect, { target: { value: "4" } });
      fireEvent.change(playerSelect, { target: { value: "5" } });
      fireEvent.change(playerSelect, { target: { value: "6" } });
    });

    test("allows selecting dealing speed", () => {
      render(<Home />);

      const speedSelect = screen.getByRole("combobox", {
        name: /dealing speed/i,
      });
      expect(speedSelect).toBeInTheDocument();

      // Test changing speed
      fireEvent.change(speedSelect, { target: { value: "1000" } });
      fireEvent.change(speedSelect, { target: { value: "2000" } });
      fireEvent.change(speedSelect, { target: { value: "3000" } });
    });

    test("allows entering the user's name", async () => {
      render(<Home />);

      const nameInput = screen.getByLabelText(/your name/i);
      expect(nameInput).toBeInTheDocument();

      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      expect(nameInput).toHaveValue("TestUser");
    });

    test("starts game when Start Game button is clicked", async () => {
      render(<Home />);

      const nameInput = screen.getByLabelText(/your name/i);
      expect(nameInput).toBeInTheDocument();
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      expect(playerSelect).toBeInTheDocument();
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );

      const startButton = screen.getByRole("button", { name: /start game/i });
      fireEvent.click(startButton);

      // Should transition to game screen
      await waitFor(() =>
        expect(screen.getByText(/current:/i)).toBeInTheDocument()
      );

      act(() => jest.runAllTimers());

      await waitFor(() =>
        expect(screen.getByText("TestUser")).toBeInTheDocument()
      );

      act(() => jest.runAllTimers());

      await waitFor(() =>
        expect(screen.getByText("Dealer")).toBeInTheDocument()
      );
    });
  });

  describe("Game Screen", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("shows initial game state correctly", async () => {
      const startButton = screen.getByRole("button", { name: /start game/i });
      waitFor(() => fireEvent.click(startButton));

      await waitFor(() =>
        expect(screen.getByText(/simple jack/i)).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText(/current:/i)).toBeInTheDocument()
      );

      for (let i = 0; i < 5; i += 1) {
        await act(() => jest.runAllTimers());
      }

      await waitFor(() => expect(screen.getByText("📢")).toBeInTheDocument());
    });

    test("displays correct number of players", async () => {
      const startButton = screen.getByRole("button", { name: /start game/i });
      waitFor(() => fireEvent.click(startButton));

      await waitFor(() =>
        expect(screen.getByText("TestUser")).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(screen.getByText("Dealer")).toBeInTheDocument()
      );
    });
  });

  describe("Game with 4 Players", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "4" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays 4 players when selected", async () => {
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      await waitFor(() =>
        expect(screen.getByText("TestUser")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Player 2")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Player 3")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Dealer")).toBeInTheDocument()
      );
    });
  });

  describe("Game Commentary", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays game commentary section", async () => {
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      for (let i = 0; i < 5; i += 1) {
        await act(() => jest.runAllTimers());
      }

      await waitFor(() => expect(screen.getByText("📢")).toBeInTheDocument());
    });
  });

  describe("Game State Management", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("handles game phase transitions", async () => {
      // Start in setup phase
      expect(
        screen.getByRole("button", { name: /start game/i })
      ).toBeInTheDocument();

      // Move to dealing phase
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      await waitFor(() =>
        expect(screen.getByText(/current:/i)).toBeInTheDocument()
      );
    });
  });

  describe("Waits for user to choose hit or stand", () => {
    beforeEach(async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );

        const deck = generateMockDeck({
          "1": ["Spades-Ace", "Spades-7"],
          "2": ["Clubs-10", "Hearts-7"],
        });

        return {
          ...testHook({ deck }),
        };
      });
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("Waits for user to hit or stand.", async () => {
      // Start a game
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Wait for game to pause for the user to decide to hit or stand.

      await waitFor(() =>
        expect(screen.getByText("TURN")).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /hit me/i })
        ).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /stand/i })
        ).toBeInTheDocument()
      );
    });
  });

  describe("Play New Game", () => {
    beforeEach(async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );

        const deck = generateMockDeck({
          "1": ["Spades-Ace", "Spades-King"],
          "2": ["Clubs-10", "Hearts-7"],
        });

        return {
          ...testHook({ deck }),
        };
      });

      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("Play New Game button appears after game has finished.", async () => {
      // Start a game
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      for (let timers = 0; timers < 6; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Wait for game to pause for the user to decide to hit or stand.

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument()
      );
    });
  });

  describe("Settings retention", () => {
    beforeEach(async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );

        // Blackjack on first deal — game ends without user input
        const deck = generateMockDeck({
          "1": ["Spades-Ace", "Spades-King"],
          "2": ["Clubs-10", "Hearts-7"],
        });

        return {
          ...testHook({ deck }),
        };
      });

      render(<Home />);

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "3" } })
      );

      const speedSelect = screen.getByRole("combobox", {
        name: /dealing speed/i,
      });
      await waitFor(() =>
        fireEvent.change(speedSelect, { target: { value: "1000" } })
      );

      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      for (let timers = 0; timers < 6; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument()
      );

      // Open settings
      const settingsButton = screen.getByRole("button", { name: /settings/i });
      userEvent.click(settingsButton);
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    test("retains player name on the settings screen", async () => {
      const nameInput = screen.getByLabelText(/your name/i);
      expect(nameInput).toHaveValue("TestUser");
    });

    test("retains number of players on the settings screen", async () => {
      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      expect(playerSelect).toHaveValue("3");
    });

    test("retains dealing speed on the settings screen", async () => {
      const speedSelect = screen.getByRole("combobox", {
        name: /dealing speed/i,
      });
      expect(speedSelect).toHaveValue("1000");
    });

    test("shows an enabled Start Game button with retained settings", async () => {
      expect(
        screen.getByRole("button", { name: /start game/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /fill in all fields/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Game status retention after visiting settings", () => {
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    // ─── helpers ────────────────────────────────────────────────────────────

    const startSetup = async (numPlayers: string) => {
      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));
      await waitFor(() =>
        fireEvent.change(
          screen.getByRole("combobox", { name: /number of players/i }),
          { target: { value: numPlayers } }
        )
      );
      userEvent.click(screen.getByRole("button", { name: /start game/i }));
    };

    const runTimers = async (n = 10) => {
      for (let i = 0; i < n; i += 1) {
        await act(() => jest.runAllTimers());
      }
    };

    // ─── structural: settings button presence ───────────────────────────────

    test("settings button is not shown while a hand is in progress", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // P1 gets King+5=15 with 2 cards — game pauses for user decision
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-King", "Hearts-5"],
              "2": ["Clubs-Queen", "Hearts-9"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(10);

      // Game is active — waiting for player to hit or stand
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /hit me/i })
        ).toBeInTheDocument()
      );

      expect(
        screen.queryByRole("button", { name: /settings/i })
      ).not.toBeInTheDocument();
    });

    // ─── structural: cancel button presence ─────────────────────────────────

    test("cancel button is absent on the initial settings screen before any game is played", () => {
      render(<Home />);
      expect(
        screen.queryByRole("button", { name: /cancel/i })
      ).not.toBeInTheDocument();
    });

    test("cancel button is present on the settings screen after a game has been completed", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-Ace", "Spades-King"],
              "2": ["Clubs-10", "Hearts-7"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(6);

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument()
      );

      userEvent.click(screen.getByRole("button", { name: /settings/i }));

      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
    });

    // ─── scenario 1: 2-player blackjack win, settings unchanged ─────────────

    test("2-player blackjack win is identical before and after visiting settings without making changes", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-Ace", "Spades-King"],
              "2": ["Clubs-10", "Hearts-7"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(6);

      await waitFor(() =>
        expect(screen.getByText("WIN!")).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("Ace")).toHaveLength(2);
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getByText("21")).toBeInTheDocument();
        expect(within(p1).getByText("WIN!")).toBeInTheDocument();

        expect(within(p2).getByText("Dealer")).toBeInTheDocument();
        expect(within(p2).getAllByText("10")).toHaveLength(2);
        expect(within(p2).getAllByText("7")).toHaveLength(2);
        expect(within(p2).getByText("17")).toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full state BEFORE visiting settings
      assertState();

      // Visit settings, change nothing, cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full state must be identical AFTER returning from settings
      assertState();
    });

    // ─── scenario 2: 3-player win, number of players changed ────────────────

    test("3-player blackjack win is identical before and after settings where number of players was changed", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // P1 blackjacks; P2 and P3 each receive one card before the game ends
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-Ace", "Spades-King"],
              "2": ["Clubs-10"],
              "3": ["Diamonds-9"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("3");
      await runTimers(6);

      await waitFor(() =>
        expect(screen.getByText("WIN!")).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");
        const p3 = screen.getByTestId("player-3");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("Ace")).toHaveLength(2);
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getByText("21")).toBeInTheDocument();
        expect(within(p1).getByText("WIN!")).toBeInTheDocument();

        expect(within(p2).getByText("Player 2")).toBeInTheDocument();
        expect(within(p2).getAllByText("10")).toHaveLength(2);
        expect(within(p2).getByText("10")).toBeInTheDocument();

        expect(within(p3).getByText("Dealer")).toBeInTheDocument();
        expect(within(p3).getAllByText("9")).toHaveLength(2);

        // Exactly 3 player panels — not 4
        expect(screen.queryByTestId("player-4")).not.toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full state BEFORE visiting settings
      assertState();

      // Visit settings, change number of players to 4, then cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      await waitFor(() =>
        fireEvent.change(
          screen.getByRole("combobox", { name: /number of players/i }),
          { target: { value: "4" } }
        )
      );
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full 3-player game state must be identical AFTER cancelling
      assertState();
    });

    // ─── scenario 3: 2-player push (tied at 20), dealing speed changed ──────

    test("2-player push result is identical before and after settings where dealing speed was changed", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // Both players reach 20 — produces a push
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-King", "Hearts-10"],
              "2": ["Clubs-Queen", "Diamonds-10"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(10);

      // User stands at 20
      await waitFor(() => {
        userEvent.click(screen.getByRole("button", { name: /stand/i }));
      });

      await runTimers(10);

      await waitFor(() =>
        expect(screen.getByText("PUSH")).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getByText("20")).toBeInTheDocument();

        expect(within(p2).getByText("Dealer")).toBeInTheDocument();
        expect(within(p2).getAllByText("Queen")).toHaveLength(2);
        expect(within(p2).getByText("20")).toBeInTheDocument();

        expect(screen.getByText("PUSH")).toBeInTheDocument();
        expect(
          screen.getByText(/TestUser and Dealer are tied with 20 points/i)
        ).toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full state BEFORE visiting settings
      assertState();

      // Visit settings, change dealing speed to slow, then cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      await waitFor(() =>
        fireEvent.change(
          screen.getByRole("combobox", { name: /dealing speed/i }),
          { target: { value: "3000" } }
        )
      );
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full push state must be identical AFTER cancelling
      assertState();
    });

    // ─── scenario 4: 2-player all-bust, player name changed ─────────────────

    test("2-player all-bust result is identical before and after settings where player name was changed", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // P1: King+5=15 → hits → +7 = 22 (bust)
        // P2: Queen+6=16 → auto-hits → +8 = 24 (bust)
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-King", "Hearts-5", "Diamonds-7"],
              "2": ["Clubs-Queen", "Spades-6", "Hearts-8"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(10);

      // P1 has King+5=15 with 2 cards — hits
      await waitFor(() => {
        userEvent.click(screen.getByRole("button", { name: /hit me/i }));
      });

      await runTimers(10);

      await waitFor(() =>
        expect(screen.getByText("PUSH")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(
          screen.getByText(/All players have busted/i)
        ).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getAllByText("5")).toHaveLength(2);
        expect(within(p1).getAllByText("7")).toHaveLength(2);
        expect(within(p1).getByText("22")).toBeInTheDocument();
        expect(within(p1).getByText("BUST")).toBeInTheDocument();

        expect(within(p2).getByText("Dealer")).toBeInTheDocument();
        expect(within(p2).getAllByText("Queen")).toHaveLength(2);
        expect(within(p2).getAllByText("6")).toHaveLength(2);
        expect(within(p2).getAllByText("8")).toHaveLength(2);
        expect(within(p2).getByText("24")).toBeInTheDocument();
        expect(within(p2).getByText("BUST")).toBeInTheDocument();

        expect(screen.getByText("PUSH")).toBeInTheDocument();
        expect(
          screen.getByText(/All players have busted/i)
        ).toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full state BEFORE visiting settings
      assertState();

      // Visit settings, edit the player name, then cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      await waitFor(() =>
        fireEvent.change(screen.getByLabelText(/your name/i), {
          target: { value: "NewName" },
        })
      );
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full all-bust state must be identical AFTER cancelling
      assertState();

      // Unsaved name change must not bleed into the game display
      expect(screen.queryByText("NewName")).not.toBeInTheDocument();
    });

    // ─── scenario 5: 6-player game, dealer wins, numPlayers changed ─────────

    test("6-player game where dealer wins is identical before and after settings where number of players was changed", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // Deal order: P1-P6 each get one card, then one more each.
        // P6 (Dealer) gets Ace+10=21 on their 2nd card — blackjack.
        // The game ends before returning to P1 for a decision.
        // Final scores: P1=19, P2=18, P3=17, P4=8, P5=8, P6=21 (WIN)
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-King", "Hearts-9"],
              "2": ["Clubs-8", "Diamonds-Jack"],
              "3": ["Hearts-7", "Clubs-Queen"],
              "4": ["Diamonds-6", "Spades-2"],
              "5": ["Clubs-5", "Hearts-3"],
              "6": ["Diamonds-Ace", "Spades-10"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("6");
      await runTimers(15);

      await waitFor(() =>
        expect(screen.getByText("WIN!")).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");
        const p3 = screen.getByTestId("player-3");
        const p4 = screen.getByTestId("player-4");
        const p5 = screen.getByTestId("player-5");
        const p6 = screen.getByTestId("player-6");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getAllByText("9")).toHaveLength(2);
        expect(within(p1).getByText("19")).toBeInTheDocument();
        expect(within(p1).queryByText("WIN!")).not.toBeInTheDocument();

        expect(within(p2).getByText("Player 2")).toBeInTheDocument();
        expect(within(p2).getAllByText("8")).toHaveLength(2);
        expect(within(p2).getAllByText("Jack")).toHaveLength(2);
        expect(within(p2).getByText("18")).toBeInTheDocument();

        expect(within(p3).getByText("Player 3")).toBeInTheDocument();
        expect(within(p3).getAllByText("7")).toHaveLength(2);
        expect(within(p3).getAllByText("Queen")).toHaveLength(2);
        expect(within(p3).getByText("17")).toBeInTheDocument();

        expect(within(p4).getByText("Player 4")).toBeInTheDocument();
        expect(within(p4).getAllByText("6")).toHaveLength(2);
        expect(within(p4).getAllByText("2")).toHaveLength(2);
        expect(within(p4).getByText("8")).toBeInTheDocument();

        expect(within(p5).getByText("Player 5")).toBeInTheDocument();
        expect(within(p5).getAllByText("5")).toHaveLength(2);
        expect(within(p5).getAllByText("3")).toHaveLength(2);
        expect(within(p5).getByText("8")).toBeInTheDocument();

        expect(within(p6).getByText("Dealer")).toBeInTheDocument();
        expect(within(p6).getAllByText("Ace")).toHaveLength(2);
        expect(within(p6).getAllByText("10")).toHaveLength(2);
        expect(within(p6).getByText("21")).toBeInTheDocument();
        expect(within(p6).getByText("WIN!")).toBeInTheDocument();

        // Exactly 6 player panels — not 2
        expect(screen.queryByTestId("player-7")).not.toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full 6-player state BEFORE visiting settings
      assertState();

      // Visit settings and change number of players from 6 down to 2, then cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      await waitFor(() =>
        fireEvent.change(
          screen.getByRole("combobox", { name: /number of players/i }),
          { target: { value: "2" } }
        )
      );
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full 6-player state must be identical AFTER cancelling
      assertState();
    });

    // ─── scenario 6: 2-player game, user busts, dealer wins ─────────────────

    test("2-player game where user busts and dealer wins is identical before and after visiting settings without making changes", async () => {
      jest.useFakeTimers();

      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );
        // P1 (user): King+5=15 with 2 cards → hits → +7 = 22 (bust)
        // P2 (dealer): Queen+9=19 → auto-stands → wins
        return {
          ...testHook({
            deck: generateMockDeck({
              "1": ["Spades-King", "Hearts-5", "Diamonds-7"],
              "2": ["Clubs-Queen", "Hearts-9"],
            }),
          }),
        };
      });

      render(<Home />);
      await startSetup("2");
      await runTimers(10);

      // P1 has King+5=15 with 2 cards — must hit
      await waitFor(() => {
        userEvent.click(screen.getByRole("button", { name: /hit me/i }));
      });

      await runTimers(10);

      await waitFor(() =>
        expect(screen.getByText("WIN!")).toBeInTheDocument()
      );

      const assertState = () => {
        const p1 = screen.getByTestId("player-1");
        const p2 = screen.getByTestId("player-2");

        expect(within(p1).getByText("TestUser")).toBeInTheDocument();
        expect(within(p1).getAllByText("King")).toHaveLength(2);
        expect(within(p1).getAllByText("5")).toHaveLength(2);
        expect(within(p1).getAllByText("7")).toHaveLength(2);
        expect(within(p1).getByText("22")).toBeInTheDocument();
        expect(within(p1).getByText("BUST")).toBeInTheDocument();
        expect(within(p1).queryByText("WIN!")).not.toBeInTheDocument();

        expect(within(p2).getByText("Dealer")).toBeInTheDocument();
        expect(within(p2).getAllByText("Queen")).toHaveLength(2);
        expect(within(p2).getAllByText("9")).toHaveLength(2);
        expect(within(p2).getByText("19")).toBeInTheDocument();
        expect(within(p2).getByText("WIN!")).toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: /play new game/i })
        ).toBeInTheDocument();
      };

      // Verify full state BEFORE visiting settings
      assertState();

      // Visit settings without changing anything, then cancel
      userEvent.click(screen.getByRole("button", { name: /settings/i }));
      userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Full state must be identical AFTER returning from settings
      assertState();
    });
  });

  describe("Push scenarios", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    test("displays push message when players tie", async () => {
      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );

        const deck = generateMockDeck({
          "1": ["Spades-King", "Hearts-10"],
          "2": ["Clubs-Queen", "Diamonds-10"],
        });

        return {
          ...testHook({ deck }),
        };
      });

      render(<Home />);

      // Setup game
      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );

      // Start game
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      // Let game complete
      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      const stand = screen.getByRole("button", { name: /stand/i });

      expect(stand).toBeInTheDocument();

      userEvent.click(stand);

      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Check for push message
      await waitFor(() => expect(screen.getByText("PUSH")).toBeInTheDocument());

      await waitFor(() =>
        expect(
          screen.getByText(/TestUser and Dealer are tied with 20 points/i)
        ).toBeInTheDocument()
      );
    });

    test("displays push message when all players bust", async () => {
      (useSimpleJackGame as jest.Mock).mockImplementation(() => {
        const { useSimpleJackGame: testHook } = jest.requireActual(
          "@/hooks/use-simple-jack"
        );

        const deck = generateMockDeck({
          "1": ["Spades-King", "Hearts-5", "Diamonds-7"],
          "2": ["Clubs-Queen", "Spades-6", "Hearts-8"],
        });

        return {
          ...testHook({ deck }),
        };
      });

      render(<Home />);

      // Setup game
      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      const playerSelect = screen.getByRole("combobox", {
        name: /number of players/i,
      });
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );

      // Start game
      const startButton = screen.getByRole("button", { name: /start game/i });
      userEvent.click(startButton);

      // Wait for user turn
      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // User hits and busts
      await waitFor(() => {
        const hitButton = screen.getByRole("button", { name: /hit me/i });
        userEvent.click(hitButton);
      });

      // Let game complete
      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Check for push message
      await waitFor(() => expect(screen.getByText("PUSH")).toBeInTheDocument());

      await waitFor(() =>
        expect(screen.getByText(/All players have busted/i)).toBeInTheDocument()
      );
    });
  });
});
