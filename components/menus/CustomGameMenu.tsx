import GameSelector from "@/components/GameSelector";
import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { GameConfig } from "@/types/gameConfig";
import { MenuType } from "@/types/menuType";
import { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomGameMenuProps {
  onBack: () => void;
  onOpenMenu: (type: MenuType) => void;
  onEditGame: (game: GameConfig | undefined) => void;
  onGameStarted: () => void;
}

export default function CustomGameMenu({ onBack, onOpenMenu, onEditGame, onGameStarted }: CustomGameMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const deleteColor = getThemeColor("destructive");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const height = () => {
    if (Platform.OS === "web") {
      return undefined;
    }
    switch (customGames.length) {
      case 0:
        return 86;
      case 1:
        return 340;
      case 2:
        return 455;
      default:
        return 543;
      }
    }

  const [selectedGame, setSelectedGame] = useState<GameConfig | undefined>(undefined);
  const [deleteModalTarget, setDeleteModalTarget] = useState<"game" | "all" | null>(null);

  const { newGame } = useGameplay();
  const { customGames, removeCustomGame, clearCustomGames } = useUser();

  const startGame = () => {
    newGame(selectedGame!);
    onGameStarted();
  }

  const confirmDeleteModal = () => {
    return (
      <View style={[styles.modalContainer, { backgroundColor: secondaryColor, borderColor: deleteColor }]}>
        <Text style={[styles.modalTitle, { color: textColor }]}>
          Delete {deleteModalTarget === "game" ? `"${selectedGame?.name}"` : "all games"}?
        </Text>
        <Text style={[styles.modalMessage, { color: textColor }]}>
          {deleteModalTarget === "game" ? "Are you sure you want to permanently delete this game?" : "Are you sure you want to permanently delete all games?"}
        </Text>
        {deleteModalTarget === "all" && 
          <Text style={[styles.modalMessage, { color: textColor }]}>This action cannot be undone.</Text>
        }
        <View style={styles.row}>
          <MenuButton 
            text="Cancel"
            fillColor={backgroundColor}
            onPress={() => setDeleteModalTarget(null)} 
          />
          <MenuButton 
            text="Delete"
            fillColor={deleteColor}
            highlight={true}
            highlightColor={deleteColor}
            onPress={() => {
              if (deleteModalTarget === "game") {
                removeCustomGame(selectedGame!);
              } else {
                clearCustomGames();
              }
              setSelectedGame(undefined);
              setDeleteModalTarget(null);
          }} />
        </View>
      </View>
    )
  }
  
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor, height: height() }]}>
      <Pressable onPress={onBack} style={styles.backIconContainer}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Custom Games</Text>
      <View style={styles.row}>
        <MenuButton text="New Custom Game" onPress={() => onOpenMenu("customGameCreation")} />
        {customGames.length > 0 && <MenuButton 
          text="Start Game" 
          highlight={selectedGame !== undefined} 
          disabled={selectedGame === undefined} 
          onPress={startGame} 
        />}
      </View>
      {customGames.length > 0 && <View style={[styles.gameSelectorContainer, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <GameSelector 
          games={customGames} 
          selectedGame={selectedGame} 
          onGameSelected={(game) => selectedGame === game ? setSelectedGame(undefined) : setSelectedGame(game)} 
        />
        {deleteModalTarget && confirmDeleteModal()}
      </View>}
      {customGames.length > 0 && <View style={styles.row}>
        <MenuButton 
          text="Delete All"
          highlight={true}
          highlightColor={deleteColor}
          onPress={() => setDeleteModalTarget("all")}
        />
        <MenuButton 
          text="Delete"
          highlight={selectedGame !== undefined}
          highlightColor={deleteColor}
          disabled={selectedGame === undefined}
          onPress={() => setDeleteModalTarget("game")}
        />
        <MenuButton 
          text="Edit"
          highlight={selectedGame !== undefined}
          disabled={selectedGame === undefined}
          onPress={() => onEditGame(selectedGame)}
        />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 543,
    minWidth: 220,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    gap: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  gameSelectorContainer: {
    flex: 1,
    flexShrink: 1,
    maxHeight: "70%",
    minHeight: 150,
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});