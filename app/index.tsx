import GameBoard from "@/components/GameBoard";
import BasicModal from "@/components/ui/BasicModal";
import MenuIcon from "@/components/ui/MenuIcon";
import { useGameplay } from "@/contexts/GameplayContext";
import { useMenuContext } from "@/contexts/MenuContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatTime } from "@/utils/timeUtils";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const gameBoardContainerSize = Math.min(screenHeight * 0.8, screenWidth * 0.8);

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
      <View style={styles.menuIcon}>
        <MenuIcon onPress={() => openMenu("main")} />
      </View>
      <BasicModal visible={menuVisible}>
        {menuContent}
      </BasicModal>
      <Text style={[styles.stat, { color: textColor }]}>{formattedTime}</Text>
      <Text style={[styles.stat, { color: textColor }]}>Moves left: {gameState.movesLeft}</Text>
      <GameBoard size={gameBoardContainerSize} maxHeight={screenHeight * 0.8} maxWidth={screenWidth * 0.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  menuIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 0,
    bottom: 0,
  },
  stat: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});