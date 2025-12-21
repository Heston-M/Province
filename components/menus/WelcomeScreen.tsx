import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onTutorial: () => void;
}

export default function WelcomeScreen({ onStartGame, onTutorial }: WelcomeScreenProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  const { newGame } = useGameplay();

  const startGame = () => {
    newGame({
      name: "Random Game",
      description: "",
      boardSize: [8, 8],
      resourceLimit: 10,
      timeLimit: -1,
      fogOfWar: false,
      enemyAggression: 0.8,
      initialTileStates: [],
      randRemainingTiles: true,
      randProbabilities: {
        territory: 0.9,
        fortified: 0.05,
        enemy: 0.05,
      },
    });
    onStartGame();
  }

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Province</Text>
      <Text style={[styles.description, { color: textColor }]}>
        Welcome ambitious conqueror...</Text>
      <Text style={[styles.description, { color: textColor }]}>
        You don't seem like you're ready to rule the world yet.</Text>
      <Text style={[styles.description, { color: textColor }]}>
        Unfortunately, all competent options are... indisposed. So you'll have to do.</Text>
      <Text style={[styles.description, { color: textColor }]}>
        Now, do you know what to do? Or do I need to spell it out for you?</Text>
      <View style={styles.row}>
        <MenuButton text="Get to Work" onPress={startGame} />
        <MenuButton text="Tutorial" onPress={onTutorial} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
});