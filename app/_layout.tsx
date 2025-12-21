import { GameplayProvider } from "@/contexts/GameplayContext";
import MenuContextProvider from "@/contexts/MenuContext";
import ThemeContextProvider from "@/contexts/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <GameplayProvider>
        <MenuContextProvider>
          <Stack 
          screenOptions={{
            headerShown: true,
            headerTitleStyle: {
              color: useThemeColor("text"),
            },
            headerStyle: {
              backgroundColor: useThemeColor("secondary"),
            },
          }}
          >
            <Stack.Screen name="index" options={{ title: "Province" }} />
          </Stack>
        </MenuContextProvider>
      </GameplayProvider>
    </ThemeContextProvider>
  );
}
