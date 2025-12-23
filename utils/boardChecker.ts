import { GameState } from "@/types/gameState";
import { TileState } from "@/types/tileState";
import { getAdjacentTiles } from "./gridUtils";

/**
 * @description
 * Checks if the tile set is valid
 * @param tileStates - The tile states to check
 * @param boardSize - The board size
 * @returns true if the tile set is valid, false otherwise
 */
export function isValidTileSet(tileStates: TileState[], boardSize: [number, number]) {
  if (tileStates.length !== boardSize[0] * boardSize[1]) {
    return false;
  }
  for (const tile of tileStates) {
    if (tile.x < 1 || tile.x > boardSize[0] || tile.y < 1 || tile.y > boardSize[1]) {
      return false;
    }
    if (tile.type !== "territory" && tile.type !== "fortified" && tile.type !== "enemy" && tile.type !== "obstacle") {
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

/**
 * @description
 * Checks if the game is over
 * @param resourcesLeft - The number of resources left
 * @param tileStates - The tile states to check
 * @returns "ongoing" if the game is not over, "playerWon" if the player won, "enemyWon" if the enemy won
 */
export function isGameOver(resourcesLeft: number, tileStates: TileState[]): GameState["status"] {
  if (tileStates.every((tile) => tile.isCaptured || tile.type === "obstacle")) {
    return "playerWon";
  }
  if (resourcesLeft <= 0) {
    return "enemyWon";
  }
  return "ongoing";
}

/**
 * @description
 * Checks if all tiles are fortified
 * @param tileStates - The tile states to check
 * @returns true if all tiles are fortified, false otherwise
 */
export function areAllTilesFortified(tileStates: TileState[]) {
  return tileStates.every((tile) => tile.type === "fortified" || tile.type === "obstacle");
}

/**
 * @description
 * Checks if the enemy cannot move
 * @param tileStates - The tile states to check
 * @param boardSize - The board size
 * @returns true if the enemy cannot move, false otherwise
 */
export function enemyCannotMove(tileStates: TileState[], boardSize: [number, number]) {
  const enemyTiles = tileStates.filter((tile) => tile.type === "enemy");
  for (const tile of enemyTiles) {
    const adjacentTiles = getAdjacentTiles(tile.x, tile.y, boardSize, tileStates);
    if (adjacentTiles.some((tile) => tile.type === "territory")) {
      return false;
    }
  }
  return true;
}