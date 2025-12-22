import GameSelector from "@/components/GameSelector";
import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { GameConfig } from "@/types/gameConfig";
import { MenuType } from "@/types/menuType";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomGameMenuProps {
  onBack: () => void;
  onOpenMenu: (type: MenuType) => void;
  onGameStarted: () => void;
}

export default function CustomGameMenu({ onBack, onOpenMenu, onGameStarted }: CustomGameMenuProps) {
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
        <MenuButton text="New Custom Game" onPress={() => onOpenMenu("customGameCreation")} />
        {customGames.length > 0 && <MenuButton 
          text="Start Game" 
          highlight={selectedGame !== undefined} 
          disabled={selectedGame === undefined} 
          onPress={startGame} 
        />}
      </View>
      {customGames.length > 0 && <View style={[styles.gameSelectorContainer, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <GameSelector 
          games={customGames} 
          selectedGame={selectedGame} 
          onGameSelected={(game) => selectedGame === game ? setSelectedGame(undefined) : setSelectedGame(game)} 
        />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 220,
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
    marginLeft: 20,
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