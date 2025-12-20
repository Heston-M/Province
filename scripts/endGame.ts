import { GameState } from "@/types/gameState";
import { TileState } from "@/types/tileState";
import { areAllTilesFortified, enemyCannotMove } from "@/utils/boardChecker";
import { advanceEnemyTiles, progressTerritoryGrowth } from "@/utils/gridUtils";

// progress the game until all tiles are fortified
// on each step, calls the onStepUpdate function with the updated tile states
// wait for 500ms before the next step
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
    if (winner === "enemyWon") nextStates = advanceEnemyTiles(nextStates, boardSize);

    onStepUpdate(nextStates);

    timeout = Math.max(100, timeout - 10);
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(resolve, timeout);
      });
    });
    currentStates = [...nextStates];
  }
  return currentStates;
}