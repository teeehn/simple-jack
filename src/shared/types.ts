export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type CardValue =
  | "Ace"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "Jack"
  | "Queen"
  | "King";
export type Card = `${Suit}-${CardValue}`;

export interface ValidationData {
  suits: Record<Suit, Suit>;
  values: Record<CardValue, CardValue>;
}

export interface PlayerHand {
  score: number;
  cards: Card[];
  playerId?: number;
  cardsToString: () => string;
}
