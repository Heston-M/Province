import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, Pressable, useColorScheme } from "react-native";

interface MenuIconProps {
  onPress: () => void;
}

/**
 * @description
 * Renders the menu icon
 * @param onPress - Callback function to be called when the menu icon is pressed
 * @returns The menu icon component
 */
export default function MenuIcon({ onPress }: MenuIconProps) {
  const backgroundColor = useThemeColor("background");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable onPress={onPress} style={{ backgroundColor: backgroundColor }}>
      <Image source={isDark ? require("@/assets/icons/menuBarLight.jpg") : require("@/assets/icons/menuBarDark.jpg")} />
    </Pressable>
  );
}