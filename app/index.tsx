import GameBoard from "@/components/GameBoard";
import BasicModal from "@/components/ui/BasicModal";
import { useGameplay } from "@/contexts/GameplayContext";
import { useMenuContext } from "@/contexts/MenuContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { formatTime } from "@/utils/timeUtils";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const menuIcon = getIconSource("menuBar");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const { gameState } = useGameplay();
  const formattedTime = formatTime(gameState.elapsedTime);

  const { menuVisible, menuContent, openMenu } = useMenuContext();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Pressable onPress={() => openMenu("main")} style={[styles.menuIconContainer, { backgroundColor: backgroundColor }]}>
        <Image source={menuIcon} style={styles.menuIcon} />
      </Pressable>
      <BasicModal visible={menuVisible}>
        {menuContent}
      </BasicModal>
      <Text style={[styles.stat, { color: textColor }]}>{formattedTime}</Text>
      <Text style={[styles.stat, { color: textColor }]}>Moves left: {gameState.movesLeft}</Text>
      <GameBoard maxHeight={screenHeight * 0.8} maxWidth={screenWidth * 0.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  menuIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
  },
  menuIcon: {
    width: 40,
    height: 40,
  },
  stat: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});