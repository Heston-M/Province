import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { tileFields } from "@/hooks/useThemeColor";
import { TileState } from "@/types/tileState";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TileProps {
  state: TileState;
  size: number;
  onSelect: (state: TileState) => void;
}

/**
 * @description
 * Renders a tile
 * @param state - The state of the tile
 * @param size - The size of the tile
 * @param onSelect - Callback function to be called when the tile is selected
 * @returns The tile component
 */
export default function Tile({ state, size, onSelect }: TileProps) {
  const { getThemeColor } = useThemeContext();
  const hiddenColor = getThemeColor("hidden");
  const borderColor = getThemeColor("tileBorder");
  const hiddenBorderColor = getThemeColor("hiddenBorder");
  const uncapturedColor = getThemeColor("uncaptured");
  const growingColor = getThemeColor("growing" + state.growingLevel as (typeof tileFields)[number]);
  const enemyColor = getThemeColor("enemy");
  const fortifiedColor = getThemeColor("fortified");

  const { gameState } = useGameplay();

  const [isHover, setIsHover] = useState(false);
  const [tileColor, setTileColor] = useState(hiddenColor);
  const [tileBorderColor, setTileBorderColor] = useState(borderColor);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (state.isHidden) {
      setTileColor(hiddenColor);
      setTileBorderColor(hiddenBorderColor);
    } else {
      setTileBorderColor(borderColor);
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
    else if (gameState.resourcesLeft <= 0 || 
      (state.type === "territory" && state.isCaptured && state.growingLevel !== 6)) 
      setDisabled(true);
    else setDisabled(false);
  }, [state.isHidden, state.type, state.isCaptured, state.growingLevel, gameState.resourcesLeft, gameState.firstMove, gameState.movesEnabled]);

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
      <View style={[styles.tile, { borderColor: tileBorderColor }]}></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
  },
});