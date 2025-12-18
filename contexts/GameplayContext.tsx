import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  movesLeft: number;
  selectTile: (x: number, y: number) => void;
}

const GameplayContext = createContext<ContextShape | undefined>(undefined);

export const GameplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movesLeft, setMovesLeft] = useState<number>(10);

  const selectTile = (x: number, y: number) => {
    setMovesLeft(movesLeft - 1);
    storage.set<number>("movesLeft", movesLeft);
  }

  useEffect(() => {
    storage.get<number>("movesLeft").then((value) => {
      setMovesLeft(value || 10);
    });
  }, []);

  return (
    <GameplayContext.Provider 
      value={{ movesLeft, selectTile }}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (!context) throw new Error("useGameplay must be used within a GameplayProvider");
  return context;
}