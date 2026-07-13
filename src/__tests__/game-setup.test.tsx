import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { GameSetup } from "../components/game-setup";
import { EDealingSpeed } from "@/shared/types";

describe("GameSetup", () => {
  test("renders form fields and a disabled start button when fields are empty", () => {
    render(<GameSetup onStartGame={jest.fn()} />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of players/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fill in all fields/i })).toBeDisabled();
  });

  test("calls onStartGame with the selected config when the form is complete", () => {
    const onStartGame = jest.fn();
    render(<GameSetup onStartGame={onStartGame} />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByLabelText(/number of players/i), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /start game/i }));

    expect(onStartGame).toHaveBeenCalledWith({
      playerName: "TestUser",
      numPlayers: 3,
      dealingSpeed: EDealingSpeed.normal,
    });
  });

  test("clearing the player count select back to empty disables the start button", () => {
    render(<GameSetup onStartGame={jest.fn()} />);

    const select = screen.getByLabelText(/number of players/i);

    fireEvent.change(select, { target: { value: "4" } });
    expect(select).toHaveValue("4");

    // Clear back to the empty placeholder — triggers setNumPlayers(undefined) at line 86
    fireEvent.change(select, { target: { value: "" } });
    expect(select).toHaveValue("");

    expect(screen.getByRole("button", { name: /fill in all fields/i })).toBeDisabled();
  });

  test("renders and calls the Cancel button when onCancel is provided", () => {
    const onCancel = jest.fn();
    render(<GameSetup onStartGame={jest.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test("pre-fills fields from initial props", () => {
    render(
      <GameSetup
        onStartGame={jest.fn()}
        initialPlayerName="Alice"
        initialNumPlayers={4}
        initialDealingSpeed={EDealingSpeed.fast}
      />
    );

    expect(screen.getByLabelText(/your name/i)).toHaveValue("Alice");
    expect(screen.getByLabelText(/number of players/i)).toHaveValue("4");
  });

  test("clicking the disabled start button with an incomplete form does not call onStartGame", () => {
    const onStartGame = jest.fn();
    render(<GameSetup onStartGame={onStartGame} />);

    // Provide player count but no name — button stays disabled
    fireEvent.change(screen.getByLabelText(/number of players/i), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /fill in all fields/i }));

    expect(onStartGame).not.toHaveBeenCalled();
  });
});
