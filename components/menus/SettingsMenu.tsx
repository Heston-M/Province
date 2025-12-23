import ThemePicker from "@/components/ui/ThemePicker";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

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
  },
});