import { useGameplay } from "@/contexts/GameplayContext";
import { useMenuContext } from "@/contexts/MenuContext";
import { useRandomQuote } from "@/hooks/useRandomQuote";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import MenuButton from "./ui/MenuButton";

export default function GameOverModal() {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const { gameState, newGame, restartGame } = useGameplay();
  const { hardCloseMenu } = useMenuContext();

  const winMessage = useRandomQuote("win");
  const loseMessage = useRandomQuote("lose");

  const buttonText = gameState.status === "playerWon" ? "New Game" : "Try Again";

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        {gameState.status === "playerWon" ? "You Won!" : "You lost..."}
      </Text>
      <Text style={[styles.message, { color: textColor }]}>
        {gameState.status === "playerWon" ? winMessage : loseMessage}
      </Text>
      <MenuButton text={buttonText} onPress={() => {
        if (gameState.status === "playerWon") {
          newGame({
            boardSize: [10, 8],
            moveLimit: 10,
          });
        } else {
          restartGame();
        }
        hardCloseMenu();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    minHeight: 200,
    minWidth: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 1001,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});