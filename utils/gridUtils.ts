import { TileState } from "@/types/tileState";


/**
 * Get the board size based on the max height and width and the board size
 * @param maxHeight - The maximum height of the board
 * @param maxWidth - The maximum width of the board
 * @param boardSize - The board size
 * @returns [boardWidth, boardHeight, tileSize]
 */
export function getBoardSize(maxHeight: number, maxWidth: number, boardSize: [number, number]): [number, number, number] {
  const maxTileHeight = Math.floor(maxHeight / boardSize[1]);
  const maxTileWidth = Math.floor(maxWidth / boardSize[0]);
  const tileSize = Math.min(maxTileHeight, maxTileWidth);
  const boardHeight = tileSize * boardSize[1];
  const boardWidth = tileSize * boardSize[0];

  return [boardWidth, boardHeight, tileSize];
}

export function getAdjacentTiles(x: number, y: number, boardSize: number, tileStates: TileState[]) {
  const tiles = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 1 && x + i <= boardSize && y + j >= 1 && y + j <= boardSize) {
        tiles.push({ x: x + i, y: y + j });
      }
    }
  }
  const adjacentTiles: TileState[] = [];
  for (const tile of tiles) {
    const tileState = tileStates.find((t) => t.x === tile.x && t.y === tile.y);
    if (tileState) {
      adjacentTiles.push(tileState);
    }
  }
  return adjacentTiles;
}

export function advanceEnemyTiles(tileStates: TileState[], boardSize: number, disallowedStates: TileState[] = []): TileState[] {
  if (Math.random() < 0.9) {
    const capturableTiles: TileState[] = [];
    for (const tile of tileStates) {
      if (tile.type === "enemy") {
        capturableTiles.push(...getAdjacentTiles(tile.x, tile.y, boardSize, tileStates)
        .filter((t) => t.type === "territory" && !capturableTiles.includes(t)));
      }
    }
    if (capturableTiles.length > 0) {
      const tileToTakeOver = capturableTiles[Math.floor(Math.random() * capturableTiles.length)];
      if (!disallowedStates.includes(tileToTakeOver)) {
        tileToTakeOver.type = "enemy";
        tileToTakeOver.growingLevel = 0;
        tileToTakeOver.isCaptured = false;
      }
    }
  }
  return tileStates;
}

export function progressTerritoryGrowth(tileStates: TileState[]): TileState[] {
  for (const tile of tileStates) {
    if (tile.type === "territory" && tile.isCaptured) {
      if (tile.growingLevel <= 6) {
        tile.growingLevel++;
      }
      if (tile.growingLevel > 6) {
        tile.type = "fortified";
        tile.growingLevel = 0;
      }
    }
  }
  return tileStates;
}