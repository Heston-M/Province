import { GameConfig } from "@/types/gameConfig";

export const randomGames: GameConfig[] = [
  {
    name: "Random Game",
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
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [12, 8],
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
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [6, 6],
    resourceLimit: 8,
    timeLimit: -1,
    fogOfWar: false,
    enemyAggression: 0.9,
    initialTileStates: [],
    fillConfig: {
      type: "probabilities",
      probabilities: {
        territory: 0.9,
        fortified: 0.05,
        enemy: 0.05,
      },
    },
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [8, 8],
    resourceLimit: 8,
    timeLimit: -1,
    fogOfWar: false,
    enemyAggression: 0.8,
    initialTileStates: [],
    fillConfig: {
      type: "probabilities",
      probabilities: {
        territory: 0.8,
        fortified: 0.05,
        enemy: 0.15,
      },
    },
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [6, 6],
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
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [12, 12],
    resourceLimit: 10,
    timeLimit: -1,
    fogOfWar: true,
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
  },
  {
    name: "Random Game",
    description: "",
    boardSize: [12, 12],
    resourceLimit: 10,
    timeLimit: -1,
    fogOfWar: true,
    enemyAggression: 0.95,
    initialTileStates: [],
    fillConfig: {
      type: "probabilities",
      probabilities: {
        territory: 0.92,
        fortified: 0.04,
        enemy: 0.04,
      },
    },
  },
]

export function getRandomGame(): GameConfig {
  return randomGames[Math.floor(Math.random() * randomGames.length)];
}