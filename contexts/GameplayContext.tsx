import { endGame } from "@/scripts/endGame";
import { GameConfig } from "@/types/gameConfig";
import { GameState } from "@/types/gameState";
import { TileState } from "@/types/tileState";
import { isGameOver, isValidTileSet } from "@/utils/boardChecker";
import { advanceEnemyTiles, getAdjacentTiles, progressTerritoryGrowth } from "@/utils/gridUtils";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  gameState: GameState;
  gameConfig: GameConfig;
  loadGame: () => void;
  newGame: (config: GameConfig) => void;
  selectTile: (state: TileState) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: "ongoing",
    movesLeft: 10,
    elapsedTime: 0,
    tileStates: [],
    firstMove: true,
    movesEnabled: true,
  });
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    boardSize: 8,
    moveLimit: 10,
  });

  async function fetchGame(): Promise<boolean> {
    return Promise.all([
      storage.get<GameConfig>("gameConfig"), 
      storage.get<GameState>("gameState"),
    ]).then((values) => {
      const [gameConfig, gameState] = values;
      
      if (!gameConfig || gameConfig.boardSize < 1) {
        return false;
      }
      if (!gameState) {
        return false;
      }
      if (!gameState.tileStates || !isValidTileSet(gameState.tileStates)) {
        return false;
      }
      else {
        setGameState(gameState);
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
    setGameState({
      status: "ongoing",
      movesLeft: config.moveLimit,
      elapsedTime: 0,
      tileStates: tiles,
      firstMove: true,
      movesEnabled: true,
    })
    storage.set<GameState>("gameState", gameState);
  }

  useEffect(() => {
    if (gameState.status !== "ongoing") {
      return;
    }
    const interval = setInterval(() => {
      setGameState({...gameState, elapsedTime: gameState.elapsedTime + 1});
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const runEndGame = async (status: GameState["status"]) => {
    setGameState({...gameState, movesEnabled: false});
    await endGame(gameState.tileStates, gameConfig.boardSize, status, (updatedStates) => {
      setGameState({...gameState, tileStates: updatedStates});
    }).then(() => {
      setGameState({...gameState, status: status});
    }).catch((error) => {
      console.error("Error running end game:", error);
      setGameState({...gameState, status: status});
    });
  }

  const selectTile = (state: TileState) => {
    if (gameState.firstMove) {
      state.type = "territory";
      setGameState({...gameState, firstMove: false});
    }

    let moveCost = 1;
    let growTerritory = true;
    state.isHidden = false;
    const adjacentTiles = getAdjacentTiles(state.x, state.y, gameConfig.boardSize, gameState.tileStates);
    const adjacentTerritoryTiles = adjacentTiles.filter((tile) => tile.type === "territory");

    // capture tile
    if (state.type === "territory") {
      if (!state.isCaptured) {
        state.isCaptured = true;
      }
      else if (state.growingLevel === 6) {
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
      let nextStates = progressTerritoryGrowth(gameState.tileStates);
      nextStates = advanceEnemyTiles(nextStates, gameConfig.boardSize, [state]);

      setGameState({...gameState, tileStates: [...nextStates]});
    }

    setGameState({...gameState, tileStates: [...gameState.tileStates]});

    const nextNum = Math.max(0, Math.min(gameConfig.moveLimit, gameState.movesLeft - moveCost)); // clamp the moves left between 0 and the move limit
    setGameState({...gameState, movesLeft: nextNum});

    storage.set<GameState>("gameState", gameState);

    const gameOverState = isGameOver(nextNum, gameState.tileStates);
    if (gameOverState !== "ongoing") {
      runEndGame(gameOverState);
    }
  }

  return (
    <GameplayContext.Provider 
      value={{ gameState, gameConfig, loadGame, newGame, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}