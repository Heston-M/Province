import GameOverModal from "@/components/GameOverMenu";
import MainMenu from "@/components/MainMenu";
import { useGameplay } from "@/contexts/GameplayContext";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  menuVisible: boolean;
  menuContent: React.ReactNode;
  openMenu: (type: "main" | "levelSelect" | "rules" | "settings" | "gameOver") => void;
  goBackMenu: () => void;
  hardCloseMenu: () => void;
}

const MenuContext = createContext<ContextShape | undefined>(undefined);

export default function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuContent, setMenuContent] = useState<React.ReactNode>(null);
  const [menuType, setMenuType] = useState<"main" | "levelSelect" | "rules" | "settings" | "gameOver" | undefined>("main");

  const mainMenu = () => { return ( <MainMenu /> ) }
  const gameOverMenu = () => { return ( <GameOverModal /> ) }

  const { gameState, pauseGame, resumeGame } = useGameplay();

  useEffect(() => {
    if (gameState.status !== "ongoing" && gameState.status !== "animating") {
      openMenu("gameOver");
    }
  }, [gameState.status]);

  const openMenu = (type: "main" | "levelSelect" | "rules" | "settings" | "gameOver") => {
    pauseGame();
    setMenuVisible(true);
    setMenuType(type);
    switch (type) {
      case "main":
        setMenuContent(mainMenu());
        break;
      case "gameOver":
        setMenuContent(gameOverMenu());
        break;
      default:
        setMenuContent(null);
        break;
    }
  }
  const goBackMenu = () => {
    switch (menuType) {
      case "main":
        resumeGame();
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
      case "gameOver":
        break;
      default:
        resumeGame();
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
    }
  }
  const hardCloseMenu = () => {
    resumeGame();
    setMenuContent(null);
    setMenuVisible(false);
    setMenuType(undefined);
  }

  return (
    <MenuContext.Provider value={{ menuVisible, menuContent, openMenu, goBackMenu, hardCloseMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenuContext must be used within a MenuContextProvider");
  return context;
}