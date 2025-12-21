import { storage } from "@/utils/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ContextShape = {
  theme: "light" | "dark";
  preference: "light" | "dark" | "system";
  setPreference: (theme: "light" | "dark" | "system") => void;
}

const UserContext = createContext<ContextShape | undefined>(undefined);

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <UserContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserContextProvider");
  return context;
}