

export function getAdjacentTiles(x: number, y: number, boardSize: number) {
  const tiles = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 1 && x + i <= boardSize && y + j >= 1 && y + j <= boardSize) {
        tiles.push({ x: x + i, y: y + j });
      }
    }
  }
  return tiles;
}