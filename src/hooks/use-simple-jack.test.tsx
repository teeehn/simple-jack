import { renderHook } from "@testing-library/react";

import { generateMockDeck } from "@/lib/utils";
import { useSimpleJackGame } from "./use-simple-jack";

describe("useSimpleJackGame Hook", () => {
  test("Rendering hook with known deck returns initial state.", () => {
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
});
