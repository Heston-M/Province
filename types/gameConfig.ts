export type GameConfig = {
  boardSize: number;
  boardSize2?: [number, number]; // [width, height] for non-square boards
  moveLimit: number;
}