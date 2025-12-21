import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface RulesMenuProps {
  onClose: () => void;
}

export default function RulesMenu({ onClose }: RulesMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const [page, setPage] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable onPress={onClose} style={styles.backIconContainer}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={[styles.title, { color: textColor }]}>Rules</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
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