import { colors } from "@/constants/colors";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

export default function ThemePicker() {
  const { preference, setPreference, getThemeColor } = useThemeContext();
  const secondaryColor = getThemeColor("secondary");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const selectedColor = getThemeColor("fortified")

  const systemBackgroundColor = colors[useColorScheme() || "light"].background;
  const systemSecondaryColor = colors[useColorScheme() || "light"].secondary;
  const systemTextColor = colors[useColorScheme() || "light"].text;
  const systemBorderColor = colors[useColorScheme() || "light"].border;

  const [hoveredItem, setHoveredItem] = useState<"light" | "dark" | "system" | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Color Scheme</Text>
      <View style={styles.themeContainer}>
        <Pressable 
          style={[styles.themeItem, { 
            borderColor: preference === "light" ? selectedColor : colors["light"].border, 
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
            borderColor: preference === "dark" ? selectedColor : colors["dark"].border, 
            backgroundColor: hoveredItem === "dark" ? colors["dark"].secondary : colors["dark"].background }]} 
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
            borderColor: preference === "system" ? selectedColor : systemBorderColor, 
            backgroundColor: hoveredItem === "system" ? systemSecondaryColor : systemBackgroundColor }]} 
          onPress={() => setPreference("system")}
          onHoverIn={() => setHoveredItem("system")}
          onHoverOut={() => setHoveredItem(null)}
          onPressIn={() => setHoveredItem("system")}
          onPressOut={() => setHoveredItem(null)}>
          <Text style={[styles.themeTitle, { color: systemTextColor }]}>System</Text>
          <View style={[styles.themeWindow, { backgroundColor: systemTextColor }]}></View>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
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
    borderWidth: 2,
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