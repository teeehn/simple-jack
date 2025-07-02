import { getHandScore } from "./get-hand-score";

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
