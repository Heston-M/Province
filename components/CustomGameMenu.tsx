import { useGameplay } from "@/contexts/GameplayContext";
import { useUserContext } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GameConfig } from "@/types/gameConfig";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import MenuButton from "./ui/MenuButton";

interface CustomGameMenuProps {
  onBack: () => void;
  onGameStarted: () => void;
}

export default function CustomGameMenu({ onBack, onGameStarted }: CustomGameMenuProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardX, setBoardX] = useState("");
  const [boardY, setBoardY] = useState("");
  const [moveLimit, setMoveLimit] = useState("");
  const [useTimeLimit, setUseTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [useFogOfWar, setUseFogOfWar] = useState(false);
  const [enemyAggression, setEnemyAggression] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<("name" |"boardX" | "boardY" | "moveLimit" | "timeLimit" | "enemyAggression")[]>([]);

  const backgroundColor = useThemeColor("background");
  const secondaryColor = useThemeColor("secondary");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");
  const { theme } = useUserContext();
  const isDark = theme === "dark";

  const { newGame } = useGameplay();

  function submitGame() {
    setError(null);
    setInvalidFields([]);

    const errors = [];
    const invalidFields: ("name" |"boardX" | "boardY" | "moveLimit" | "timeLimit" | "enemyAggression")[] = [];

    const newName = name.trim();
    if (newName.length === 0) {
      errors.push("Name is required.");
      invalidFields.push("name");
    }
    const newDescription = description.trim();
    const newBoardY = parseInt(boardY.trim());
    if (isNaN(newBoardY) || newBoardY < 3 || newBoardY > 20) {
      errors.push("Rows must be between 3 and 20.");
      invalidFields.push("boardY");
    }
    const newBoardX = parseInt(boardX.trim());
    if (isNaN(newBoardX) || newBoardX < 3 || newBoardX > 20) {
      errors.push("Columns must be between 3 and 20.");
      invalidFields.push("boardX");
    }
    const newMoveLimit = parseInt(moveLimit.trim());
    if (isNaN(newMoveLimit) || newMoveLimit < 7) {
      errors.push("Move limit must be at least 7.");
      invalidFields.push("moveLimit");
    }
    const newTimeLimit = useTimeLimit ? parseInt(timeLimit.trim()) : -1;
    if (useTimeLimit && (isNaN(newTimeLimit) || newTimeLimit < 1)) {
      errors.push("Time limit must be at least 1 second.");
      invalidFields.push("timeLimit");
    }
    const newEnemyAggression = Number(enemyAggression.trim());
    if (newEnemyAggression < 0 || newEnemyAggression > 1) {
      errors.push("Enemy aggression must be between 0 and 1.");
      invalidFields.push("enemyAggression");
    }

    setError(errors.join("\n"));
    setInvalidFields(invalidFields);

    if (errors.length > 0 || invalidFields.length > 0) {
      return;
    }

    const config: GameConfig = {
      name: newName,
      description: newDescription,
      boardSize: [newBoardX, newBoardY],
      moveLimit: newMoveLimit,
      timeLimit: newTimeLimit,
      fogOfWar: useFogOfWar,
      enemyAggression: newEnemyAggression,
      initialTileStates: [],
      randRemainingTiles: true,
      randProbabilities: {
        territory: 0.9,
        fortified: 0.05,
        enemy: 0.05,
      },
    }
    if (newGame(config)) {
      onGameStarted();
    }
    else {
      setError("Invalid game config");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Pressable 
          style={styles.closeIconContainer}
          onPress={() => {onBack()}}>
          <Image source={isDark ? require("@/assets/icons/backArrowWhite.jpg") : require("@/assets/icons/backArrowBlack.jpg")} style={styles.closeIcon} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Custom Game</Text>
        {error && <View style={styles.errorContainer}>
           <Text style={[styles.error, { color: textColor }]}>{error}</Text>
        </View>}
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
            invalidFields.includes("name") && { borderColor: "red" }]} 
          value={name} 
          placeholder="Name"
          placeholderTextColor={textColor + "80"}
          onChangeText={setName} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
          value={description} 
          placeholder="Description"
          placeholderTextColor={textColor + "80"}
          onChangeText={setDescription} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }, 
            invalidFields.includes("boardY") && { borderColor: "red" }]} 
          value={boardY} 
          placeholder="Rows (3 - 20)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setBoardY} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
            invalidFields.includes("boardX") && { borderColor: "red" }]} 
          value={boardX} 
          placeholder="Columns (3 - 20)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setBoardX} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
            invalidFields.includes("moveLimit") && { borderColor: "red" }]} 
          value={moveLimit} 
          placeholder="Move Limit (at least 7)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setMoveLimit} 
        />
        <View style={styles.row}>
          <Switch
            value={useFogOfWar}
            onValueChange={setUseFogOfWar}
          />
          <Text style={[styles.label, { color: textColor }]}>Fog of War</Text>
        </View>
        <View style={styles.row}>
          <Switch
            value={useTimeLimit}
            onValueChange={setUseTimeLimit}
          />
          <Text style={[styles.label, { color: textColor, marginRight: 2 }]}>Time Limit</Text>
        </View>
        {useTimeLimit && <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
            invalidFields.includes("timeLimit") && { borderColor: "red" }]} 
          value={timeLimit} 
          placeholder="Time Limit (in seconds)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setTimeLimit} 
        />}
        <View style={styles.row}>
          <MenuButton
            text="Create Game"
            onPress={submitGame}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    gap: 10,
  },
  closeIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  error: {
    fontSize: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
});