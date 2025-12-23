export type TileState = {
  x: number;
  y: number;
  type: "territory" | "fortified" | "enemy" | "obstacle";
  growingLevel: number;
  isHidden: boolean;
  isCaptured: boolean;
}