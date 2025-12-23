import MenuButton from "@/components/ui/MenuButton";
import Tile from "@/components/ui/Tile";
import { getRandomGame } from "@/constants/levels/randomGames";
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
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const borderColor = getThemeColor("border");

  const { gameState, gameConfig, newGame, selectTile } = useGameplay();
  const hasGame = gameState && gameState.tileStates.length > 0;
  const randomGame = getRandomGame();

  const [boardWidth, boardHeight, tileSize] = 
    getBoardSize(maxHeight, maxWidth, gameConfig.boardSize);

  return (
    <View style={[styles.gameBoard, { borderColor: borderColor }]}>
      {!hasGame && <View style={[styles.backupCover, { backgroundColor: secondaryColor }]} />}
      {!hasGame && <View style={styles.backupButtonContainer}>
        <MenuButton 
          text="New Game"
          fillColor={backgroundColor}
          onPress={() => newGame(randomGame)} 
        />
      </View>}
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
  backupCover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  backupButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    justifyContent: "center",
    alignItems: "center",
  },
  gameBoardInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
  },
});