export type TileState = {
  x: number;
  y: number;
  type: "territory" | "fortified" | "enemy";
  growingLevel: number;
  isHidden: boolean;
  isCaptured: boolean;
}