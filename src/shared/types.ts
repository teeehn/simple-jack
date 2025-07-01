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
  cards: Card[];
  cardsToString: () => string;
  isEliminated?: boolean;
  playerId?: number;
  score: number;
}

export type PlayerHandsMockup = Record<string, Card[]>;
export type TestCase = Card[] | PlayerHandsMockup;

export enum EDealingSpeed {
  slow = 3000,
  normal = 2000,
  fast = 1000,
}

export interface IGameState {
  cardsDealtOnTurn: number;
  commentary: string[];
  currentPlayerIdx: number;
  dealingSpeed?: EDealingSpeed;
  gameDeck?: Card[];
  gameSummary?: string | null;
  gameOver: boolean;
  highScore: number;
  isEliminated?: boolean;
  players?: number;
  playerHands?: PlayerHand[];
  winner?: number;
}

export interface IGameProps {
  deck?: Card[];
  players?: number;
}

export type CardValueNotAce = Exclude<CardValue, "Ace">;
