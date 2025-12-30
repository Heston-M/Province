import CustomText from "@/components/ui/CustomText";
import MenuButton from "@/components/ui/MenuButton";
import { getRandomGame } from "@/constants/levels/randomGames";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { MenuType } from "@/types/menuType";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface MainMenuProps {
  onClose: () => void;
  onOpenMenu: (type: MenuType) => void;
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
      <CustomText style={[styles.title, { color: textColor }]}>Province</CustomText>
      <View style={styles.gridContainer}>
        <MenuButton text="Restart Game" onPress={() => {
          restartGame();
          onClose();
        }} />
        <MenuButton text="New Game" onPress={() => {
          newGame(getRandomGame());
          onClose();
        }} />
        <MenuButton text="Custom Game" onPress={() => {
          onOpenMenu("customGame");
        }} />
        <View style={styles.row}>
          <MenuButton text="Rules" onPress={() => {
            onOpenMenu("rules");
          }} />
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
    top: -5,
    left: -5,
    width: 30,
    height: 30,
  },
  closeIcon: {
    width: 30,
    height: 30,
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