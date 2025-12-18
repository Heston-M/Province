import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet, Text } from "react-native";

export default function NewGameButton() {
  const backgroundColor = useThemeColor("secondary");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const { newGame } = useGameplay();

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: backgroundColor, borderColor: borderColor }]} 
      onPress={() => {
        newGame({ 
          boardSize: 8, 
          moveLimit: 10,
        });
      }}>
      <Text style={[styles.text, { color: textColor }]}>New Game</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});