import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
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
        expect(screen.getByText(/current player/i)).toBeInTheDocument()
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
        expect(screen.getByText(/current player/i)).toBeInTheDocument()
      );
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
        expect(screen.getByText(/current player/i)).toBeInTheDocument()
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
        expect(screen.getByText(/your turn/i)).toBeInTheDocument()
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
