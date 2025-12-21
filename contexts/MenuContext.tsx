import CustomGameMenu from "@/components/CustomGameMenu";
import GameOverModal from "@/components/GameOverMenu";
import MainMenu from "@/components/MainMenu";
import { useGameplay } from "@/contexts/GameplayContext";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  menuVisible: boolean;
  menuContent: React.ReactNode;
  openMenu: (type: "main" | "levelSelect" | "rules" | "settings" | "gameOver" | "customGame") => void;
  goBackMenu: () => void;
  hardCloseMenu: () => void;
}

const MenuContext = createContext<ContextShape | undefined>(undefined);

export default function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuContent, setMenuContent] = useState<React.ReactNode>(null);
  const [menuType, setMenuType] = useState<"main" | "levelSelect" | "rules" | "settings" | "gameOver" | "customGame" | undefined>("main");

  const mainMenu = () => { return ( <MainMenu 
    onClose={() => {hardCloseMenu()}} 
    onOpenMenu={(type) => {openMenu(type as "main" | "levelSelect" | "rules" | "settings" | "gameOver" | "customGame")}} /> ) }
  
  const gameOverMenu = () => { return ( <GameOverModal 
    onClose={() => {hardCloseMenu()}} 
    onOpenMenu={(type) => {openMenu(type as "main" | "levelSelect" | "rules" | "settings" | "gameOver" | "customGame")}} /> ) }

  const customGameMenu = () => { return ( <CustomGameMenu 
    onBack={() => {goBackMenu()}}
    onGameStarted={() => {hardCloseMenu()}} /> ) }

  const { gameState, pauseGame, resumeGame } = useGameplay();

  useEffect(() => {
    if (gameState.status !== "ongoing" && gameState.status !== "animating") {
      openMenu("gameOver");
    }
  }, [gameState.status]);

  /**
   * @description
   * Opens the menu of the given type.
   * @param type - The type of menu to open
   * @returns void
   */
  const openMenu = (type: "main" | "levelSelect" | "rules" | "settings" | "gameOver" | "customGame") => {
    pauseGame();
    setMenuVisible(true);
    setMenuType(type);
    switch (type) {
      case "main":
        setMenuContent(mainMenu());
        break;
      case "customGame":
        setMenuContent(customGameMenu());
        break;
      case "gameOver":
        setMenuContent(gameOverMenu());
        break;
      default:
        setMenuContent(null);
        break;
    }
  }

  /**
   * @description
   * Handles when the user presses the back button in a menu.
   * @returns void
   */
  const goBackMenu = () => {
    switch (menuType) {
      case "main":
        hardCloseMenu();
        break;
      case "customGame":
        openMenu("main");
        break;
      case "gameOver":
        break;
      default:
        openMenu("main");
        break;
    }
  }

  /**
   * @description
   * Hard closes the menu, no matter the menu type.
   * @returns void
   */
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