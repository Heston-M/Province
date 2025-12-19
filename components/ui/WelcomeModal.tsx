import { useThemeColor } from "@/hooks/useThemeColor";
import { Modal, StyleSheet, Text, View } from "react-native";
import NewGameButton from "./NewGameButton";

interface WelcomeModalProps {
  visible: boolean;
}

export default function WelcomeModal({ visible }: WelcomeModalProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("border");

  return (
    <>
    <Modal visible={visible} transparent={true} style={[styles.modal, { backgroundColor: backgroundColor }]}>
    <View style={[styles.container, { backgroundColor: backgroundColor, opacity: 0.9 }]}></View>
      <View style={[styles.container, { backgroundColor: "transparent", borderColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Province</Text>
        <Text style={[styles.description, { color: textColor }]}>
          Welcome ambitious conqueror...
        </Text>
        <Text style={[styles.description, { color: textColor }]}>
          You don't seem like you're ready to rule the world yet. 
          Unfortunately, all competent options are... indisposed. So you'll have to do.
        </Text>
        <Text style={[styles.description, { color: textColor }]}>
          Now, do you know what to do? Or do I need to spell it out for you?
        </Text>
        <NewGameButton text="Get to work" />
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});