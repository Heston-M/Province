import MenuButton from "@/components/ui/MenuButton";
import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onTutorial: () => void;
}

export default function WelcomeScreen({ onStartGame, onTutorial }: WelcomeScreenProps) {
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
      delay: 500,
      duration: 5000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text1FadeAnim, {
      toValue: 1,
      delay: 3000,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text2FadeAnim, {
      toValue: 1,
      delay: 6000,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text3FadeAnim, {
      toValue: 1,
      delay: 9000,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(text4FadeAnim, {
      toValue: 1,
      delay: 12000,
      duration: 4000,
      useNativeDriver: true,
    }).start();
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      delay: 15000,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, text1FadeAnim, text2FadeAnim, text3FadeAnim, text4FadeAnim, buttonFadeAnim]);

  const startGame = () => {
    newGame({
      name: "Random Game",
      description: "",
      boardSize: [8, 8],
      resourceLimit: 10,
      timeLimit: -1,
      fogOfWar: false,
      enemyAggression: 0.8,
      initialTileStates: [],
      randRemainingTiles: true,
      randProbabilities: {
        territory: 0.9,
        fortified: 0.05,
        enemy: 0.05,
      },
    });
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
      <Text style={[styles.title, { color: textColor }]}>Province</Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text1FadeAnim }]}>
        Welcome ambitious conqueror...</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text2FadeAnim }]}>
        You don't seem like you're ready to rule the world yet.</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text3FadeAnim }]}>
        Unfortunately, all competent options are... indisposed. So you'll have to do.</Animated.Text>
      <Animated.Text style={[styles.text, { color: textColor, opacity: text4FadeAnim }]}>
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
    flex: 1,

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