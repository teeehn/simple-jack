import { Card, CardValue, Suit } from "@/shared/types";

export function getCardParts(card: Card): { suit: Suit; value: CardValue } {
  const cardParts = card.split("-");
  return {
    suit: cardParts[0] as Suit,
    value: cardParts[1] as CardValue,
  };
}
