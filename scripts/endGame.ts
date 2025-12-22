import { GameState } from "@/types/gameState";
import { TileState } from "@/types/tileState";
import { areAllTilesFortified, enemyCannotMove } from "@/utils/boardChecker";
import { advanceEnemyTiles, progressTerritoryGrowth } from "@/utils/gridUtils";

/**
 * @description
 * Ends the game by progressing the game state until all tiles are fortified or the enemy cannot move.
 * @param initialStates - The initial tile states
 * @param boardSize - The board size
 * @param winner - The winner of the game
 * @param onStepUpdate - Callback function to be called on each step with the updated tile states
 * @returns Promise that resolves when the game is over, with the final tile states
 */
export async function endGame(
  initialStates: TileState[],
  boardSize: [number, number],
  winner: GameState["status"],
  onStepUpdate: (updatedStates: TileState[]) => void
): Promise<TileState[]> {
  let currentStates: TileState[] = initialStates.map(tile => ({ ...tile }));
  let timeout = 300;

  while (winner === "playerWon" && !areAllTilesFortified(currentStates) 
     || (winner === "enemyWon" && !enemyCannotMove(currentStates, boardSize))) {

    let nextStates = progressTerritoryGrowth(currentStates);
    if (winner === "enemyWon") nextStates = advanceEnemyTiles(nextStates, boardSize, 1);

    onStepUpdate(nextStates);

    timeout = Math.max(50, timeout - 10);
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(resolve, timeout);
      });
    });
    currentStates = [...nextStates];
  }
  return currentStates;
}