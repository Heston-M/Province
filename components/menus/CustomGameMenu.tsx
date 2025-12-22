import GameSelector from "@/components/GameSelector";
import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { GameConfig } from "@/types/gameConfig";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomGameMenuProps {
  onBack: () => void;
  onCreateCustomGame: () => void;
  onGameStarted: () => void;
}
export default function CustomGameMenu({ onBack, onCreateCustomGame, onGameStarted }: CustomGameMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const [selectedGame, setSelectedGame] = useState<GameConfig | undefined>(undefined);

  const { newGame } = useGameplay();
  const { customGames } = useUser();

  const startGame = () => {
    newGame(selectedGame!);
    onGameStarted();
  }
  
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable onPress={onBack} style={styles.backIconContainer}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Custom Games</Text>
      <View style={styles.row}>
        <MenuButton text="New Custom Game" onPress={onCreateCustomGame} />
        <MenuButton 
          text="Start Game" 
          highlight={selectedGame !== undefined} 
          disabled={selectedGame === undefined} 
          onPress={startGame} 
        />
      </View>
      <View style={[styles.gameSelectorContainer, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <GameSelector 
          games={customGames} 
          selectedGame={selectedGame} 
          onGameSelected={(game) => selectedGame === game ? setSelectedGame(undefined) : setSelectedGame(game)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  gameSelectorContainer: {
    maxHeight: "70%",
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
});