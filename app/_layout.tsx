import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
    screenOptions={{
      headerShown: true,
      headerTitleStyle: {
        color: useThemeColor("text"),
      },
      headerStyle: {
        backgroundColor: useThemeColor("default"),
      },
    }}
  >
    <Stack.Screen name="index" options={{ title: "Province" }} />
  </Stack>
  );
}
