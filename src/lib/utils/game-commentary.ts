import { Card } from "@/shared/types";

export const GameCommentary = {
  playerDraws: (playerId: number, card: Card) =>
    `Player ${playerId} draws ${card}`,
  player21: (playerId: number) =>
    `Player ${playerId} has exactly 21 points and wins!`,
  playerBusts: (playerId: number, score: number) =>
    `Player ${playerId} busts with ${score} and is eliminated`,
  playerMustStand: (playerId: number, score: number) =>
    `Player ${playerId} has ${score} points and must stand.`,
  playerMustDraw: (playerId: number, score: number) =>
    `Player ${playerId} has ${score} points and must take another card.`,
  playersAllBust: `All players busted! No winner.`,
  playerWinsHighestScore: (playerId: number, score: number) =>
    `Player ${playerId} wins with ${score} points!`,
  playersTie: (players: number[], score: number) =>
    `Tie game! Players ${players.join(", ")} all have ${score} points.`,
};
