import { useThemeContext } from "@/contexts/ThemeContext";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ThemePicker from "./ui/ThemePicker";

interface SettingsMenuProps {
  onBack: () => void;
}

export default function SettingsMenu({ onBack }: SettingsMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable style={styles.backIconContainer} onPress={() => {onBack()}}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      <ThemePicker />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});