import RulesPageRenderer from "@/components/RulesPageRenderer";
import { getRulesPage, getTotalPages } from "@/constants/rules";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface RulesMenuProps {
  onClose: () => void;
}

export default function RulesMenu({ onClose }: RulesMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");
  const nextIcon = getIconSource("nextIcon");
  const previousIcon = getIconSource("previousIcon");

  const [page, setPage] = useState(1);
  const currentPage = getRulesPage(page);
  const totalPages = getTotalPages();

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable onPress={onClose} style={styles.backIconContainer}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <View style={styles.pageContainer}>
        <RulesPageRenderer page={currentPage} />
      </View>
      <Pressable 
        onPress={() => setPage(page + 1)} 
        style={[styles.nextIconContainer, { opacity: page >= totalPages ? 0.5 : 1 }]}
        disabled={page >= totalPages}
      >
        <Image source={nextIcon} style={styles.pageIcon} />
      </Pressable>
      <Pressable 
        onPress={() => setPage(page - 1)} 
        style={[styles.previousIconContainer, { opacity: page <= 1 ? 0.5 : 1 }]} 
        disabled={page <= 1}>
        <Image source={previousIcon} style={styles.pageIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    maxWidth: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  backIconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  nextIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
  previousIconContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  pageIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pageContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 0,
    borderWidth: 0,
  },
});