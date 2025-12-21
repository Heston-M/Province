import MenuButton from "@/components/ui/MenuButton";
import { randomGame1 } from "@/constants/levels/randomGames";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useRandomQuote } from "@/hooks/useRandomQuote";
import { MenuType } from "@/types/menuType";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameOverModalProps {
  onClose: () => void;
  onOpenMenu: (type: MenuType) => void;
}

/**
 * @description
 * Renders the game over menu
 * @returns The game over menu
 */
export default function GameOverModal({ onClose, onOpenMenu }: GameOverModalProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const closeIcon = getIconSource("closeIcon");

  const { gameState, newGame, restartGame } = useGameplay();

  const winMessage = useRandomQuote("win");
  const loseMessage = useRandomQuote("lose");

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable style={styles.closeIconContainer} onPress={onClose}>
        <Image source={closeIcon} style={styles.closeIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>
        {gameState.status === "playerWon" ? "You Won" : "You lost..."}
      </Text>
      <Text style={[styles.message, { color: textColor }]}>
        {gameState.status === "playerWon" ? winMessage : loseMessage}
      </Text>
      <MenuButton 
        text={gameState.status === "playerWon" ? "New Game" : "Try Again"} 
        onPress={() => {
        if (gameState.status === "playerWon") {
          newGame(randomGame1);
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
    width: 30,
    height: 30,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});