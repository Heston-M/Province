export type TileState = {
  x: number;
  y: number;
  type: "blank" | "territory" | "enemy" | "ally";
  isHidden: boolean;
}