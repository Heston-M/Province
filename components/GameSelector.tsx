import FadingScrollView from "@/components/ui/FadingScrollView";
import GameCard from "@/components/ui/GameCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { GameConfig } from "@/types/gameConfig";
import { StyleSheet, Text, View } from "react-native";

interface GameSelectorProps {
  games: GameConfig[];
  selectedGame: GameConfig | undefined;
  onGameSelected: (game: GameConfig) => void;
}

export default function GameSelector({ games, selectedGame, onGameSelected }: GameSelectorProps) {
  const { getThemeColor } = useThemeContext();
  const secondaryColor = getThemeColor("secondary");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  return (
    <View style={styles.gameSelectorContainer}>
      <FadingScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        fadeColor={secondaryColor}
        fadeSize={30}
      >
        <View style={[styles.container, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Saved Custom Games</Text>
          {games.map((game, index) => (
            <View key={index} style={styles.gameCardContainer}>
              <GameCard 
                game={game} 
                isSelected={selectedGame === game} 
                onGamePressed={() => onGameSelected(game)} />
            </View>
          ))}
        </View>
      </FadingScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gameSelectorContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gameCardContainer: {
    width: "95%",
    alignItems: "center",
  },
});