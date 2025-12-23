import { FixedFillConfig, GameConfig, ProbabilitiesFillConfig } from "@/types/gameConfig";
import { TileState } from "@/types/tileState";
import { getAdjacentTiles } from "./gridUtils";

/**
 * @description
 * Generates the board based on the game config
 * @param gameConfig - The game config
 * @returns The board
 */
export function generateBoard(gameConfig: GameConfig): TileState[] {
  const tiles: TileState[] = [];
  const initialTileStates = gameConfig.initialTileStates ?? [];
  const fillConfigType = gameConfig.fillConfig.type;
  let fillConfig: ProbabilitiesFillConfig | FixedFillConfig;
  if (fillConfigType === "probabilities") {
    fillConfig = gameConfig.fillConfig as ProbabilitiesFillConfig;
  }
  else if (fillConfigType === "fixed") {
    fillConfig = gameConfig.fillConfig as FixedFillConfig;
  }
  else {
    throw new Error("Invalid fill config type");
  }

  let numTerritory = 0;
  let numFortified = 0;
  let numEnemy = 0;
  let numObstacle = 0;

  // if using fixed fill config, generate the coordinates of the fortified, enemy, and obstacle tiles
  let determinedTileTypes: Map<string, "territory" | "fortified" | "enemy" | "obstacle"> = new Map();

  function determineTiles(num: number, type: "territory" | "fortified" | "enemy" | "obstacle"): void {
    if (fillConfig.type === "fixed") {
      while (num < fillConfig.numbers.fortified) {
        const x = Math.floor(Math.random() * gameConfig.boardSize[0]) + 1;
        const y = Math.floor(Math.random() * gameConfig.boardSize[1]) + 1;
        if (!determinedTileTypes.has(`${x},${y}`) && !initialTileStates.some((t) => t.x === x && t.y === y)) {
          determinedTileTypes.set(`${x},${y}`, type);
        }
      }
    }
  }
  determineTiles(numFortified, "fortified");
  determineTiles(numEnemy, "enemy");
  determineTiles(numObstacle, "obstacle");
  
  // generate the board tiles
  for (let y = 1; y <= gameConfig.boardSize[1]; y++) {
    for (let x = 1; x <= gameConfig.boardSize[0]; x++) {
      const tileState = initialTileStates.find((t) => t.x === x && t.y === y);
      let type: "territory" | "fortified" | "enemy" | "obstacle" = "territory";
      if (tileState) {
        tiles.push(tileState);  // tile given by game config
        type = tileState.type;
      }
      else {
        const randNum = Math.random();
        if (fillConfig.type === "probabilities") {  // randomly generate tile
          if (randNum < fillConfig.probabilities.territory) {
            type = "territory";
            numTerritory++;
          }
          else if (randNum < fillConfig.probabilities.territory + fillConfig.probabilities.fortified) {
            type = "fortified";
            numFortified++;
          }
          else if (randNum < fillConfig.probabilities.territory + fillConfig.probabilities.fortified + fillConfig.probabilities.enemy) {
            type = "enemy";
            numEnemy++;
          }
          else {
            type = "obstacle";
            numObstacle++;
          }
        }
        else if (fillConfig.type === "fixed") {  // fill tile with uncaptured territory
          if (determinedTileTypes.has(`${x},${y}`)) {
            type = determinedTileTypes.get(`${x},${y}`) as "territory" | "fortified" | "enemy" | "obstacle";
          }
          else {
            type = "territory";
            numTerritory++;
          }
        }
        tiles.push({ 
          x, y, 
          type, 
          growingLevel: 0, 
          isHidden: gameConfig.fogOfWar, 
          isCaptured: type === "fortified" ? true : false 
        });
      }
    }
  }
  // if using probabilities fill, update to be within the max and min values
  if (fillConfig.type === "probabilities") {
    const probabilities = (fillConfig as ProbabilitiesFillConfig).probabilities;
    numFortified = pinchToMaxMin(probabilities.maxFortified, probabilities.minFortified, "fortified");
    numEnemy = pinchToMaxMin(probabilities.maxEnemy, probabilities.minEnemy, "enemy");
    numObstacle = pinchToMaxMin(probabilities.maxObstacle, probabilities.minObstacle, "obstacle");
  }

  // reveal fortified tiles and adjacent tiles if fog of war is enabled
  if (gameConfig.fogOfWar) {
    const fortifiedTiles = tiles.filter((tile) => tile.type === "fortified");
    for (const tile of fortifiedTiles) {
      tile.isHidden = false;
      const adjacentTiles = getAdjacentTiles(tile.x, tile.y, gameConfig.boardSize, tiles);
      for (const adjacentTile of adjacentTiles) {
        adjacentTile.isHidden = false;
      }
    }
  }
  return tiles;

  function pinchToMaxMin(max: number, min: number, type: "fortified" | "enemy" | "obstacle"): number {
    let num = -1;
    if (fillConfig.type === "probabilities") {
      switch (type) {
        case "fortified":
          num = numFortified;
          break;
        case "enemy":
          num = numEnemy;
          break;
        case "obstacle":
          num = numObstacle;
          break;
      }
      while (num < min && numTerritory > 0) {
        updateRandomTileType("territory", type);
        num++;
        numTerritory--;
      }
      while (num > max && numTerritory < gameConfig.boardSize[0] * gameConfig.boardSize[1]) {
        updateRandomTileType(type, "territory");
        num--;
        numTerritory++;
      }
    }
    return num;
  }

  function updateRandomTileType(fromType: "territory" | "fortified" | "enemy" | "obstacle", toType: "territory" | "fortified" | "enemy" | "obstacle"): boolean {
    if (tiles.every((t) => t.type !== fromType)) {
      return false;
    }
    while (true) {
      const randX = Math.floor(Math.random() * gameConfig.boardSize[0]) + 1;
      const randY = Math.floor(Math.random() * gameConfig.boardSize[1]) + 1;
      const randTile = tiles.find((t) => t.x === randX && t.y === randY);
      if (randTile && randTile.type === fromType) {
        randTile.type = toType;
        if (toType === "fortified") {
          randTile.isCaptured = true;
        }
        else {
          randTile.isCaptured = false;
        }
        return true;
      }
    }
  }
}