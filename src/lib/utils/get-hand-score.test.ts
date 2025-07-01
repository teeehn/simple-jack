import { PlayerHand } from "@/shared/types";
import { getHandScore } from "./get-hand-score";

describe("gethandScore", () => {
  test("Adds hands correctly which do not contain aces.", () => {
    expect(
      getHandScore(
        ["Spades-7"] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-King"
      )
    ).toBe(17);
    expect(
      getHandScore(
        ["Spades-7", "Clubs-10"] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-King"
      )
    ).toBe(27);
    expect(
      getHandScore(
        ["Spades-7", "Diamonds-3"] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-King"
      )
    ).toBe(20);
  });

  test("Adds hands correctly that hit 21 with an ace.", () => {
    expect(
      getHandScore(
        ["Spades-Jack"] as unknown as Pick<PlayerHand, "cards">,
        "Spades-Ace"
      )
    );
    expect(
      getHandScore(
        ["Spades-Ace"] as unknown as Pick<PlayerHand, "cards">,
        "Spades-Jack"
      )
    );
  });

  test("Adds hands correctly which contain an arbitrary number of aces.", () => {
    expect(
      getHandScore(
        ["Spades-Ace", "Clubs-Ace", "Hearts-Ace"] as unknown as Pick<
          PlayerHand,
          "cards"
        >,
        "Diamonds-Ace"
      )
    ).toBe(14);

    expect(
      getHandScore(
        [
          "Spades-Ace",
          "Clubs-Ace",
          "Hearts-Ace",
          "Diamonds-Ace",
        ] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-7"
      )
    ).toBe(21);

    expect(
      getHandScore(
        [
          "Spades-Ace",
          "Clubs-Ace",
          "Hearts-Ace",
          "Diamonds-Ace",
        ] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-King"
      )
    ).toBe(14);

    expect(
      getHandScore(
        ["Spades-Ace", "Clubs-Ace"] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-King"
      )
    ).toBe(12);

    expect(
      getHandScore(
        [
          "Spades-Ace",
          "Clubs-Ace",
          "Hearts-Ace",
          "Diamonds-Ace",
        ] as unknown as Pick<PlayerHand, "cards">,
        "Hearts-5"
      )
    ).toBe(19);
  });

  test("Handles an empty hand.", () => {
    expect(getHandScore([] as never, "Spades-3")).toBe(3);
  });

  test("Throws if hand is undefined.", () => {
    expect(() => getHandScore(undefined as never, "Spades-3")).toThrow();
  });

  test("Throws if no card is passed.", () => {
    expect(() =>
      getHandScore(
        ["Spades-7"] as unknown as Pick<PlayerHand, "cards">,
        undefined as never
      )
    ).toThrow();
  });
});
