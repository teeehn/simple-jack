import { Card } from "@/shared/types";
import { getCardParts } from "./get-card-parts";

export function getSuitSymbol(card: Card): string {
  const suit = getCardParts(card).suit;
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
}
