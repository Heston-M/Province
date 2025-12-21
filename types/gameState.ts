import { TileState } from "./tileState";

export type GameState = {
  status: "ongoing" | "animating" | "playerWon" | "enemyWon";
  tileStates: TileState[];
  previousTileStates: TileState[][]; // history of tile states
  movesLeft: number;
  elapsedTime: number;
  firstMove: boolean;
  movesEnabled: boolean;
  isPaused: boolean;
};
