export type TileState = {
  x: number;
  y: number;
  type: "territory" | "enemy" | "ally";
  growingLevel: number;
  isHidden: boolean;
  isCaptured: boolean;
}