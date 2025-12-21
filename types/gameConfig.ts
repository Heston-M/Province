import { TileState } from "./tileState";

export type GameConfig = {
  name: string;
  description: string;
  boardSize: [number, number]; // [width, height]
  resourceLimit: number;
  timeLimit: number;
  fogOfWar: boolean;
  enemyAggression: number;
  initialTileStates: TileState[];
  randRemainingTiles: boolean;
  randProbabilities: {
    territory: number;
    fortified: number;
    enemy: number;
  };
}