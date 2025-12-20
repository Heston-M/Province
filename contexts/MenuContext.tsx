import GameOverModal from "@/components/GameOverMenu";
import MainMenu from "@/components/MainMenu";
import { createContext, useContext, useState } from "react";

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

  const openMenu = (type: "main" | "levelSelect" | "rules" | "settings" | "gameOver") => {
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
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
      case "gameOver":
        break;
      default:
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
    }
  }
  const hardCloseMenu = () => {
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