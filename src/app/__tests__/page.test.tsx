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
import Home from "../page";

describe("Simple Jack Game UI", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("Initial Setup Screen", () => {
    test("renders the setup screen with all required elements", () => {
      render(<Home />);

      expect(screen.getByText("Simple Jack")).toBeInTheDocument();
      expect(screen.getByText(/your name/i)).toBeInTheDocument();
      expect(screen.getByText("Number of Players (2-6):")).toBeInTheDocument();
      expect(screen.getByText("Dealing Speed:")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Start Game" })
      ).toBeInTheDocument();
    });

    test("allows selecting number of players from 2 to 6", () => {
      render(<Home />);

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
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

      const speedSelect = screen.getByLabelText("Dealing Speed:");
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

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      expect(playerSelect).toBeInTheDocument();
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );

      const startButton = screen.getByRole("button", { name: "Start Game" });
      fireEvent.click(startButton);

      // Should transition to game screen
      await waitFor(() =>
        expect(
          screen.getByText("Dealing cards... Current player: TestUser")
        ).toBeInTheDocument()
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

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("shows initial game state correctly", async () => {
      const startButton = screen.getByRole("button", { name: "Start Game" });
      waitFor(() => fireEvent.click(startButton));

      await waitFor(() =>
        expect(screen.getByText("Simple Jack")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(
          screen.getByText("Dealing cards... Current player: TestUser")
        ).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Game Commentary")).toBeInTheDocument()
      );
    });

    test("displays correct number of players", async () => {
      const startButton = screen.getByRole("button", { name: "Start Game" });
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

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "4" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays 4 players when selected", async () => {
      const startButton = screen.getByRole("button", { name: "Start Game" });
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

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays game commentary section", async () => {
      const startButton = screen.getByRole("button", { name: "Start Game" });
      userEvent.click(startButton);

      await waitFor(() =>
        expect(screen.getByText("Game Commentary")).toBeInTheDocument()
      );
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

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
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
        screen.getByRole("button", { name: "Start Game" })
      ).toBeInTheDocument();

      // Move to dealing phase
      const startButton = screen.getByRole("button", { name: "Start Game" });
      userEvent.click(startButton);

      await waitFor(() =>
        expect(
          screen.getByText("Dealing cards... Current player: TestUser")
        ).toBeInTheDocument()
      );
    });
  });

  // TODO: Add a mock for useSimpleJack hook to insure the tests
  //  behave as expected with known conditions.

  describe("Waits for user to choose hit or stand", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
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
      const startButton = screen.getByRole("button", { name: "Start Game" });
      userEvent.click(startButton);

      for (let timers = 0; timers < 10; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Wait for game to pause for the user to decide to hit or stand.

      await waitFor(() =>
        expect(
          screen.getByText(
            /TestUser, it\'s your turn! What would you like to do\?/i
          )
        ).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Hit me" })
        ).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Stand" })
        ).toBeInTheDocument()
      );
    });
  });

  describe("Play New Game", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);

      // Enter name

      const nameInput = screen.getByLabelText(/your name/i);
      await waitFor(() => userEvent.type(nameInput, "TestUser"));

      // Enter number of players.

      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
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
      const startButton = screen.getByRole("button", { name: "Start Game" });
      userEvent.click(startButton);

      for (let timers = 0; timers < 6; timers += 1) {
        await act(() => jest.runAllTimers());
      }

      // Wait for game to pause for the user to decide to hit or stand.

      await waitFor(() =>
        expect(screen.getByText(/game complete/i)).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Play New Game" })
        ).toBeInTheDocument()
      );
    });
  });
});
