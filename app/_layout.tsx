import { GameplayProvider } from "@/contexts/GameplayContext";
import MenuContextProvider from "@/contexts/MenuContext";
import ThemeContextProvider from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <GameplayProvider>
          <MenuContextProvider>
            <Stack 
            screenOptions={{
              headerShown: false,
            }}
            >
              <Stack.Screen name="index" options={{ title: "Province" }} />
            </Stack>
          </MenuContextProvider>
        </GameplayProvider>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
}
