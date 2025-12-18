import { TileState } from "@/types/tileState";

export type GameState = "ongoing" | "playerWon" | "enemyWon";

function isSquareNumber(number: number) {
  return Math.sqrt(number) % 1 === 0;
}

export function isValidTileSet(tileStates: TileState[]) {
  if (!isSquareNumber(tileStates.length)) {
    return false;
  }
  for (const tile of tileStates) {
    if (tile.x < 1 || tile.x > tileStates.length || tile.y < 1 || tile.y > tileStates.length) {
      return false;
    }
    if (tile.type !== "territory" && tile.type !== "enemy" && tile.type !== "ally") {
      return false;
    }
    if (tile.growingLevel < 0 || tile.growingLevel > 6) {
      return false;
    }
    if (tile.isHidden !== true && tile.isHidden !== false) {
      return false;
    }
    if (tile.isCaptured !== true && tile.isCaptured !== false) {
      return false;
    }
  }
  return true;
}

// Function to check if the game is over
// returns "ongoing" if the game is not over, "playerWon" if the player won, "enemyWon" if the enemy won
export function isGameOver(movesLeft: number, tileStates: TileState[]): GameState {
  // check if all tiles are captured
  if (tileStates.every((tile) => tile.isCaptured)) {
    return "playerWon";
  }

  // check if the player has no moves left
  if (movesLeft <= 0) {
    return "enemyWon";
  }

  return "ongoing";
}

export function areAllTilesFortified(tileStates: TileState[]) {
  return tileStates.every((tile) => tile.type === "ally");
}