import { getHandScore, getStaticCardValue } from "../lib/utils/get-hand-score";
import { CardValueNotAce } from "../shared/types";

describe("gethandScore", () => {
  test("Adds hands correctly which do not contain aces.", () => {
    expect(getHandScore(["Spades-7", "Hearts-King"])).toBe(17);
    expect(getHandScore(["Spades-7", "Clubs-10", "Hearts-King"])).toBe(27);
    expect(getHandScore(["Spades-7", "Diamonds-3", "Hearts-King"])).toBe(20);
  });

  test("Adds hands correctly that hit 21 with an ace.", () => {
    expect(getHandScore(["Spades-Jack", "Spades-Ace"]));
    expect(getHandScore(["Spades-Ace", "Spades-Jack"]));
  });

  test("Adds hands correctly which contain an arbitrary number of aces.", () => {
    // 3 aces: low=3, high=13; 0+13=13 ≤ 21 → 13
    expect(getHandScore(["Spades-Ace", "Clubs-Ace", "Hearts-Ace"])).toBe(13);
    // 3 aces + King: 10+13=23 > 21 → 10+3=13
    expect(
      getHandScore(["Spades-Ace", "Clubs-Ace", "Hearts-Ace", "Diamonds-King"])
    ).toBe(13);

    expect(
      getHandScore(["Spades-Ace", "Clubs-Ace", "Hearts-Ace", "Diamonds-Ace"])
    ).toBe(14);

    expect(
      getHandScore([
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-Ace",
        "Diamonds-Ace",
        "Hearts-7",
      ])
    ).toBe(21);

    expect(
      getHandScore([
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-Ace",
        "Diamonds-Ace",
        "Hearts-King",
      ])
    ).toBe(14);

    expect(getHandScore(["Spades-Ace", "Clubs-Ace", "Hearts-King"])).toBe(12);

    expect(
      getHandScore([
        "Spades-Ace",
        "Clubs-Ace",
        "Hearts-Ace",
        "Diamonds-Ace",
        "Hearts-5",
      ])
    ).toBe(19);
  });

  test("Handles an empty hand.", () => {
    expect(getHandScore([] as never)).toBe(0);
  });

  test("Throws if hand is undefined.", () => {
    expect(() => getHandScore(undefined as never)).toThrow();
  });
});

describe("getStaticCardValue", () => {
  test("throws for a non-numeric, non-face-card value", () => {
    expect(() => getStaticCardValue("abc" as CardValueNotAce)).toThrow(
      "Card value is not valid."
    );
  });
});
