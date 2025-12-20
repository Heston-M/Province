import MainMenu from "@/components/MainMenu";
import { createContext, useContext, useState } from "react";

type ContextShape = {
  menuVisible: boolean;
  menuContent: React.ReactNode;
  openMenu: (type: "main" | "levelSelect" | "rules" | "settings") => void;
  closeMenu: () => void;
}

const MenuContext = createContext<ContextShape | undefined>(undefined);

export default function MenuContextProvider({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuContent, setMenuContent] = useState<React.ReactNode>(null);
  const [menuType, setMenuType] = useState<"main" | "levelSelect" | "rules" | "settings" | undefined>("main");

  const mainMenu = () => { return ( <MainMenu onClose={closeMenu} /> ) }

  const openMenu = (type: "main" | "levelSelect" | "rules" | "settings") => {
    setMenuVisible(true);
    setMenuType(type);
    switch (type) {
      case "main":
        setMenuContent(mainMenu());
        break;
      default:
        setMenuContent(null);
        break;
    }
  }
  const closeMenu = () => {
    switch (menuType) {
      case "main":
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
      default:
        setMenuContent(null);
        setMenuVisible(false);
        setMenuType(undefined);
        break;
    }
  }

  return (
    <MenuContext.Provider value={{ menuVisible, menuContent, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenuContext must be used within a MenuContextProvider");
  return context;
}