import { GameplayProvider } from "@/contexts/GameplayContext";
import MenuContextProvider from "@/contexts/MenuContext";
import ThemeContextProvider from "@/contexts/ThemeContext";
import UserContextProvider from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeContextProvider>
        <UserContextProvider>
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
        </UserContextProvider>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
}
