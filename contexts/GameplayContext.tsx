import { TileState } from "@/types/tileState";
import { getAdjacentTiles } from "@/utils/gridUtils";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  boardSize: number;
  movesLeft: number;
  tileStates: TileState[];
  loadGame: () => void;
  newGame: (boardSize: number) => void;
  selectTile: (state: TileState) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boardSize, setBoardSize] = useState<number>(8);
  const [movesLeft, setMovesLeft] = useState<number>(10);
  const [tileStates, setTileStates] = useState<TileState[]>([]);

  const loadGame = () => {
    storage.get<TileState[]>("tileStates").then((value) => {
      setTileStates(value || []);
    });
    storage.get<number>("boardSize").then((value) => {
      setBoardSize(value || 8);
    });
  }

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
        tiles.push({ x, y, type: type as "territory" | "enemy" | "ally", isHidden: true, isCaptured: false });
      }
    }
    setTileStates(tiles);
    storage.set<TileState[]>("tileStates", tiles);
  }

  const selectTile = (state: TileState) => {
    let moveCost = 1;
    state.isHidden = false;

    // capture tile
    if (state.type === "territory") {
      state.isCaptured = true;
    }
    if (state.type === "enemy") {
      state.isCaptured = true;
      moveCost = 2;
    }
    if (state.type === "ally") {
      state.isCaptured = true;
      moveCost = 0;
    }

    // reveal adjacent tiles
    const adjacentTiles = getAdjacentTiles(state.x, state.y, boardSize);
    for (const tile of adjacentTiles) {
      const tileState = tileStates.find((t) => t.x === tile.x && t.y === tile.y);
      if (tileState) {
        tileState.isHidden = false;
      }
    }

    setTileStates([...tileStates]);
    storage.set<TileState[]>("tileStates", tileStates);

    const nextNum = movesLeft - moveCost;
    setMovesLeft(nextNum);
    storage.set<number>("movesLeft", nextNum);
  }

  useEffect(() => {
    storage.get<number>("movesLeft").then((value) => {
      setMovesLeft(value || 10);
    });
    storage.get<TileState[]>("tileStates").then((value) => {
      setTileStates(value || []);
    });
  }, []);

  return (
    <GameplayContext.Provider 
      value={{ boardSize, movesLeft, tileStates, loadGame, newGame, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}