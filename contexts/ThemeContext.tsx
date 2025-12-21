import { colors, tileColors } from "@/constants/colors";
import { ThemeColor, colorFields, tileFields } from "@/hooks/useThemeColor";
import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { ImageSourcePropType, useColorScheme } from "react-native";

type ContextShape = {
  theme: "light" | "dark";
  preference: "light" | "dark" | "system";
  setPreference: (theme: "light" | "dark" | "system") => void;
  getThemeColor: (color: ThemeColor["field"]) => string;
  getIconSource: (icon: "menuBar" | "closeIcon" | "backIcon") => ImageSourcePropType;
}

const ThemeContext = createContext<ContextShape | undefined>(undefined);

export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [preference, setPreference] = useState<"light" | "dark" | "system">("system");

  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";

  useEffect(() => {
    if (preference === "system") {
      setTheme(systemTheme);
    } else {
      setTheme(preference);
    }
    storage.set<"light" | "dark" | "system">("themePreference", preference);
  }, [preference]);

  useEffect(() => {
    storage.get<"light" | "dark" | "system">("themePreference").then((value) => {
      if (value) {
        setPreference(value);
      } else {
        setPreference("system");
      }
    });
  }, []);

  const getThemeColor = (color: ThemeColor["field"]) => {
    let colorValue = "";
    
    if (colorFields.includes(color as (typeof colorFields)[number])) {
      colorValue = colors[theme][color as (typeof colorFields)[number]];
    } else if (tileFields.includes(color as (typeof tileFields)[number])) {
      colorValue = tileColors[theme][color as (typeof tileFields)[number]];
    } else {
      throw new Error(`Invalid field: ${color}`);
    }
    return colorValue;
  }

  const getIconSource = (icon: "menuBar" | "closeIcon" | "backIcon") => {
    switch (icon) {
      case "menuBar":
        if (theme === "light") {
          return require("@/assets/icons/menuBarBlack.jpg");
        } else {
          return require("@/assets/icons/menuBarWhite.jpg");
        }
      case "closeIcon":
        if (theme === "light") {
          return require("@/assets/icons/closeIconBlack.jpg");
        } else {
          return require("@/assets/icons/closeIconWhite.jpg");
        }
      case "backIcon":
        if (theme === "light") {
          return require("@/assets/icons/backArrowBlack.jpg");
        } else {
          return require("@/assets/icons/backArrowWhite.jpg");
        }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, getThemeColor, getIconSource }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext must be used within a ThemeContextProvider");
  return context;
}