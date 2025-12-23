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
    obstacle: number;
    maxFortified: number;
    maxEnemy: number;
    maxObstacle: number;
    minFortified: number;
    minEnemy: number;
    minObstacle: number;
  };
}

export type FixedFillConfig = FillConfig & {
  type: "fixed";
  numbers: {
    fortified: number;
    enemy: number;
    obstacle: number;
  }
}

export type GameConfig = {
  id: number;
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