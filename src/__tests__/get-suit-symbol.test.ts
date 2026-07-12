import { Card } from "../shared/types";
import { getSuitSymbol } from "../lib/utils/get-suit-symbol";

describe("getSuitSymbol", () => {
  test("returns the correct symbol for each suit", () => {
    expect(getSuitSymbol("Hearts-Ace" as Card)).toBe("♥");
    expect(getSuitSymbol("Diamonds-King" as Card)).toBe("♦");
    expect(getSuitSymbol("Clubs-10" as Card)).toBe("♣");
    expect(getSuitSymbol("Spades-2" as Card)).toBe("♠");
  });

  test("returns an empty string for an unknown suit", () => {
    expect(getSuitSymbol("InvalidSuit-Ace" as Card)).toBe("");
  });
});
