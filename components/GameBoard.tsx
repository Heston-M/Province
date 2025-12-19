import Tile from "@/components/ui/Tile";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import GameOverModal from "./ui/GameOverModal";

interface GameBoardProps {
  size: number;
}

export default function GameBoard({ size }: GameBoardProps) {
  const borderColor = useThemeColor("border");

  const { gameState, gameConfig, selectTile } = useGameplay();

  const tileSize = (size - 2) / gameConfig.boardSize;

  return (
    <View style={{ position: "relative" }}>
      <View style={[styles.gameBoard, { width: size, height: size, borderColor: borderColor }]}>
        <GameOverModal visible={gameState.status !== "ongoing" && gameState.status !== "animating"} size={size} />
        <View style={styles.gameBoardInner}>{gameState.tileStates.map((tile) => (
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