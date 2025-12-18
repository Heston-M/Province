import { endGame } from "@/scripts/endGame";
import { GameConfig } from "@/types/gameConfig";
import { TileState } from "@/types/tileState";
import { GameState, isGameOver, isValidTileSet } from "@/utils/boardChecker";
import { advanceEnemyTiles, getAdjacentTiles, progressTerritoryGrowth } from "@/utils/gridUtils";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  movesLeft: number;
  tileStates: TileState[];
  firstMove: boolean;
  gameState: GameState;
  gameConfig: GameConfig;
  loadGame: () => void;
  newGame: (config: GameConfig) => void;
  selectTile: (state: TileState) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movesLeft, setMovesLeft] = useState<number>(10);
  const [tileStates, setTileStates] = useState<TileState[]>([]);
  const [firstMove, setFirstMove] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>("ongoing");
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    boardSize: 8,
    moveLimit: 10,
  });

  async function fetchGame(): Promise<boolean> {
    return Promise.all([
      storage.get<GameConfig>("gameConfig"), 
      storage.get<number>("movesLeft"), 
      storage.get<TileState[]>("tileStates"),
      storage.get<boolean>("firstMove")
    ]).then((values) => {
      const [gameConfig, movesLeft, tileStates, firstMove] = values;
      
      if (!gameConfig || gameConfig.boardSize < 1) {
        return false;
      }
      if (!movesLeft || movesLeft < 0) {
        return false;
      }
      if (!tileStates || !isValidTileSet(tileStates)) {
        return false;
      }
      if (!firstMove) {
        return false;
      }
      else {
        setMovesLeft(movesLeft);
        setTileStates(tileStates);
        setFirstMove(firstMove);
        setGameState(isGameOver(movesLeft, tileStates));
        setGameConfig(gameConfig);
        return true;
      }
    }).catch((error) => {
      console.error("Error fetching game:", error);
      return false;
    });
  }

  const loadGame = async () => {
    await fetchGame().then((valid) => {
      if (!valid) {
        newGame({ boardSize: 8, moveLimit: 10 });
      }
    });
  }

  useEffect(() => {
    loadGame();
  }, []);

  const newGame = (config: GameConfig) => {
    setGameConfig(config);
    storage.set<GameConfig>("gameConfig", config);

    setMovesLeft(config.moveLimit);
    storage.set<number>("movesLeft", config.moveLimit);

    const tiles: TileState[] = [];
    for (let y = 1; y <= config.boardSize; y++) {
      for (let x = 1; x <= config.boardSize; x++) {
        const randNum = Math.random();
        let type = "territory";
        if (randNum < 0.9) {
          type = "territory";
        } else if (randNum < 0.95) {
          type = "enemy";
        } else {
          type = "fortified";
        }
        tiles.push({ x, y, 
          growingLevel: 0, 
          type: type as "territory" | "fortified" | "enemy", 
          isHidden: false, 
          isCaptured: type === "fortified" ? true : false });
      }
    }
    setTileStates(tiles);
    storage.set<TileState[]>("tileStates", tiles);
    setFirstMove(true);
    storage.set<boolean>("firstMove", true);
    setGameState("ongoing");
  }

  const runEndGame = async () => {
    await endGame(tileStates, gameConfig.boardSize, (updatedStates) => {
      setTileStates([...updatedStates]);
    }).then(() => {
      setGameState("playerWon");
      storage.set<TileState[]>("tileStates", tileStates);
    }).catch((error) => {
      console.error("Error running end game:", error);
      setGameState("playerWon");
    });
  }

  const selectTile = (state: TileState) => {
    if (firstMove) {
      state.type = "territory";
      setFirstMove(false);
      storage.set<boolean>("firstMove", false);
    }

    let moveCost = 1;
    let growTerritory = true;
    state.isHidden = false;
    const adjacentTiles = getAdjacentTiles(state.x, state.y, gameConfig.boardSize, tileStates);
    const adjacentTerritoryTiles = adjacentTiles.filter((tile) => tile.type === "territory");

    // capture tile
    if (state.type === "territory") {
      if (!state.isCaptured) {
        state.isCaptured = true;
      }
      else if (state.growingLevel <= 6) {
        moveCost = 0;
        for (const tile of adjacentTerritoryTiles) {
          if (tile.type === "territory" && tile.growingLevel > 0 && tile.growingLevel <= 6) {
            tile.growingLevel = 0;
            moveCost -= 1;
          }
        }
        growTerritory = false;
      }
      state.growingLevel = 0;
    }
    if (state.type === "enemy") {
      state.type = "territory";
      state.isCaptured = true;
      if (adjacentTiles.some((tile) => tile.type === "fortified")) {
        moveCost = 1;
      } else {
        moveCost = 2;
      }
    }
    if (state.type === "fortified") {
      state.isCaptured = true;
      moveCost = 0;
    }

    // reveal adjacent tiles
    for (const tile of adjacentTiles) {
      tile.isHidden = false;
    }

    // grow territory
    if (growTerritory) {
      let nextStates = progressTerritoryGrowth(tileStates);
      nextStates = advanceEnemyTiles(nextStates, gameConfig.boardSize, [state]);

      setTileStates([...nextStates]);
      storage.set<TileState[]>("tileStates", nextStates);
    }

    setTileStates([...tileStates]);
    storage.set<TileState[]>("tileStates", tileStates);

    const nextNum = Math.max(0, Math.min(gameConfig.moveLimit, movesLeft - moveCost)); // clamp the moves left between 0 and the move limit
    setMovesLeft(nextNum);
    storage.set<number>("movesLeft", nextNum);

    const gameOverState = isGameOver(nextNum, tileStates);
    if (gameOverState === "playerWon") {
      runEndGame();
    }
    else {
      setGameState(gameOverState);
    }
  }

  return (
    <GameplayContext.Provider 
      value={{ movesLeft, tileStates, firstMove, gameState, gameConfig, loadGame, newGame, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}