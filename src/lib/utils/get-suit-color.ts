import { Card } from "@/shared/types";
import { getCardParts } from "./get-card-parts";

export function getSuitColor(card: Card): string {
  const suit = getCardParts(card).suit;
  return suit === "Hearts" || suit === "Diamonds"
    ? "text-red-600"
    : "text-black";
}
