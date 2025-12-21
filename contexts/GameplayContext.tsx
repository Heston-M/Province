import { endGame } from "@/scripts/endGame";
import { GameConfig } from "@/types/gameConfig";
import { GameState } from "@/types/gameState";
import { TileState } from "@/types/tileState";
import { isGameOver, isValidTileSet } from "@/utils/boardChecker";
import { isValidConfig } from "@/utils/configUtils";
import { generateBoard } from "@/utils/gameGenerator";
import { advanceEnemyTiles, getAdjacentTiles, progressTerritoryGrowth } from "@/utils/gridUtils";
import { isStorageQuotaError, storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  gameState: GameState;
  gameConfig: GameConfig;
  loadGame: () => void;
  restartGame: () => void;
  newGame: (config: GameConfig) => boolean;
  selectTile: (state: TileState) => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

const defaultGameConfig: GameConfig = {
  name: "Default",
  description: "A default game config",
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

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: "ongoing",
    tileStates: [],
    previousTileStates: [],
    resourcesLeft: 10,
    elapsedTime: 0,
    firstMove: true,
    movesEnabled: true,
    isPaused: false,
  });
  const [gameConfig, setGameConfig] = useState<GameConfig>(defaultGameConfig);

  /**
   * @description
   * Fetches the game from storage.
   * @returns true if the game is valid, false otherwise
   */
  async function fetchGame(): Promise<boolean> {
    return Promise.all([
      storage.get<GameConfig>("gameConfig"), 
      storage.get<GameState>("gameState"),
    ]).then((values) => {
      const [gameConfig, gameState] = values;
      
      if (!gameConfig || gameConfig.boardSize[0] < 1 || gameConfig.boardSize[1] < 1) {
        return false;
      }
      if (!gameState) {
        return false;
      }
      if (!gameState.tileStates || !isValidTileSet(gameState.tileStates, gameConfig.boardSize)) {
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

  /**
   * @description
   * Loads the current game from storage.
   * @returns void
   */
  const loadGame = async () => {
    await fetchGame().then((valid) => {
      if (!valid) {
        newGame(defaultGameConfig);
      }
    });
  }

  useEffect(() => {
    loadGame();
  }, []);

  /**
   * @description
   * Restarts the current game with the same config.
   * @returns void
   */
  // NOT COMPLETE: the new game will not be the same because the tiles are generated randomly.
  //   Cannot restart exact same game until initial tiles are being saved.
  const restartGame = () => {
    const newConfig = {
      ...gameConfig, 
      initialTileStates: gameState.previousTileStates[0] ?? [],
      randRemainingTiles: false,
    };
    newGame(newConfig);
  }

  /**
   * @description
   * Starts a new game with the given config.
   * @param config - The config for the new game
   * @returns void
   */
  const newGame = (config: GameConfig): boolean => {
    if (!isValidConfig(config)) {
      return false;
    }

    setGameConfig(config);
    try {
      storage.set<GameConfig>("gameConfig", config);
    } catch (error) {
      if (isStorageQuotaError(error)) {
        console.error("Storage quota exceeded while storing game config.");
      } else {
        console.error("Error storing game config:", error);
      }
    }

    const tiles = generateBoard(config);
    setGameState({
      status: "ongoing",
      tileStates: tiles,
      previousTileStates: [tiles],
      resourcesLeft: config.resourceLimit,
      elapsedTime: 0,
      firstMove: true,
      movesEnabled: true,
      isPaused: false,
    })
    return true;
  }

  useEffect(() => {
    if (gameState.status !== "ongoing" || gameState.isPaused) {
      return;
    }
    const interval = setInterval(() => {
      setGameState(prev => ({...prev, elapsedTime: prev.elapsedTime + 1}));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.status, gameState.isPaused]);

  useEffect(() => {
    try {
      storage.set<GameState>("gameState", gameState);
    } catch (error) {
      if (isStorageQuotaError(error)) {
        console.error("Storage quota exceeded while storing game state.");
        // keep the first move, and the last 10 moves
        if (gameState.previousTileStates.length > 10) {
          gameState.previousTileStates = [...gameState.previousTileStates.slice(0,1), ...gameState.previousTileStates.slice(-10)];
        }
      } else {
        console.error("Error storing game state:", error);
      }
    }
  }, [gameState]);

  /**
   * @description
   * Runs the end game sequence. This is the helper function that will be called when the game is over. It will animate the game state and then update the game state to the target status.
   * @param targetStatus - The target status of the game (i.e. playerWon or enemyWon)
   * @param currentState - The current game state
   * @returns void
   */
  const runEndGame = async (targetStatus: GameState["status"], currentState: GameState) => {
    setGameState({...currentState, movesEnabled: false, status: "animating"});
    await endGame(currentState.tileStates, gameConfig.boardSize, targetStatus, (updatedStates) => {
      setGameState((prevState) => ({...prevState, tileStates: updatedStates}));
    }).then((finalStates) => {
      setGameState((prevState) => ({...prevState, status: targetStatus, tileStates: finalStates}));
    });
  }

  /**
   * @description
   * Selects a tile. This is the main function that the player uses to play the game. It will advance the game state based on the tile selected.
   * @param state - The tile state selected by the player
   * @returns void
   */
  const selectTile = (state: TileState) => {
    let newState = {...gameState};

    if (newState.firstMove) {
      state.type = "territory";
      newState.firstMove = false;
    }
    else {
      newState.previousTileStates.push([...newState.tileStates]);  // don't save the initial tiles states, already saved
    }

    let moveCost = 1;
    let growTerritory = true;
    state.isHidden = false;
    const adjacentTiles = getAdjacentTiles(state.x, state.y, gameConfig.boardSize, newState.tileStates);
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
      let nextStates = progressTerritoryGrowth(newState.tileStates);
      nextStates = advanceEnemyTiles(nextStates, gameConfig.boardSize, [state]);

      newState.tileStates = [...nextStates];
    }

    const nextNum = Math.max(0, Math.min(gameConfig.resourceLimit, gameState.resourcesLeft - moveCost)); // clamp the moves left between 0 and the move limit
    newState.resourcesLeft = nextNum;

    setGameState(newState);

    const gameOverState = isGameOver(nextNum, newState.tileStates);
    if (gameOverState !== "ongoing") {
      runEndGame(gameOverState, newState);
    }
  }

  /**
   * @description
   * Pauses the game.
   * @returns void
   */
  const pauseGame = () => {
    setGameState(prev => ({...prev, movesEnabled: false, isPaused: true}));
  }

  /**
   * @description
   * Resumes the game if it is ongoing. This call is safe, meaning it will do nothing if the game shouldn't be resumed (i.e. the game is over).
   * @returns void
   */
  const resumeGame = () => {
    if (gameState.status === "ongoing") {
      setGameState(prev => ({...prev, movesEnabled: true, isPaused: false}));
    }
  }

  return (
    <GameplayContext.Provider 
      value={{ gameState, gameConfig, loadGame, restartGame, newGame, selectTile, pauseGame, resumeGame }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}