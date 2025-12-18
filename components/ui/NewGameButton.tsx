import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button } from "@react-navigation/elements";

export default function NewGameButton() {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const { newGame } = useGameplay();

  return (
    <Button variant="filled" color={backgroundColor} onPress={() => {
      newGame(8);
    }}>
      New Game
    </Button>
  );
}
