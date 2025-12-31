import CustomText from "@/components/ui/CustomText";
import FadingScrollView from "@/components/ui/FadingScrollView";
import GameCard from "@/components/ui/GameCard";
import { useThemeContext } from "@/contexts/ThemeContext";
import { GameConfig } from "@/types/gameConfig";
import { StyleSheet, View } from "react-native";

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
          <CustomText style={[styles.title, { color: textColor }]}>Previous Custom Games</CustomText>
          {games.map((game) => (
            <View key={game.id} style={styles.gameCardContainer}>
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  scrollView: {
    
  },
  container: {
    width: "100%",
    alignItems: "center",
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  gameCardContainer: {
    width: "95%",
    alignItems: "center",
  },
});