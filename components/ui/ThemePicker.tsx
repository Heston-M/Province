import { colors } from "@/constants/colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ThemePicker() {
  const { setPreference, getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  const [hoveredItem, setHoveredItem] = useState<"light" | "dark" | "system" | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Color Scheme</Text>
      <View style={styles.themeContainer}>
        <Pressable 
          style={[styles.themeItem, { 
            borderColor: colors["light"].border, 
            backgroundColor: hoveredItem === "light" ? colors["light"].background : colors["light"].secondary }]} 
          onPress={() => setPreference("light")}
          onHoverIn={() => setHoveredItem("light")}
          onHoverOut={() => setHoveredItem(null)}
          onPressIn={() => setHoveredItem("light")}
          onPressOut={() => setHoveredItem(null)}>
          <Text style={[styles.themeTitle, { color: colors["light"].text }]}>Light</Text>
          <View style={[styles.themeWindow, { backgroundColor: colors["light"].text }]}></View>
        </Pressable>
        <Pressable 
          style={[styles.themeItem, { 
            borderColor: colors["dark"].border, 
            backgroundColor: hoveredItem === "dark" ? colors["dark"].background : colors["dark"].secondary }]} 
          onPress={() => setPreference("dark")}
          onHoverIn={() => setHoveredItem("dark")}
          onHoverOut={() => setHoveredItem(null)}
          onPressIn={() => setHoveredItem("dark")}
          onPressOut={() => setHoveredItem(null)}>
          <Text style={[styles.themeTitle, { color: colors["dark"].text }]}>Dark</Text>
          <View style={[styles.themeWindow, { backgroundColor: colors["dark"].text }]}></View>
        </Pressable>
        <Pressable 
          style={[styles.themeItem, { 
            borderColor: borderColor, 
            backgroundColor: hoveredItem === "system" ? backgroundColor : secondaryColor }]} 
          onPress={() => setPreference("system")}
          onHoverIn={() => setHoveredItem("system")}
          onHoverOut={() => setHoveredItem(null)}
          onPressIn={() => setHoveredItem("system")}
          onPressOut={() => setHoveredItem(null)}>
          <Text style={[styles.themeTitle, { color: textColor }]}>System</Text>
          <View style={[styles.themeWindow, { backgroundColor: textColor }]}></View>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeItem: {
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    gap: 5,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  themeWindow: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});