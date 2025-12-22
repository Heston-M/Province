import GameSelector from "@/components/GameSelector";
import MenuButton from "@/components/ui/MenuButton";
import { getRandomGame } from "@/constants/levels/randomGames";
import { useThemeContext } from "@/contexts/ThemeContext";
import { GameConfig } from "@/types/gameConfig";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomGameMenuProps {
  onBack: () => void;
  onGotoCustomGameCreation: () => void;
  onGameStarted: (game: GameConfig) => void;
}
export default function CustomGameMenu({ onBack, onGotoCustomGameCreation, onGameStarted }: CustomGameMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const randomGames = Array.from({ length: 10 }, () => getRandomGame());
  const [selectedGame, setSelectedGame] = useState<GameConfig | undefined>(undefined);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable onPress={onBack} style={styles.backIconContainer}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Custom Game</Text>
      <View style={styles.row}>
        <MenuButton text="New Custom Game" onPress={onGotoCustomGameCreation} />
        <MenuButton text="Start Game" highlight={selectedGame !== undefined} disabled={selectedGame === undefined} onPress={() => onGameStarted(selectedGame!)} />
      </View>
      <View style={[styles.gameSelectorContainer, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <GameSelector 
          games={randomGames} 
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
    height: "50%",
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
});