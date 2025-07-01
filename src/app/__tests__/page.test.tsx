import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";

describe("Simple Jack Game UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Setup Screen", () => {
    test("renders the setup screen with all required elements", () => {
      render(<Home />);

      expect(screen.getByText("Simple Jack")).toBeInTheDocument();
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

    test("starts game when Start Game button is clicked", async () => {
      render(<Home />);

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
          screen.getByText("Dealing cards... Current player: 1")
        ).toBeInTheDocument()
      );

      await waitFor(
        () => expect(screen.getByText("Player 1")).toBeInTheDocument(),
        { timeout: 2000 }
      );
      await waitFor(
        () => expect(screen.getByText("Player 2")).toBeInTheDocument(),
        { timeout: 2000 }
      );
    });
  });

  describe("Game Screen", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);
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
          screen.getByText("Dealing cards... Current player: 1")
        ).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Game Commentary")).toBeInTheDocument()
      );
    });

    test("displays correct number of players", async () => {
      const startButton = screen.getByRole("button", { name: "Start Game" });
      waitFor(() => fireEvent.click(startButton));
      for (let timers = 0; timers < 2; timers += 1) {
        act(() => jest.advanceTimersToNextTimer());
      }

      await waitFor(() =>
        expect(screen.getByText("Player 1")).toBeInTheDocument()
      );

      await waitFor(() =>
        expect(screen.getByText("Player 2")).toBeInTheDocument()
      );
    });
  });

  describe("Game with 4 Players", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);
      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "4" } })
      );

      const startButton = screen.getByRole("button", { name: "Start Game" });
      fireEvent.click(startButton);
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays 4 players when selected", async () => {
      for (let timers = 0; timers < 4; timers += 1) {
        act(() => jest.advanceTimersToNextTimer());
      }

      await waitFor(() =>
        expect(screen.getByText("Player 1")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Player 2")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Player 3")).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(screen.getByText("Player 4")).toBeInTheDocument()
      );
    });
  });

  describe("Game Commentary", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);
      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      fireEvent.change(playerSelect, { target: { value: "2" } });

      const startButton = screen.getByRole("button", { name: "Start Game" });
      fireEvent.click(startButton);
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("displays game commentary section", () => {
      expect(screen.getByText("Game Commentary")).toBeInTheDocument();
    });
  });

  describe("Game State Management", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);
      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      fireEvent.change(playerSelect, { target: { value: "2" } });
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
      fireEvent.click(startButton);

      expect(
        screen.getByText("Dealing cards... Current player: 1")
      ).toBeInTheDocument();
    });
  });

  describe("Play New Game Button", () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      render(<Home />);
      const playerSelect = screen.getByLabelText("Number of Players (2-6):");
      await waitFor(() =>
        fireEvent.change(playerSelect, { target: { value: "2" } })
      );
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("Play New Game Button is visible at the end of the game.", async () => {
      // Start a game
      const startButton = screen.getByRole("button", { name: "Start Game" });
      fireEvent.click(startButton);

      for (let timers = 0; timers < 10; timers += 1) {
        act(() => jest.advanceTimersToNextTimer());
      }

      // Wait for game to potentially finish
      await waitFor(() =>
        expect(screen.getByText(/Game Complete/)).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Play New Game" })
        ).toBeInTheDocument()
      );
    });
  });
});
