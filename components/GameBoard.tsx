import Tile from "@/components/ui/Tile";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";

const gridSize = 8;

interface GameBoardProps {
  size: number;
}

export default function GameBoard({ size }: GameBoardProps) {
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");
  const tileSize = (size - 2) / gridSize;

  const { movesLeft, selectTile } = useGameplay();

  const onSelect = (x: number, y: number) => {
    selectTile(x, y);
  }

  const tiles = [];
  for (let y = 1; y <= gridSize; y++) {
    for (let x = 1; x <= gridSize; x++) {
      tiles.push(
        <Tile key={`${x}-${y}`} type="blank" x={x} y={y} size={tileSize} onSelect={onSelect} />
      );
    }
  }

  return (
    <View>
      <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Moves left: {movesLeft}</Text>
      <View style={[styles.gameBoard, { width: size, height: size, borderColor: borderColor }]}>
        <View style={styles.gameBoardInner}>{tiles}</View>
      </View>
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