import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import MenuButton from "./ui/MenuButton";


export default function CustomGameMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardX, setBoardX] = useState("");
  const [boardY, setBoardY] = useState("");
  const [moveLimit, setMoveLimit] = useState("");
  const [useTimeLimit, setUseTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [useFogOfWar, setUseFogOfWar] = useState(false);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [enemyAggression, setEnemyAggression] = useState("");

  const backgroundColor = useThemeColor("background");
  const secondaryColor = useThemeColor("secondary");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  const submitGame = () => {
    console.log("submitGame");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Custom Game</Text>
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
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
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
          value={boardY} 
          placeholder="Rows (3 - 20)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setBoardY} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
          value={boardX} 
          placeholder="Columns (3 - 20)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setBoardX} 
        />
        <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
          value={moveLimit} 
          placeholder="Move Limit (at least 6)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setMoveLimit} 
        />
        <View style={styles.row}>
          <Switch
            value={useTimeLimit}
            onValueChange={setUseTimeLimit}
          />
          <Text style={[styles.label, { color: textColor }]}>Time Limit</Text>
        </View>
        {useTimeLimit && <TextInput 
          style={[ styles.input, { color: textColor, backgroundColor: secondaryColor, borderColor: borderColor }]} 
          value={timeLimit} 
          placeholder="Time Limit (in seconds)"
          placeholderTextColor={textColor + "80"}
          onChangeText={setTimeLimit} 
        />}
        <View style={styles.row}>
          <Switch
            value={useFogOfWar}
            onValueChange={setUseFogOfWar}
          />
          <Text style={[styles.label, { color: textColor }]}>Fog of War</Text>
        </View>
        <View style={styles.row}>
          <MenuButton
            text="Create Game"
            onPress={() => {submitGame}}
          />
          <MenuButton
            text="Cancel"
            onPress={() => {}}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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