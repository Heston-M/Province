import { TileState } from "@/types/tileState";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  movesLeft: number;
  tileStates: TileState[];
  loadGame: () => void;
  newGame: (boardSize: number) => void;
  selectTile: (state: TileState) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movesLeft, setMovesLeft] = useState<number>(10);
  const [tileStates, setTileStates] = useState<TileState[]>([]);

  const loadGame = () => {
    storage.get<TileState[]>("tileStates").then((value) => {
      setTileStates(value || []);
    });
  }

  const newGame = (boardSize: number) => {
    setMovesLeft(10);
    storage.set<number>("movesLeft", 10);
    const tiles: TileState[] = [];
    for (let y = 1; y <= boardSize; y++) {
      for (let x = 1; x <= boardSize; x++) {
        tiles.push({ x, y, type: "blank", isHidden: true });
      }
    }
    setTileStates(tiles);
    storage.set<TileState[]>("tileStates", tiles);
  }

  const selectTile = (state: TileState) => {
    setMovesLeft(movesLeft - 1);
    storage.set<number>("movesLeft", movesLeft)
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
      value={{ movesLeft, tileStates, loadGame, newGame, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}