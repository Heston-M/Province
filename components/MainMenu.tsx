import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MenuButton from "./ui/MenuButton";

interface MainMenuProps {
  onClose: () => void;
}

export default function MainMenu({ onClose }: MainMenuProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}
      onPress={onClose}
    >
      <Text style={[styles.title, { color: textColor }]}>Province</Text>
      <View style={styles.gridContainer}>
        <MenuButton text="Restart Game" onPress={() => {}} />
        <MenuButton text="Level Select" onPress={() => {}} />
        <View style={styles.row}>
          <MenuButton text="Rules" onPress={() => {}} />
          <MenuButton text="Settings" onPress={() => {}} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "column",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
});