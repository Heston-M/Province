import { useGameplay } from "@/contexts/GameplayContext";
import { tileFields, useThemeColor } from "@/hooks/useThemeColor";
import { TileState } from "@/types/tileState";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TileProps {
  state: TileState;
  size: number;
  onSelect: (state: TileState) => void;
}

export default function Tile({ state, size, onSelect }: TileProps) {
  const hiddenColor = useThemeColor("hidden");
  const borderColor = useThemeColor("border");
  const uncapturedColor = useThemeColor("uncaptured");
  const growingColor = useThemeColor("growing" + state.growingLevel as (typeof tileFields)[number]);
  const enemyColor = useThemeColor("enemy");
  const fortifiedColor = useThemeColor("fortified");

  const { gameState } = useGameplay();

  const [isHover, setIsHover] = useState(false);
  const [tileColor, setTileColor] = useState(hiddenColor);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (state.isHidden) {
      setTileColor(hiddenColor);
    } else {
      setTileColor((prevColor) => {
        switch (state.type) {
          case "territory":
            if (state.isCaptured) {
              return growingColor;
            } else {
              return uncapturedColor;
            }
          case "enemy":
            return enemyColor;
          case "fortified":
            return fortifiedColor;
          default:
            return prevColor;
        }
      });
    }
    if (state.type === "fortified" || !gameState.movesEnabled) setDisabled(true);
    else if (state.isHidden) setDisabled(true);
    else if (gameState.movesLeft <= 0 || 
      (state.type === "territory" && state.isCaptured && state.growingLevel !== 0 && state.growingLevel !== 6)) 
      setDisabled(true);
    else setDisabled(false);
  }, [state.isHidden, state.type, state.isCaptured, state.growingLevel, gameState.movesLeft, gameState.firstMove, gameState.movesEnabled]);

  return (
    <Pressable 
      style={{ 
        backgroundColor: isHover ? tileColor + "40" : tileColor,
        width: size, 
        height: size
       }}
      onHoverIn={() => setIsHover(true)}
      onHoverOut={() => setIsHover(false)}
      onPress={() => {
        onSelect(state);
      }}
      disabled={disabled}
    >
      <View style={[styles.tile, { borderColor: borderColor }]}></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
  },
});