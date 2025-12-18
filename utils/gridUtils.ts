import { TileState } from "@/types/tileState";


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