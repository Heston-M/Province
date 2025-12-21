import { GameConfig } from "@/types/gameConfig";
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
  const fillConfig = gameConfig.fillConfig;

  let numTerritory = 0;
  let numFortified = 0;
  let numEnemy = 0;

  // if using fixed fill config, generate the coordinates of the fortified and enemy tiles
  let fortifiedCoords: Set<[number, number]> = new Set();
  let enemyCoords: Set<[number, number]> = new Set();

  if (fillConfig && fillConfig.type === "fixed" && "numbers" in fillConfig) {
    for (let i = 0; i < fillConfig.numbers.fortified;) {
      const x = Math.floor(Math.random() * gameConfig.boardSize[0]) + 1;
      const y = Math.floor(Math.random() * gameConfig.boardSize[1]) + 1;
      if (!fortifiedCoords.has([x, y])) {
        fortifiedCoords.add([x, y]);
        i++;
      }
    }
    for (let i = 0; i < fillConfig.numbers.enemy;) {
      const x = Math.floor(Math.random() * gameConfig.boardSize[0]) + 1;
      const y = Math.floor(Math.random() * gameConfig.boardSize[1]) + 1;
      if (!enemyCoords.has([x, y])) {
        enemyCoords.add([x, y]);
        i++;
      }
    }
  }
  
  // generate the board tiles
  for (let y = 1; y <= gameConfig.boardSize[1]; y++) {
    for (let x = 1; x <= gameConfig.boardSize[0]; x++) {
      const tileState = initialTileStates.find((t) => t.x === x && t.y === y);
      if (tileState) {
        tiles.push(tileState);  // tile given by game config
      }
      else {
        const randNum = Math.random();
        let type = "territory";
        if (fillConfig.type === "probabilities") {  // randomly generate tile
          if (randNum < fillConfig.probabilities.territory) {
            type = "territory";
          }
          else if (randNum < fillConfig.probabilities.territory + fillConfig.probabilities.fortified) {
            type = "fortified";
          }
          else {
            type = "enemy";
          }
        }
        else if (fillConfig.type === "fixed" && "numbers" in fillConfig) {  // fill tile with uncaptured territory
          if (fortifiedCoords.has([x, y])) {
            type = "fortified";
          }
          else if (enemyCoords.has([x, y])) {
            type = "enemy";
          }
          else {
            type = "territory";
          }
        }
        if (type === "territory") {
          numTerritory++;
        }
        else if (type === "fortified") {
          numFortified++;
        }
        else if (type === "enemy") {
          numEnemy++;
        }
        tiles.push({ 
          x, y, 
          type: type as "territory" | "fortified" | "enemy", 
          growingLevel: 0, 
          isHidden: gameConfig.fogOfWar, 
          isCaptured: type === "fortified" ? true : false 
        });
      }
    }
  }
  // if using probabilities fill, update to be within the max and min values
  pinchToMaxMin();

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

  function pinchToMaxMin(): void {
    if (fillConfig.type === "probabilities") {
      while (numFortified < (fillConfig.probabilities?.minFortified ?? 0) && numTerritory > 0) {
        updateRandomTileType("territory", "fortified");
        numFortified++;
        numTerritory--;
      }
      while (numFortified > (fillConfig.probabilities?.maxFortified ?? gameConfig.boardSize[0] * gameConfig.boardSize[1]) && numFortified > 0) {
        updateRandomTileType("fortified", "territory");
        numFortified--;
        numTerritory++;
      }
      while (numEnemy < (fillConfig.probabilities?.minEnemy ?? 0) && numTerritory > 0) {
        updateRandomTileType("territory", "enemy");
        numEnemy++;
        numTerritory--;
      }
      while (numEnemy > (fillConfig.probabilities?.maxEnemy ?? gameConfig.boardSize[0] * gameConfig.boardSize[1]) && numEnemy > 0) {
        updateRandomTileType("enemy", "territory");
        numEnemy--;
        numTerritory++;
      }
    }
  }

  function updateRandomTileType(fromType: "territory" | "fortified" | "enemy", toType: "territory" | "fortified" | "enemy"): boolean {
    if (tiles.every((t) => t.type !== fromType)) {
      return false;
    }
    while (true) {
      const randX = Math.random() * gameConfig.boardSize[0] + 1;
      const randY = Math.random() * gameConfig.boardSize[1] + 1;
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