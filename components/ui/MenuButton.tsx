import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface MenuButtonProps {
  text: string;
  onPress: () => void;
}

export default function MenuButton({ text, onPress }: MenuButtonProps) {
  const backgroundColor = useThemeColor("secondary");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const [isHover, setIsHover] = useState(false);

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: backgroundColor + (isHover ? "40" : ""), borderColor: borderColor }]} 
      onPress={onPress}
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