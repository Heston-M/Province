import { GameplayProvider } from "@/contexts/GameplayContext";
import MenuContextProvider from "@/contexts/MenuContext";
import ThemeContextProvider from "@/contexts/ThemeContext";
import UserContextProvider from "@/contexts/UserContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Comfortaa": require("../assets/fonts/Comfortaa-Regular.ttf"),
    "Comfortaa-Light": require("../assets/fonts/Comfortaa-Light.ttf"),
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
    "Comfortaa-SemiBold": require("../assets/fonts/Comfortaa-SemiBold.ttf"),
    "Comfortaa-Bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
