import Tile from "@/components/ui/Tile";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { getBoardSize } from "@/utils/gridUtils";
import { StyleSheet, View } from "react-native";

interface GameBoardProps {
  maxHeight: number;
  maxWidth: number;
}

/**
 * @description
 * Renders the game board
 * @param maxHeight - The maximum height of the board
 * @param maxWidth - The maximum width of the board
 * @returns The game board
 */
export default function GameBoard({ maxHeight, maxWidth }: GameBoardProps) {
  const { getThemeColor } = useThemeContext();
  const borderColor = getThemeColor("border");

  const { gameState, gameConfig, selectTile } = useGameplay();

  const [boardWidth, boardHeight, tileSize] = 
    getBoardSize(maxHeight, maxWidth, gameConfig.boardSize);

  return (
    <View style={[styles.gameBoard, { borderColor: borderColor }]}>
      <View style={[styles.gameBoardInner, { width: boardWidth, height: boardHeight }]}>
        {gameState.tileStates.map((tile) => (
          <Tile key={`${tile.x}-${tile.y}`} state={tile} size={tileSize} onSelect={selectTile} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameBoard: {
    position: "relative",
    borderWidth: 1,
  },
  gameBoardInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
});