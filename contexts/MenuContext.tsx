import CustomGameCreationMenu from "@/components/menus/CustomGameCreationMenu";
import CustomGameMenu from "@/components/menus/CustomGameMenu";
import GameOverModal from "@/components/menus/GameOverMenu";
import MainMenu from "@/components/menus/MainMenu";
import RulesMenu from "@/components/menus/RulesMenu";
import SettingsMenu from "@/components/menus/SettingsMenu";
import WelcomeScreen from "@/components/menus/WelcomeScreen";
import { useGameplay } from "@/contexts/GameplayContext";
import { GameConfig } from "@/types/gameConfig";
import { MenuType } from "@/types/menuType";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";

type ContextShape = {
  menuVisible: boolean;
  menuContent: React.ReactNode;
  menuEscapeAllowed: boolean;
  openMenu: (type: MenuType) => void;
  goBackMenu: () => void;
  hardCloseMenu: () => void;
}

const MenuContext = createContext<ContextShape | undefined>(undefined);

export default function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const [editGame, setEditGame] = useState<GameConfig | undefined>(undefined);

  const welcomeScreen = (delay: number = 0) => { return ( <WelcomeScreen 
    delay={delay}
    onStartGame={() => {
      hardCloseMenu();
      storeSeenWelcomeScreen();
    }} 
    onTutorial={() => {
      openMenu("rules");
      storeSeenWelcomeScreen();
    }} /> ) }

  const mainMenu = () => { return ( <MainMenu 
    onClose={() => {hardCloseMenu()}} 
    onOpenMenu={(type) => {openMenu(type as MenuType)}} /> ) }
  
  const gameOverMenu = () => { return ( <GameOverModal 
    onClose={() => {hardCloseMenu()}} 
    onOpenMenu={(type) => {openMenu(type as MenuType)}} /> ) }

  const customGameMenu = () => { return ( <CustomGameMenu 
    onBack={() => {goBackMenu()}}
    onOpenMenu={(type) => {openMenu(type as MenuType)}}
    onEditGame={(game) => {setEditGame(game)}}
    onGameStarted={() => {hardCloseMenu()}} /> ) }

  const customGameCreationMenu = () => { return ( <CustomGameCreationMenu 
    game={editGame}
    onBack={() => {setEditGame(undefined); openMenu("customGame")}}
    onGameStarted={() => {setEditGame(undefined); hardCloseMenu()}} /> ) }

  const settingsMenu = () => { return ( <SettingsMenu 
    onBack={() => {goBackMenu()}}
    onClearGameStorage={() => {clearGameStorage()}} /> ) }

  const rulesMenu = () => { return ( <RulesMenu 
    onClose={() => {goBackMenu()}} /> ) }

  const { gameState, pauseGame, resumeGame } = useGameplay();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuContent, setMenuContent] = useState<React.ReactNode>(welcomeScreen());
  const [menuType, setMenuType] = useState<MenuType | undefined>(undefined);
  const [menuEscapeAllowed, setMenuEscapeAllowed] = useState(true);

  useEffect(() => {
    if (editGame) {
      openMenu("customGameCreation");
      setEditGame(undefined);
    }
  }, [editGame]);

  useEffect(() => {
    if (gameState.status !== "ongoing" && gameState.status !== "animating") {
      openMenu("gameOver");
    }
  }, [gameState.status]);

  useEffect(() => {
    storage.get<boolean>("seenWelcomeScreen").then((seen) => {
      if (!seen) {
        openMenu("welcome");
      }
    });
  }, []);

  /**
   * @description
   * Opens the menu of the given type.
   * @param type - The type of menu to open
   * @returns void
   */
  const openMenu = (type: MenuType) => {
    pauseGame();
    setMenuVisible(true);
    setMenuType(type);
    if (type === "welcome") {
      setMenuEscapeAllowed(false);
    } else {
      setMenuEscapeAllowed(true);
    }
    switch (type) {
      case "welcome":
        setMenuContent(welcomeScreen());
        break;
      case "main":
        setMenuContent(mainMenu());
        break;
      case "customGame":
        setMenuContent(customGameMenu());
        break;
      case "customGameCreation":
        setMenuContent(customGameCreationMenu());
        break;
      case "rules":
        setMenuContent(rulesMenu());
        break;
      case "settings":
        setMenuContent(settingsMenu());
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
      case "welcome":
        openMenu("main");
        break;
      case "main":
        hardCloseMenu();
        break;
      case "customGame":
        openMenu("main");
        break;
      case "customGameCreation":
        openMenu("customGame");
        break;
      case "rules":
        openMenu("main");
        break;
      case "settings":
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

  const storeSeenWelcomeScreen = () => {
    try {
      storage.set<boolean>("seenWelcomeScreen", true);
    } catch (error) {
      console.error("Error storing seen welcome screen:", error);
    }
  }

  /**
   * @description
   * Clears the game storage and shows the welcome screen after a delay.
   * Note: This is a complete reset of the game, including everything in local storage.
   *       Only use this to reset the game to a fresh state.
   * @returns void
   */
  const clearGameStorage = () => {
    storage.clear().then(() => {
      console.log("Game storage cleared");
      setMenuType("welcome");
      setMenuContent(welcomeScreen(3000));
    }).catch((error) => {
      console.error("Error clearing game storage:", error);
    });
  }

  return (
    <MenuContext.Provider value={{ menuVisible, menuContent, menuEscapeAllowed, openMenu, goBackMenu, hardCloseMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenuContext must be used within a MenuContextProvider");
  return context;
}