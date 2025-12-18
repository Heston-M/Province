import Tile from "@/components/ui/Tile";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import GameOverModal from "./ui/GameOverModal";

const gridSize = 8;

interface GameBoardProps {
  size: number;
}

export default function GameBoard({ size }: GameBoardProps) {
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");
  const tileSize = (size - 2) / gridSize;

  const { movesLeft, tileStates, gameState, selectTile } = useGameplay();

  return (
    <View style={{ position: "relative" }}>
      <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Moves left: {movesLeft}</Text>
      <View style={[styles.gameBoard, { width: size, height: size, borderColor: borderColor }]}>
        <GameOverModal visible={gameState !== "ongoing"} size={size} />
        <View style={styles.gameBoardInner}>{tileStates.map((tile) => (
          <Tile key={`${tile.x}-${tile.y}`} state={tile} size={tileSize} onSelect={selectTile} />
        ))}</View>
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