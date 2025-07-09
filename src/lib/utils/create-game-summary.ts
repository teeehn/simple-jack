import { IGameState } from "@/shared/types";

/**
 * Updates the game summary in the game state.
 *
 * @argument gameState {IGameState}
 * @argument func {(id: number) => string}
 * @returns gameState {IGameState}
 */
export function createGameSummary(
  gameState: IGameState,
  func: (id: number) => string
): IGameState {
  const { highScore, playerHands, winner } = gameState;

  return winner && winner > 0
    ? {
        ...gameState,
        gameSummary: `Winner: ${func(winner)}, Hand: ${playerHands![
          winner - 1
        ].cardsToString()}, Value: ${highScore}`,
      }
    : {
        ...gameState,
        gameSummary: null,
      };
}
