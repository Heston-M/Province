import { TileState } from "./tileState";

export type FillConfig = {
  type: "probabilities" | "fixed";
  probabilities: {
    territory: number;
    fortified: number;
    enemy: number;
    maxFortified?: number;
    maxEnemy?: number;
    minFortified?: number;
    minEnemy?: number;
  };
} | {
  type: "fixed";
  numbers: {
    fortified: number;
    enemy: number;
  };
}

export type GameConfig = {
  name: string;
  description: string;
  boardSize: [number, number]; // [width, height]
  resourceLimit: number;
  timeLimit: number;
  fogOfWar: boolean;
  enemyAggression: number;
  initialTileStates: TileState[];
  fillConfig: FillConfig;
}

export const randomGameConfig: GameConfig = {
  name: "Default",
  description: "",
  boardSize: [8, 8],
  resourceLimit: 10,
  timeLimit: -1,
  fogOfWar: false,
  enemyAggression: 0.8,
  initialTileStates: [],
  fillConfig: {
    type: "probabilities",
    probabilities: {
      territory: 0.9,
      fortified: 0.05,
      enemy: 0.05,
    },
  },
}