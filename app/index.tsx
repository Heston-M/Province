import GameBoard from "@/components/GameBoard";
import BasicModal from "@/components/ui/BasicModal";
import { useGameplay } from "@/contexts/GameplayContext";
import { useMenuContext } from "@/contexts/MenuContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { formatTime } from "@/utils/timeUtils";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const menuIcon = getIconSource("menuBar");

  const { width, height } = useSafeAreaFrame();
  const { top, left, right, bottom } = useSafeAreaInsets();

  const { gameState } = useGameplay();
  const formattedTime = formatTime(gameState.elapsedTime);

  const { menuVisible, menuContent, menuEscapeAllowed, openMenu } = useMenuContext();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
        paddingBottom: bottom,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Pressable 
        onPress={() => openMenu("main")} 
        style={[styles.menuIconContainer, { backgroundColor: backgroundColor, top: top + 20, left: left + 20 }]}>
        <Image source={menuIcon} style={styles.menuIcon} />
      </Pressable>
      <BasicModal visible={menuVisible} escapeAllowed={menuEscapeAllowed}>
        {menuContent}
      </BasicModal>
      <Text style={[styles.stat, { color: textColor }]}>{formattedTime}</Text>
      <Text style={[styles.stat, { color: textColor }]}>Resources left: {gameState.resourcesLeft}</Text>
      <GameBoard maxHeight={height * 0.8} maxWidth={width * 0.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  menuIconContainer: {
    position: "absolute",
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