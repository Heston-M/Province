import { TileState } from "@/types/tileState";
import { isValidTileSet } from "@/utils/boardChecker";
import { getAdjacentTiles } from "@/utils/gridUtils";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  boardSize: number;
  movesLeft: number;
  tileStates: TileState[];
  firstMove: boolean;
  loadGame: () => void;
  newGame: (boardSize: number) => void;
  selectTile: (state: TileState) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boardSize, setBoardSize] = useState<number>(8);
  const [movesLeft, setMovesLeft] = useState<number>(10);
  const [tileStates, setTileStates] = useState<TileState[]>([]);
  const [firstMove, setFirstMove] = useState<boolean>(true);

  async function fetchGame(): Promise<boolean> {
    return Promise.all([
      storage.get<number>("boardSize"), 
      storage.get<number>("movesLeft"), 
      storage.get<TileState[]>("tileStates"),
      storage.get<boolean>("firstMove")
    ]).then((values) => {
      const [boardSize, movesLeft, tileStates, firstMove] = values;
      
      if (!boardSize || boardSize < 1) {
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
        setBoardSize(boardSize);
        setMovesLeft(movesLeft);
        setTileStates(tileStates);
        setFirstMove(firstMove);
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
        newGame(8);
      }
    });
  }

  useEffect(() => {
    loadGame();
  }, []);

  const newGame = (boardSize: number) => {
    setBoardSize(boardSize);
    storage.set<number>("boardSize", boardSize);

    setMovesLeft(10);
    storage.set<number>("movesLeft", 10);

    const tiles: TileState[] = [];
    for (let y = 1; y <= boardSize; y++) {
      for (let x = 1; x <= boardSize; x++) {
        const randNum = Math.random();
        let type = "territory";
        if (randNum < 0.8) {
          type = "territory";
        } else if (randNum < 0.9) {
          type = "enemy";
        } else {
          type = "ally";
        }
        tiles.push({ x, y, 
          growingLevel: 0, 
          type: type as "territory" | "enemy" | "ally", 
          isHidden: false, 
          isCaptured: false });
      }
    }
    setTileStates(tiles);
    storage.set<TileState[]>("tileStates", tiles);
    setFirstMove(true);
    storage.set<boolean>("firstMove", true);
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
    const adjacentTiles = getAdjacentTiles(state.x, state.y, boardSize, tileStates);
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
      if (adjacentTiles.some((tile) => tile.type === "ally")) {
        moveCost = 1;
      } else {
        moveCost = 2;
      }
    }
    if (state.type === "ally") {
      state.isCaptured = true;
      moveCost = 0;
    }

    // reveal adjacent tiles
    for (const tile of adjacentTiles) {
      tile.isHidden = false;
    }

    // grow territory
    if (growTerritory) {
      for (const tile of tileStates) {
        if (tile.type === "territory" && tile.isCaptured && tile.growingLevel <= 6) {
          tile.growingLevel++;
        }
        if (tile.growingLevel > 6) {
          tile.type = "ally";
          tile.growingLevel = 0;
        }
      }

      // advance enemy tiles
      const capturableTiles: TileState[] = [];
      for (const tile of tileStates) {
        if (tile.type === "enemy") {
          capturableTiles.push(...getAdjacentTiles(tile.x, tile.y, boardSize, tileStates).filter((t) => t.type === "territory" && !capturableTiles.includes(t)));
        }
      }
      if (capturableTiles.length > 0) {
        const multiplier = movesLeft / 10;
        const MaxNumToCapture = Math.floor(capturableTiles.length * multiplier);
        const numToCapture = Math.max(capturableTiles.length, Math.floor(Math.random() * MaxNumToCapture));
        for (let i = 0; i < 1; i++) {
          const tileToTakeOver = capturableTiles[Math.floor(Math.random() * capturableTiles.length)];
          tileToTakeOver.type = "enemy";
          tileToTakeOver.growingLevel = 0;
          tileToTakeOver.isCaptured = false;
        }
      }
    }

    setTileStates([...tileStates]);
    storage.set<TileState[]>("tileStates", tileStates);

    const nextNum = movesLeft - moveCost;
    setMovesLeft(nextNum);
    storage.set<number>("movesLeft", nextNum);
  }

  return (
    <GameplayContext.Provider 
      value={{ boardSize, movesLeft, tileStates, firstMove, loadGame, newGame, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}