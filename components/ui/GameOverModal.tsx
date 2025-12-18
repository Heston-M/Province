import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import NewGameButton from "./NewGameButton";

interface GameOverModalProps {
  visible: boolean;
}

export default function GameOverModal({ visible }: GameOverModalProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const { gameState } = useGameplay();

  return (
    visible && (
    <View style={styles.modal}>
      <View style={[styles.modal, { backgroundColor: backgroundColor, opacity: 0.5 }]}></View>
      <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Game Over</Text>
        <Text style={[styles.message, { color: textColor }]}>You {gameState === "playerWon" ? "won!" : gameState === "enemyWon" ? "lost" : "tied"}</Text>
        <NewGameButton />
      </View>
    </View>
  ));
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    position: "absolute",
    top: 100,
    left: 100,
    right: 100,
    bottom: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 1001,
    opacity: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
});