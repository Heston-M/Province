import CustomText from "@/components/ui/CustomText";
import MenuButton from "@/components/ui/MenuButton";
import { getRandomGame } from "@/constants/levels/randomGames";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface WelcomeScreenProps {
  delay: number;
  onStartGame: () => void;
  onTutorial: () => void;
}

export default function WelcomeScreen({ delay, onStartGame, onTutorial }: WelcomeScreenProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");
  const borderColor = getThemeColor("border");

  const { newGame } = useGameplay();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const text1FadeAnim = useRef(new Animated.Value(0)).current;
  const text2FadeAnim = useRef(new Animated.Value(0)).current;
  const text3FadeAnim = useRef(new Animated.Value(0)).current;
  const text4FadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 500 + delay,
      duration: 5000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text1FadeAnim, {
      toValue: 1,
      delay: 3000 + delay,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text2FadeAnim, {
      toValue: 1,
      delay: 6000 + delay,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text3FadeAnim, {
      toValue: 1,
      delay: 9000 + delay,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text4FadeAnim, {
      toValue: 1,
      delay: 12000 + delay,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      delay: 15000 + delay,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, text1FadeAnim, text2FadeAnim, text3FadeAnim, text4FadeAnim, buttonFadeAnim]);

  const startGame = () => {
    newGame(getRandomGame());
    onStartGame();
  }

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: backgroundColor, 
        borderColor: borderColor, 
        opacity: fadeAnim,
      }
    ]}>
      <CustomText style={[styles.title, { color: textColor }]}>Province</CustomText>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text1FadeAnim, fontFamily: "Comfortaa" }]}>
        Welcome ambitious conqueror...</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text2FadeAnim, fontFamily: "Comfortaa" }]}>
        You don't seem like you're ready to rule the world yet.</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text3FadeAnim, fontFamily: "Comfortaa" }]}>
        Unfortunately, all competent options are... indisposed. So you'll have to do.</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text4FadeAnim, fontFamily: "Comfortaa" }]}>
        Now, do you know what to do? Or do I need to spell it out for you?</Animated.Text>
      <Animated.View style={[styles.row, { opacity: buttonFadeAnim }]}>
        <MenuButton text="Get to Work" onPress={startGame} />
        <MenuButton text="Tutorial" onPress={onTutorial} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
});