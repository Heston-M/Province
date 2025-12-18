export type TileState = {
  x: number;
  y: number;
  type: "territory" | "enemy" | "ally";
  isHidden: boolean;
  isCaptured: boolean;
}