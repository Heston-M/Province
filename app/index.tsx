import GameBoard from "@/components/GameBoard";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatTime } from "@/utils/timeUtils";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const gameBoardContainerSize = Math.min(screenHeight * 0.8, screenWidth * 0.8);

  const { movesLeft, elapsedTime } = useGameplay();
  const formattedTime = formatTime(elapsedTime);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <Text style={[styles.stat, { color: textColor }]}>{formattedTime}</Text>
      <Text style={[styles.stat, { color: textColor }]}>Moves left: {movesLeft}</Text>
      <View style={[{ width: gameBoardContainerSize, height: gameBoardContainerSize }]}>
        <GameBoard size={gameBoardContainerSize} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});