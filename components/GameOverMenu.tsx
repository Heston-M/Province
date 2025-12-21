import { useGameplay } from "@/contexts/GameplayContext";
import { useRandomQuote } from "@/hooks/useRandomQuote";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import MenuButton from "./ui/MenuButton";

interface GameOverModalProps {
  onClose: () => void;
  onOpenMenu: (type: "main") => void;
}

/**
 * @description
 * Renders the game over menu
 * @returns The game over menu
 */
export default function GameOverModal({ onClose, onOpenMenu }: GameOverModalProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");
  const isDark = useColorScheme() === "dark";

  const { gameState, newGame, restartGame } = useGameplay();

  const winMessage = useRandomQuote("win");
  const loseMessage = useRandomQuote("lose");

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable style={styles.closeIconContainer} onPress={onClose}>
        <Image source={isDark ? require("@/assets/icons/closeIconWhite.jpg") : require("@/assets/icons/closeIconBlack.jpg")} style={styles.closeIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>
        {gameState.status === "playerWon" ? "You Won!" : "You lost..."}
      </Text>
      <Text style={[styles.message, { color: textColor }]}>
        {gameState.status === "playerWon" ? winMessage : loseMessage}
      </Text>
      <MenuButton 
        text={gameState.status === "playerWon" ? "New Game" : "Try Again"} 
        onPress={() => {
        if (gameState.status === "playerWon") {
          newGame({
            name: "Random Game",
            description: "",
            boardSize: [8, 8],
            moveLimit: 10,
            timeLimit: -1,
            fogOfWar: false,
            enemyAggression: 0.8,
            initialTileStates: [],
            randRemainingTiles: true,
            randProbabilities: {
              territory: 0.9,
              fortified: 0.05,
              enemy: 0.05,
            },
          });
        } else {
          restartGame();
        }
        onClose();
      }} />
      <MenuButton 
        text="Main Menu" 
        onPress={() => {
          onOpenMenu("main");
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
    gap: 10,
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 20,
    height: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});