import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface MenuButtonProps {
  text: string;
  highlight?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * @description
 * Renders a menu button
 * @param text - The text to display on the button
 * @param onPress - Callback function to be called when the button is pressed
 * @returns The menu button component
 */
export default function MenuButton({ text, highlight, disabled, onPress }: MenuButtonProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("secondary");
  const accentColor = getThemeColor("accent");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  const [isHover, setIsHover] = useState(false);

  return (
    <Pressable 
      style={[
        styles.button, { 
          backgroundColor: backgroundColor + (isHover ? "40" : ""), 
          borderColor: highlight ? accentColor : borderColor,
          opacity: disabled ? 0.5 : 1
        }]} 
      onPress={disabled ? undefined : onPress}
      onHoverIn={() => setIsHover(true)}
      onHoverOut={() => setIsHover(false)}
      onPressIn={() => setIsHover(true)}
      onPressOut={() => setIsHover(false)}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});