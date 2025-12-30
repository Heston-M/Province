import CustomText from "@/components/ui/CustomText";
import MenuButton from "@/components/ui/MenuButton";
import ThemePicker from "@/components/ui/ThemePicker";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface SettingsMenuProps {
  onBack: () => void;
  onClearGameStorage: () => void;
}

export default function SettingsMenu({ onBack, onClearGameStorage }: SettingsMenuProps) {
  const { getThemeColor, getIconSource } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const secondaryColor = getThemeColor("secondary");
  const destructiveColor = getThemeColor("destructive");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");
  const backIcon = getIconSource("backIcon");

  const [confirmClearGameStorageModalVisible, setConfirmClearGameStorageModalVisible] = useState(false);

  const confirmClearGameStorageModal = () => {
    return (
      <View style={[styles.modalContainer, { backgroundColor: secondaryColor, borderColor: destructiveColor }]}>
        <CustomText style={[styles.modalTitle, { color: textColor }]}>Clear Game Storage?</CustomText>
        <CustomText style={[styles.modalMessage, { color: textColor }]}>
          This will reset everything in the game, including level progress, custom games, settings, and more. Everything.</CustomText>
        <CustomText style={[styles.modalMessage, { color: textColor }]}>
          This action cannot be undone.</CustomText>
        <View style={styles.row}>
          <MenuButton text="Cancel" onPress={() => {setConfirmClearGameStorageModalVisible(false)}} />
          <MenuButton 
            text="Clear" 
            fillColor={destructiveColor} 
            highlight={true} 
            highlightColor={destructiveColor} 
            onPress={() => {
              onClearGameStorage();
              setConfirmClearGameStorageModalVisible(false);
            }} />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
      <Pressable style={styles.backIconContainer} onPress={() => {onBack()}}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <CustomText style={[styles.title, { color: textColor }]}>Settings</CustomText>
      <ThemePicker />
      <MenuButton 
        text="Clear Game Storage" 
        highlight={true} 
        highlightColor={destructiveColor} 
        onPress={() => {setConfirmClearGameStorageModalVisible(true)}} />
      {confirmClearGameStorageModalVisible && confirmClearGameStorageModal()}
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
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
  modalContainer: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
});