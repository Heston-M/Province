import { useGameplay } from "@/contexts/GameplayContext";
import { useRandomQuote } from "@/hooks/useRandomQuote";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import NewGameButton from "./NewGameButton";

interface GameOverModalProps {
  visible: boolean;
  size: number;
}

export default function GameOverModal({ visible, size }: GameOverModalProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const { gameState } = useGameplay();

  const minWidth = 200;
  const minHeight = 200;

  const horizontalPadding = (size - minWidth) / 2;
  const verticalPadding = (size - minHeight) / 2;

  const winMessage = useRandomQuote("win");
  const loseMessage = useRandomQuote("lose");

  return (
    visible && (
    <View style={styles.modal}>
      <View style={[styles.modal, { backgroundColor: backgroundColor, opacity: 0.5 }]}></View>
      <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor,
        left: horizontalPadding,
        top: verticalPadding,
        right: horizontalPadding,
        bottom: verticalPadding,
       }]}>
        <Text style={[styles.title, { color: textColor }]}>
          {gameState.status === "playerWon" ? "You Won!" : "You lost..."}
        </Text>
        <Text style={[styles.message, { color: textColor }]}>
          {gameState.status === "playerWon" ? winMessage : loseMessage}
        </Text>
        <NewGameButton text="Play Again" />
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