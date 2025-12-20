import { GameConfig } from "@/types/gameConfig";
import { TileState } from "@/types/tileState";

/**
 * @description
 * Gets the board size based on the max height and width and the board size
 * @param maxHeight - The maximum height of the board
 * @param maxWidth - The maximum width of the board
 * @param boardSize - The board size
 * @returns [boardWidth, boardHeight, tileSize] in pixels
 */
export function getBoardSize(maxHeight: number, maxWidth: number, boardSize: [number, number]): [number, number, number] {
  const maxTileHeight = Math.floor(maxHeight / boardSize[1]);
  const maxTileWidth = Math.floor(maxWidth / boardSize[0]);
  const tileSize = Math.min(maxTileHeight, maxTileWidth);
  const boardHeight = tileSize * boardSize[1];
  const boardWidth = tileSize * boardSize[0];

  return [boardWidth, boardHeight, tileSize];
}

/**
 * @description
 * Generates the board based on the game config
 * @param gameConfig - The game config
 * @returns The board
 */
export function generateBoard(gameConfig: GameConfig): TileState[] {
  const tiles: TileState[] = [];
  
  for (let y = 1; y <= gameConfig.boardSize[1]; y++) {
    for (let x = 1; x <= gameConfig.boardSize[0]; x++) {
      const tileState = gameConfig.initialTileStates.find((t) => t.x === x && t.y === y);
      if (tileState) {
        tiles.push(tileState);  // tile determined by game config
      }
      else {
        if (gameConfig.randRemainingTiles) {  // randomly generate tile
          const randNum = Math.random();
          let type = "territory";
          if (randNum < gameConfig.randProbabilities.territory) {
            type = "territory";
          }
          else if (randNum < gameConfig.randProbabilities.territory + gameConfig.randProbabilities.fortified) {
            type = "fortified";
          }
          else {
            type = "enemy";
          }
          tiles.push({ 
            x, y, 
            type: type as "territory" | "fortified" | "enemy", 
            growingLevel: 0, 
            isHidden: gameConfig.fogOfWar, 
            isCaptured: type === "fortified" ? true : false 
          });
        }
        else {  // fill tile with uncaptured territory
          tiles.push({ 
            x, y, 
            type: "territory", 
            growingLevel: 0, 
            isHidden: gameConfig.fogOfWar, 
            isCaptured: false 
          });
        }
      }
    }
  }
  return tiles;
}

/**
 * @description
 * Gets the adjacent tiles to a given tile
 * @param x - The x coordinate of the tile
 * @param y - The y coordinate of the tile
 * @param boardSize - The board size
 * @param tileStates - The tile states
 * @returns The adjacent tiles
 */
export function getAdjacentTiles(x: number, y: number, boardSize: [number, number], tileStates: TileState[]) {
  const tiles = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x + i >= 1 && x + i <= boardSize[0] && y + j >= 1 && y + j <= boardSize[1]) {
        tiles.push({ x: x + i, y: y + j });
      }
    }
  }
  const adjacentTiles: TileState[] = [];
  for (const tile of tiles) {
    const tileState = tileStates.find((t) => t.x === tile.x && t.y === tile.y);
    if (tileState) {
      adjacentTiles.push(tileState);
    }
  }
  return adjacentTiles;
}

/**
 * @description
 * Advances the enemy tiles
 * @param tileStates - The tile states
 * @param boardSize - The board size
 * @param disallowedStates - The disallowed states
 * @returns The tile states with the advanced enemy tiles
 */
export function advanceEnemyTiles(tileStates: TileState[], boardSize: [number, number], disallowedStates: TileState[] = []): TileState[] {
  if (Math.random() < 0.9) {
    const capturableTiles: TileState[] = [];
    for (const tile of tileStates) {
      if (tile.type === "enemy") {
        capturableTiles.push(...getAdjacentTiles(tile.x, tile.y, boardSize, tileStates)
        .filter((t) => t.type === "territory" && !capturableTiles.includes(t)));
      }
    }
    if (capturableTiles.length > 0) {
      const tileToTakeOver = capturableTiles[Math.floor(Math.random() * capturableTiles.length)];
      if (!disallowedStates.includes(tileToTakeOver)) {
        tileToTakeOver.type = "enemy";
        tileToTakeOver.growingLevel = 0;
        tileToTakeOver.isCaptured = false;
      }
    }
  }
  return tileStates;
}

/**
 * @description
 * Progresses the territory growth. All captured territory tiles will grow by 1 level, until they reach 6, at which point they become fortified.
 * @param tileStates - The tile states
 * @returns The tile states with the progressed territory growth
 */
export function progressTerritoryGrowth(tileStates: TileState[]): TileState[] {
  for (const tile of tileStates) {
    if (tile.type === "territory" && tile.isCaptured) {
      if (tile.growingLevel <= 6) {
        tile.growingLevel++;
      }
      if (tile.growingLevel > 6) {
        tile.type = "fortified";
        tile.growingLevel = 0;
      }
    }
  }
  return tileStates;
}