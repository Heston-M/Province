import Tile from "@/components/ui/Tile";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getBoardSize } from "@/utils/gridUtils";
import { StyleSheet, View } from "react-native";
import GameOverModal from "./ui/GameOverModal";

interface GameBoardProps {
  size: number;
  maxHeight: number;
  maxWidth: number;
}

export default function GameBoard({ size, maxHeight, maxWidth }: GameBoardProps) {
  const borderColor = useThemeColor("border");

  const { gameState, gameConfig, selectTile } = useGameplay();

  const tileSize = (size - 2) / gameConfig.boardSize;

  const [boardWidth, boardHeight, tileSize2] = 
    gameConfig.boardSize2 ? getBoardSize(maxHeight, maxWidth, gameConfig.boardSize2) : getBoardSize(maxHeight, maxWidth, [gameConfig.boardSize, gameConfig.boardSize]);

  return (
    <View style={[styles.gameBoard, { position: "relative", borderColor: borderColor }]}>
      <View style={{ width: boardWidth ?? size, height: boardHeight ?? size }}>
        <GameOverModal visible={gameState.status !== "ongoing" && gameState.status !== "animating"} size={size} />
        <View style={styles.gameBoardInner}>{gameState.tileStates.map((tile) => (
          <Tile key={`${tile.x}-${tile.y}`} state={tile} size={tileSize2 ?? tileSize} onSelect={selectTile} />
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