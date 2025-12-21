import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface MainMenuProps {
  onClose: () => void;
  onOpenMenu: (type: string) => void;
}

/**
 * @description
 * Renders the main menu
 * @returns The main menu
 */
export default function MainMenu({ onClose, onOpenMenu }: MainMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const closeIcon = getIconSource("closeIcon");

  const { restartGame, newGame } = useGameplay();

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable onPress={onClose} style={styles.closeIconContainer}>
        <Image source={closeIcon} style={styles.closeIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Province</Text>
      <View style={styles.gridContainer}>
        <MenuButton text="Restart Game" onPress={() => {
          restartGame();
          onClose();
        }} />
        <MenuButton text="New Game" onPress={() => {
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
          onClose();
        }} />
        <MenuButton text="Custom Game" onPress={() => {
          onOpenMenu("customGame");
        }} />
        <View style={styles.row}>
          <MenuButton text="Rules" onPress={() => {}} />
          <MenuButton text="Settings" onPress={() => {
            onOpenMenu("settings");
          }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
    zIndex: 1001,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
  },
  gridContainer: {
    flexDirection: "column",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
});