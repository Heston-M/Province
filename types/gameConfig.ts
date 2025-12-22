import { TileState } from "./tileState";

export type FillConfig = {
  type: "probabilities" | "fixed";
}

export type ProbabilitiesFillConfig = FillConfig & {
  type: "probabilities";
  probabilities: {
    territory: number;
    fortified: number;
    enemy: number;
    maxFortified: number;
    maxEnemy: number;
    minFortified: number;
    minEnemy: number;
  };
}

export type FixedFillConfig = FillConfig & {
  type: "fixed";
  numbers: {
    fortified: number;
    enemy: number;
  }
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