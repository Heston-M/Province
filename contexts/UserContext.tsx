import { GameConfig } from "@/types/gameConfig";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  customGames: GameConfig[];
  addCustomGame: (game: GameConfig) => void;
  removeCustomGame: (game: GameConfig) => void;
}

const UserContext = createContext<ContextShape | undefined>(undefined);

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [customGames, setCustomGames] = useState<GameConfig[]>([]);
  const [vacantIds, setVacantIds] = useState<number[]>([]);
  const startId = 1000;

  function updateVacantIds(games: GameConfig[]) {
    const newMaxID = Math.max(...games.map((g) => g.id)) + 1 || startId;
    const newVacantIds = [];
    for (let i = startId; i <= newMaxID; i++) {
      if (!games.some((g) => g.id === i)) {
        newVacantIds.push(i);
      }
    }
    setVacantIds(newVacantIds);
  }

  useEffect(() => {
    storage.get<GameConfig[]>("customGames").then((games) => {
      if (games) {
        setCustomGames(games);
      }
      updateVacantIds(games ?? []);
    });
  }, []);

  useEffect(() => {
    if (customGames.length === 0) {
      return;
    }
    try {
      storage.set<GameConfig[]>("customGames", customGames);
    } catch (error) {
      console.error("Error storing custom games:", error);
    }
  }, [customGames]);

  const addCustomGame = (game: GameConfig) => {
    const newId = vacantIds.shift() ?? startId;
    setCustomGames(prev => {
      const newGames = [...prev, {...game, id: newId}];
      updateVacantIds(newGames);
      return newGames;
    });
  }
  const removeCustomGame = (game: GameConfig) => {
    setCustomGames(prev => {
      const newGames = prev.filter((g) => g.id !== game.id);
      updateVacantIds(newGames);
      return newGames;
    });
  }

  return (
    <UserContext.Provider value={{ customGames, addCustomGame, removeCustomGame }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserContextProvider");
  return context;
}