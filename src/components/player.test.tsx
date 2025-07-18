import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PlayerHand } from "@/shared/types";
import { playerCardHand } from "@/lib/simple-jack";
import { Player } from "./player";

describe("Player", () => {
  test("Renders with default props.", () => {
    const mockHand: PlayerHand = playerCardHand(1);
    const { container } = render(<Player hand={mockHand} />);

    expect(container).toBeInTheDocument();
    expect(screen.getByTestId("player-1")).toBeInTheDocument();
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
  });

  test("Renders a player with a card and a score.", () => {
    const mockHand: PlayerHand = playerCardHand(2);
    mockHand.cards = ["Spades-Ace"];
    mockHand.score = 11;

    render(<Player hand={mockHand} />);
    expect(screen.getByTestId("player-2")).toBeInTheDocument();
    expect(screen.getByText(/Player 2/)).toBeInTheDocument();
    expect(screen.getAllByText("♠")).toHaveLength(3); // Card shows suit symbol 3 times (top-left, center, bottom-right)
    expect(screen.getAllByText("Ace")).toHaveLength(2); // Card shows value 2 times (top-left, bottom-right)
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});
