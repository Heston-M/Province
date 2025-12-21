import { useMenuContext } from "@/contexts/MenuContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Pressable, StyleSheet, View } from "react-native";

interface BasicModalProps {
  visible: boolean;
  children: React.ReactNode;
}

/**
 * @description
 * Renders a basic modal
 * @param visible - Whether the modal is visible
 * @param children - The children to render inside the modal
 * @returns The basic modal component
 */
export default function BasicModal({ visible, children }: BasicModalProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const borderColor = getThemeColor("border");

  const { hardCloseMenu } = useMenuContext();

  return (
    visible && (
      <View style={[styles.modal, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <Pressable onPress={hardCloseMenu} style={[styles.modal, { backgroundColor: backgroundColor, opacity: 0.5 }]}></Pressable>
        <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
          {children}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    zIndex: 1001,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});