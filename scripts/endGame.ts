import { TileState } from "@/types/tileState";
import { areAllTilesFortified } from "@/utils/boardChecker";
import { advanceEnemyTiles, progressTerritoryGrowth } from "@/utils/gridUtils";

// progress the game until all tiles are fortified
// on each step, calls the onStepUpdate function with the updated tile states
// wait for 500ms before the next step
export async function endGame(
  tileStates: TileState[],
  boardSize: number,
  onStepUpdate: (updatedStates: TileState[]) => void
) {
  let currentStates: TileState[] = tileStates.map(tile => ({ ...tile }));
  
  while (!areAllTilesFortified(currentStates)) {
    let nextStates = progressTerritoryGrowth(currentStates);
    nextStates = advanceEnemyTiles(nextStates, boardSize);
    onStepUpdate(nextStates);
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 300);
      });
    });
    currentStates = [...nextStates];
  }
}