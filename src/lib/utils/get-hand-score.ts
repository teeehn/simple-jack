import { Card, CardValue, CardValueNotAce, PlayerHand } from "@/shared/types";
import { SIMPLE_JACK_SCORE } from "@/shared/constants";
import { getCardParts } from "./get-card-parts";

/**
 * getStaticCardValue - Determines the card value for
 *  everything not an Ace.
 *
 * @param card {Card}
 * @returns {number}
 */
export function getStaticCardValue(rawValue: CardValueNotAce): number {
  if (rawValue === "King" || rawValue === "Queen" || rawValue === "Jack") {
    return 10;
  }
  const parsedValue = Number(rawValue);
  if (isNaN(parsedValue)) {
    throw new Error("Card value is not valid.");
  }
  return parsedValue;
}

export function getHandScore(
  hand: Pick<PlayerHand, "cards">,
  card: Card
): number {
  const cardValues: CardValue[] = hand.cards
    .slice()
    .concat([card])
    .map((c) => getCardParts(c).value);

  // Are there any Aces?

  const hasAces = cardValues.some((c) => c === "Ace");

  // If no aces calculate based on static values and return.

  if (!hasAces) {
    return (cardValues as CardValueNotAce[]).reduce(
      (score, val) => (score += getStaticCardValue(val)),
      0
    );
  }

  // Separate the aces from the non aces and calculate.

  const aces: Array<"Ace"> = [];
  const others: CardValueNotAce[] = cardValues.reduce(
    (acc: CardValueNotAce[], val: CardValue) => {
      if (val === "Ace") {
        aces.push(val);
      } else {
        acc.push(val);
      }
      return acc;
    },
    []
  );

  // Total up the non-ace cards.

  const score =
    others.length > 0
      ? others.reduce(
          (tot: number, v: CardValueNotAce) => (tot += getStaticCardValue(v)),
          0
        )
      : 0;

  // The numbers we can add to the total depend on the number of aces present.
  //    We just use the possible combinations which might add up to less
  //    than or equal to 21.

  let low, high;
  switch (aces.length) {
    case 4:
      low = 4;
      high = 14;
      break;
    case 3:
      low = 3;
      high = 13;
      break;
    case 2:
      low = 2;
      high = 12;
      break;
    default:
      low = 1;
      high = 11;
  }

  if (score + high <= SIMPLE_JACK_SCORE) {
    return score + high;
  }

  return score + low;
}
