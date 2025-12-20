import { useMenuContext } from "@/contexts/MenuContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import MenuButton from "./ui/MenuButton";

export default function MainMenu() {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");
  const isDark = useColorScheme() === "dark";

  const { hardCloseMenu } = useMenuContext();

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={[styles.title, { color: textColor }]}>Province</Text>
        <Pressable onPress={hardCloseMenu}>
          <Image source={isDark ? require("@/assets/icons/closeIconWhite.jpg") : require("@/assets/icons/closeIconBlack.jpg")} style={styles.closeIcon} />
        </Pressable>
      </View>
      <View style={styles.gridContainer}>
        <MenuButton text="Restart Game" onPress={() => {}} />
        <MenuButton text="Level Select" onPress={() => {}} />
        <View style={styles.row}>
          <MenuButton text="Rules" onPress={() => {}} />
          <MenuButton text="Settings" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    width: 20,
    height: 20,
    zIndex: 1001,
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