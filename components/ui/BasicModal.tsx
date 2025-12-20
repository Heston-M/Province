import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

interface BasicModalProps {
  visible: boolean;
  children: React.ReactNode;
}

export default function BasicModal({ visible, children }: BasicModalProps) {
  const backgroundColor = useThemeColor("background");
  const secondaryColor = useThemeColor("secondary");
  const borderColor = useThemeColor("border");

  return (
    visible && (
      <View style={[styles.modal, { backgroundColor: secondaryColor, borderColor: borderColor }]}>
        <View style={[styles.modal, { backgroundColor: backgroundColor, opacity: 0.5 }]}></View>
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