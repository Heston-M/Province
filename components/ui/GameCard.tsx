import CustomText from "@/components/ui/CustomText";
import { useThemeContext } from "@/contexts/ThemeContext";
import { GameConfig } from "@/types/gameConfig";
import { formatTime } from "@/utils/timeUtils";
import { Pressable, StyleSheet } from "react-native";

interface GameCardProps {
  game: GameConfig;
  isSelected: boolean;
  onGamePressed: (game: GameConfig) => void;
}

export default function GameCard({ game, isSelected, onGamePressed }: GameCardProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const accentColor = getThemeColor("accent");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  const timeLimit = formatTime(game.timeLimit);

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: backgroundColor, borderColor: isSelected ? accentColor : borderColor }]}
      onPress={() => onGamePressed(game)}
    >
      <CustomText style={[styles.title, { color: textColor }]}>{game.name}</CustomText>
      {game.description ? <CustomText style={[styles.description, { color: textColor }]}>{game.description}</CustomText> : null}
      <CustomText style={[styles.gameStat, { color: textColor }]}>Board Size: {game.boardSize[0]}x{game.boardSize[1]}</CustomText>
      <CustomText style={[styles.gameStat, { color: textColor }]}>{game.fogOfWar ? "Fog of War" : "No Fog of War"} | {game.timeLimit === -1 ? "No Time Limit" : `Time Limit: ${timeLimit}`}</CustomText>
      <CustomText style={[styles.gameStat, { color: textColor }]}>Enemy Aggression: {game.enemyAggression * 10}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 2,
  },
  gameStat: {
    fontSize: 12,
    textAlign: "center",
  },
});