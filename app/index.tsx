import GameBoard from "@/components/GameBoard";
import { Dimensions, Text, View } from "react-native";

export default function Index() {

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const gameBoardContainerSize = Math.min(screenHeight * 0.8, screenWidth * 0.8);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <View style={[{ width: gameBoardContainerSize, height: gameBoardContainerSize }]}>
        <GameBoard size={gameBoardContainerSize} />
      </View>
    </View>
  );
}