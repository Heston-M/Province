import { TileState } from "./tileState";

export type GameState = {
  status: "ongoing" | "animating" | "playerWon" | "enemyWon";
  tileStates: TileState[];
  initialTileStates: TileState[];
  resourcesLeft: number;
  elapsedTime: number;
  firstMove: boolean;
  movesEnabled: boolean;
  isPaused: boolean;
};
