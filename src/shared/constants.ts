import { ValidationData } from "./types";

export const validationData: ValidationData = {
  suits: {
    Clubs: "Clubs",
    Diamonds: "Diamonds",
    Hearts: "Hearts",
    Spades: "Spades",
  },
  values: {
    Ace: "Ace",
    Queen: "Queen",
    King: "King",
    Jack: "Jack",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
  },
};

export const MIN_PLAYERS = 2;

export const MAX_PLAYERS = 6;

export const DECK_SIZE = 52;

export const SIMPLE_JACK_SCORE = 21;

export const MUST_STAND_SCORE = 17;
