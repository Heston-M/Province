import GameBoard from "@/components/GameBoard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dimensions, View } from "react-native";

export default function Index() {
  const backgroundColor = useThemeColor("background");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const gameBoardContainerSize = Math.min(screenHeight * 0.8, screenWidth * 0.8);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <View style={[{ width: gameBoardContainerSize, height: gameBoardContainerSize }]}>
        <GameBoard size={gameBoardContainerSize} />
      </View>
    </View>
  );
}