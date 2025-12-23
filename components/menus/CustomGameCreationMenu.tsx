import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { FixedFillConfig, GameConfig, ProbabilitiesFillConfig } from "@/types/gameConfig";
import { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

interface CustomGameMenuProps {
  game: GameConfig | undefined;
  onBack: () => void;
  onGameStarted: () => void;
}

export default function CustomGameMenu({ game, onBack, onGameStarted }: CustomGameMenuProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardX, setBoardX] = useState("");
  const [boardY, setBoardY] = useState("");
  const [resourceLimit, setResourceLimit] = useState("");
  const [useTimeLimit, setUseTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [useFogOfWar, setUseFogOfWar] = useState(false);
  const [enemyAggression, setEnemyAggression] = useState("");

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [useFixedFill, setUseFixedFill] = useState(false);
  const [fortifiedChance, setFortifiedChance] = useState("");
  const [enemyChance, setEnemyChance] = useState("");
  const [maxFortified, setMaxFortified] = useState("");
  const [maxEnemy, setMaxEnemy] = useState("");
  const [minFortified, setMinFortified] = useState("");
  const [minEnemy, setMinEnemy] = useState("");
  const [fortifiedNumber, setFortifiedNumber] = useState("");
  const [enemyNumber, setEnemyNumber] = useState("");

  useEffect(() => {
    const loadGame = () => {
      if (game) {
        setName(game.name ?? "");
        setDescription(game.description ?? "");
        setBoardX(game.boardSize[0].toString() ?? "");
        setBoardY(game.boardSize[1].toString() ?? "");
        setResourceLimit(game.resourceLimit.toString() ?? "");
        setUseTimeLimit(game.timeLimit !== -1 ? true : false);
        setTimeLimit(game.timeLimit.toString() ?? "");
        setUseFogOfWar(game.fogOfWar ?? false);
        setEnemyAggression(prev => {
          const newEnemyAggression = game.enemyAggression ? game.enemyAggression * 10 : prev;
          return newEnemyAggression.toString();
        });
        setShowAdvancedOptions(false);
        setUseFixedFill(game.fillConfig.type === "fixed" ? true : false);
        setFortifiedChance(prev => {
          const newFortifiedChance = game.fillConfig.type === "probabilities" ? (game.fillConfig as ProbabilitiesFillConfig).probabilities?.fortified * 100 : prev;
          return newFortifiedChance.toString();
        });
        setEnemyChance(prev => {
          const newEnemyChance = game.fillConfig.type === "probabilities" ? (game.fillConfig as ProbabilitiesFillConfig).probabilities?.enemy * 100 : prev;
          return newEnemyChance.toString();
        });
        setMaxFortified(prev => {
          const newMaxFortified = game.fillConfig.type === "fixed" ? (game.fillConfig as FixedFillConfig).numbers?.fortified : prev;
          return newMaxFortified.toString();
        });
        setMaxEnemy(prev => {
          const newMaxEnemy = game.fillConfig.type === "fixed" ? (game.fillConfig as FixedFillConfig).numbers?.enemy : prev;
          return newMaxEnemy.toString();
        });
        setMinFortified(prev => {
          const newMinFortified = game.fillConfig.type === "probabilities" ? (game.fillConfig as ProbabilitiesFillConfig).probabilities?.minFortified : prev;
          return newMinFortified.toString();
        });
        setMinEnemy(prev => {
          const newMinEnemy = game.fillConfig.type === "probabilities" ? (game.fillConfig as ProbabilitiesFillConfig).probabilities?.minEnemy : prev;
          return newMinEnemy.toString();
        });
        setFortifiedNumber(prev => {
          const newFortifiedNumber = game.fillConfig.type === "fixed" ? (game.fillConfig as FixedFillConfig).numbers?.fortified : prev;
          return newFortifiedNumber.toString();
        });
        setEnemyNumber(prev => {
          const newEnemyNumber = game.fillConfig.type === "fixed" ? (game.fillConfig as FixedFillConfig).numbers?.enemy : prev;
          return newEnemyNumber.toString();
        });
      }
    }
    loadGame();
  }, [game]);

  const [error, setError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<("name" |"boardX" | "boardY" | "resourceLimit" | "timeLimit" | "enemyAggression" | "fortifiedChance" | "enemyChance" | "maxFortified" | "maxEnemy" | "minFortified" | "minEnemy" | "fortifiedNumber" | "enemyNumber")[]>([]);

  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const tertiaryColor = getThemeColor("tertiary");
  const accentColor = getThemeColor("accent");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const { newGame } = useGameplay();
  const { addCustomGame, updateCustomGame } = useUser();

  function submitGame() {
    setError(null);
    setInvalidFields([]);

    const errors = [];
    const invalidFields: ("name" |"boardX" | "boardY" | "resourceLimit" | "timeLimit" | "enemyAggression" | "fortifiedChance" | "enemyChance" | "maxFortified" | "maxEnemy" | "minFortified" | "minEnemy" | "fortifiedNumber" | "enemyNumber")[] = [];

    const newName = name.trim();
    if (newName.length === 0) {
      errors.push("Name is required.");
      invalidFields.push("name");
    }
    const newDescription = description.trim();
    const newBoardY = boardY.trim() === "" ? 8 : parseInt(boardY.trim());
    if (isNaN(newBoardY) || newBoardY < 3 || newBoardY > 20) {
      errors.push("Rows must be between 3 and 20.");
      invalidFields.push("boardY");
    }
    const newBoardX = boardX.trim() === "" ? 8 : parseInt(boardX.trim());
    if (isNaN(newBoardX) || newBoardX < 3 || newBoardX > 20) {
      errors.push("Columns must be between 3 and 20.");
      invalidFields.push("boardX");
    }
    const newResourceLimit = resourceLimit.trim() === "" ? 10 : parseInt(resourceLimit.trim());
    if (isNaN(newResourceLimit) || newResourceLimit < 7) {
      errors.push("Resource limit must be at least 7.");
      invalidFields.push("resourceLimit");
    }
    const newTimeLimit = useTimeLimit ? parseInt(timeLimit.trim()) : -1;
    if (useTimeLimit && (isNaN(newTimeLimit) || newTimeLimit < 1)) {
      errors.push("Time limit must be at least 1 second.");
      invalidFields.push("timeLimit");
    }
    const newEnemyAggression = enemyAggression.trim() === "" ? 5 : parseFloat(enemyAggression.trim());
    if (isNaN(newEnemyAggression) || newEnemyAggression < 0 || newEnemyAggression > 10) {
      errors.push("Enemy aggression must be between 0 and 10.");
      invalidFields.push("enemyAggression");
    }
    const newFortifiedChance = fortifiedChance.trim() === "" ? 5 : parseFloat(fortifiedChance.trim());
    const newEnemyChance =         enemyChance.trim() === "" ? 5 : parseFloat(enemyChance.trim());
    const newMaxFortified =       maxFortified.trim() === "" ? newBoardX * newBoardY : parseInt(maxFortified.trim());
    const newMaxEnemy =               maxEnemy.trim() === "" ? newBoardX * newBoardY : parseInt(maxEnemy.trim());
    const newMinFortified =       minFortified.trim() === "" ? 0 : parseInt(minFortified.trim());
    const newMinEnemy =               minEnemy.trim() === "" ? 0 : parseInt(minEnemy.trim());
    const newFortifiedNumber = fortifiedNumber.trim() === "" ? Math.ceil(newBoardX * newBoardY / 20) : parseInt(fortifiedNumber.trim());
    const newEnemyNumber =         enemyNumber.trim() === "" ? Math.ceil(newBoardX * newBoardY / 20) : parseInt(enemyNumber.trim());
    if (useFixedFill) {
      if (isNaN(newFortifiedNumber) || newFortifiedNumber < 0 || newFortifiedNumber > newBoardX * newBoardY) {
        errors.push("Fortified number must be between 0 and the board size.");
        invalidFields.push("fortifiedNumber");
      }
      if (isNaN(newEnemyNumber) || newEnemyNumber < 0 || newEnemyNumber > newBoardX * newBoardY) {
        errors.push("Enemy number must be between 0 and the board size.");
        invalidFields.push("enemyNumber");
      }
      if (isNaN(newFortifiedNumber) || isNaN(newEnemyNumber) || newFortifiedNumber + newEnemyNumber > newBoardX * newBoardY) {
        errors.push("Fortified and enemy numbers must be less than the board size.");
        invalidFields.push("fortifiedNumber");
        invalidFields.push("enemyNumber");
      }
    } else {
      if (isNaN(newFortifiedChance) || newFortifiedChance < 0 || newFortifiedChance > 100) {
        errors.push("Fortified chance must be between 0 and 100.");
        invalidFields.push("fortifiedChance");
      }
      if (isNaN(newEnemyChance) || newEnemyChance < 0 || newEnemyChance > 100) {
        errors.push("Enemy chance must be between 0 and 100.");
        invalidFields.push("enemyChance");
      }
      if (newFortifiedChance + newEnemyChance > 100) {
        errors.push("Fortified and enemy chances must be less than 100.");
        invalidFields.push("fortifiedChance");
        invalidFields.push("enemyChance");
      }
      if (isNaN(newMaxFortified) || newMaxFortified < 0) {
        errors.push("Max fortified must be at least 0.");
        invalidFields.push("maxFortified");
      }
      if (isNaN(newMaxEnemy) || newMaxEnemy < 0) {
        errors.push("Max enemy must be at least 0.");
        invalidFields.push("maxEnemy");
      }
      if (isNaN(newMinFortified) || newMinFortified > newBoardX * newBoardY) {
        errors.push("Min fortified must be less than the board size.");
        invalidFields.push("minFortified");
      }
      if (isNaN(newMinEnemy) || newMinEnemy > newBoardX * newBoardY) {
        errors.push("Min enemy must be less than the board size.");
        invalidFields.push("minEnemy");
      }
    }

    setError(errors.join("\n"));
    setInvalidFields(invalidFields);

    if (errors.length > 0 || invalidFields.length > 0) {
      return;
    }

    let newFillConfig: ProbabilitiesFillConfig | FixedFillConfig;
    if (useFixedFill) {
      newFillConfig = {
        type: "fixed",
        numbers: {
          fortified: newFortifiedNumber,
          enemy: newEnemyNumber,
        },
      }
    } else {
      newFillConfig = {
        type: "probabilities",
        probabilities: {
          territory: (1 - newFortifiedChance / 100 - newEnemyChance / 100),
          fortified: newFortifiedChance / 100,
          enemy: newEnemyChance / 100,
          maxFortified: newMaxFortified,
          maxEnemy: newMaxEnemy,
          minFortified: newMinFortified,
          minEnemy: newMinEnemy,
        },
      }
    }

    const config: GameConfig = {
      id: -1,
      name: newName,
      description: newDescription,
      boardSize: [newBoardX, newBoardY],
      resourceLimit: newResourceLimit,
      timeLimit: newTimeLimit,
      fogOfWar: useFogOfWar,
      enemyAggression: newEnemyAggression / 10,
      initialTileStates: [],
      fillConfig: newFillConfig,
    }
    if (newGame(config)) {
      if (game) {
        updateCustomGame(game.id, config);
        onBack();
      } else {
        addCustomGame(config);
        onGameStarted();
      }
    }
    else {
      setError("Invalid game config");
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Pressable style={styles.backIconContainer} onPress={() => {onBack()}}>
          <Image source={backIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Custom Game</Text>
        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: textColor }]}>Name (required)</Text>
          <TextInput 
            style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
              invalidFields.includes("name") && { borderColor: "red" }]} 
            value={name} 
            placeholder="Custom game"
            placeholderTextColor={textColor + "80"}
            onChangeText={setName} 
          />
        </View>
        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: textColor }]}>Description</Text>
          <TextInput 
            style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
            value={description} 
            placeholder="A custom game"
            placeholderTextColor={textColor + "80"}
            onChangeText={setDescription} 
          />
        </View>
        {/* Board Size */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: textColor }]}>Board Size</Text>
          <View style={styles.row}>
            <TextInput 
              style={[ styles.thinInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }, 
                invalidFields.includes("boardY") && { borderColor: "red" }]} 
              value={boardY} 
              placeholder="8"
              placeholderTextColor={textColor + "80"}
              onChangeText={setBoardY} 
            />
            <TextInput 
              style={[ styles.thinInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                invalidFields.includes("boardX") && { borderColor: "red" }]} 
              value={boardX} 
              placeholder="8"
              placeholderTextColor={textColor + "80"}
              onChangeText={setBoardX} 
            />
          </View>
        </View>
        <View style={styles.row}>
          {/* Resource Limit */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Resource Limit</Text>
            <TextInput 
              style={[ styles.thinInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                invalidFields.includes("resourceLimit") && { borderColor: "red" }]} 
              value={resourceLimit} 
              placeholder="10"
              placeholderTextColor={textColor + "80"}
              onChangeText={setResourceLimit} 
            />
          </View>
          {/* Enemy Aggression */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Enemy Aggression</Text>
            <TextInput 
              style={[ styles.thinInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                invalidFields.includes("enemyAggression") && { borderColor: "red" }]} 
              value={enemyAggression} 
              placeholder="5 (0 - 10)"
              placeholderTextColor={textColor + "80"}
              onChangeText={setEnemyAggression} 
            />
          </View>
        </View>
        <View style={styles.row}>
          {/* Fog of War Switch */}
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Fog of War</Text>
            <Switch
              value={useFogOfWar}
              onValueChange={setUseFogOfWar}
              trackColor={{ false: tertiaryColor, true: accentColor }}
              thumbColor={textColor}
              ios_backgroundColor={accentColor}
              {...(Platform.OS === 'web' ? { activeThumbColor: textColor } : {})}
            />
          </View>
          {/* Time Limit Switch */}
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Time Limit</Text>
            <Switch
              value={useTimeLimit}
              onValueChange={setUseTimeLimit}
              trackColor={{ false: tertiaryColor, true: accentColor }}
              thumbColor={textColor}
              ios_backgroundColor={accentColor}
              {...(Platform.OS === 'web' ? { activeThumbColor: textColor } : {})}
            />
          </View>
          {/* Advanced Options Switch */}
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Advanced</Text>
            <Switch
              value={showAdvancedOptions}
              onValueChange={setShowAdvancedOptions}
              trackColor={{ false: tertiaryColor, true: accentColor }}
              thumbColor={textColor}
              ios_backgroundColor={accentColor}
              {...(Platform.OS === 'web' ? { activeThumbColor: textColor } : {})}
            />
          </View>
        </View>
        {/* Time Limit */}
        {useTimeLimit && <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: accentColor },
            invalidFields.includes("timeLimit") && { borderColor: "red" }]} 
          value={timeLimit} 
          placeholder="Time Limit (in seconds)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setTimeLimit} 
        />}
        {/* Advanced Options */}
        {showAdvancedOptions && (
          <View style={[styles.advancedOptionsContainer, { backgroundColor: secondaryColor, borderColor: accentColor }]}>
            <Text style={[styles.subHeader, { color: textColor }]}>Advanced Options</Text>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: textColor }]}>Fill using: {useFixedFill ? "Numbers of tiles" : "Probabilities"}</Text>
              <Switch
                value={useFixedFill}
                onValueChange={setUseFixedFill}
                trackColor={{ false: accentColor, true: accentColor }}
                thumbColor={textColor}
                ios_backgroundColor={accentColor}
                {...(Platform.OS === 'web' ? { activeThumbColor: textColor } : {})}
              />
            </View>
            {!useFixedFill && (
              <View style={{ gap: 5 }}>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Fortified Chance</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("fortifiedChance") && { borderColor: "red" }]}
                      value={fortifiedChance}
                      placeholder="0 - 100"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setFortifiedChance(text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Enemy Chance</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("enemyChance") && { borderColor: "red" }]}
                      value={enemyChance}
                      placeholder="0 - 100"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setEnemyChance(text)}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Max Fortified</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("maxFortified") && { borderColor: "red" }]}
                      value={maxFortified}
                      placeholder="> 0"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setMaxFortified(text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Max Enemy</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("maxEnemy") && { borderColor: "red" }]}
                      value={maxEnemy}
                      placeholder="> 0"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setMaxEnemy(text)}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Min Fortified</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("minFortified") && { borderColor: "red" }]}
                      value={minFortified}
                      placeholder="< board size"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setMinFortified(text)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Min Enemy</Text>
                    <TextInput
                      style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                        invalidFields.includes("minEnemy") && { borderColor: "red" }]}
                      value={minEnemy}
                      placeholder="< board size"
                      placeholderTextColor={textColor + "80"}
                      onChangeText={(text) => setMinEnemy(text)}
                    />
                  </View>
                </View>
              </View>
            )}
            {useFixedFill && (
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: textColor }]}>Fortified Tiles</Text>
                  <TextInput
                    style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                      invalidFields.includes("fortifiedNumber") && { borderColor: "red" }]}
                    value={fortifiedNumber}
                    placeholder="0 - board size"
                    placeholderTextColor={textColor + "80"}
                    onChangeText={(text) => setFortifiedNumber(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: textColor }]}>Enemy Tiles</Text>
                  <TextInput
                    style={[styles.advancedInput, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor },
                      invalidFields.includes("enemyNumber") && { borderColor: "red" }]}
                    value={enemyNumber}
                    placeholder="0 - board size"
                    placeholderTextColor={textColor + "80"}
                    onChangeText={(text) => setEnemyNumber(text)}
                  />
                </View>
              </View>
            )}
          </View>
        )}
        {error && <View style={styles.errorContainer}>
           <Text style={[styles.error, { color: textColor }]}>{error}</Text>
        </View>}
        {/* Create Game Button */}
        <View style={styles.row}>
          <MenuButton
            text={game ? "Update Game" : "Create Game"}
            onPress={submitGame}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    gap: 10,
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 30,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 35,
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
  inputContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 2,
  },
  switchContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    width: 250,
  },
  thinInput: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    width: 120,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  advancedOptionsContainer: {
    marginVertical: 10,
    gap: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  advancedInput: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    width: 110,
  }
});