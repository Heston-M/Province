import Tile from "@/components/ui/Tile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

const gridSize = 8;

interface GameBoardProps {
  size: number;
}

export default function GameBoard({ size }: GameBoardProps) {
  const borderColor = useThemeColor("border");
  const tileSize = (size - 2) / gridSize;

  const tiles = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push(
        <Tile key={`${x}-${y}`} type="blank" x={x} y={y} size={tileSize} />
      );
    }
  }

  return (
    <View style={[styles.gameBoard, { width: size, height: size, borderColor: borderColor }]}>
      <View style={styles.gameBoardInner}>{tiles}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameBoard: {
    borderWidth: 1,
  },
  gameBoardInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
});