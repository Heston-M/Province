import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  const hoverColor = useThemeColor("hover");
  const borderColor = useThemeColor("border");
  const uncapturedColor = useThemeColor("uncaptured");
  const territoryColor = useThemeColor("territory");
  const enemyColor = useThemeColor("enemy");
  const allyColor = useThemeColor("ally");

  const { movesLeft } = useGameplay();

  const [isHover, setIsHover] = useState(false);
  const [tileColor, setTileColor] = useState(hiddenColor);

  useEffect(() => {
    if (state.isHidden) {
      setTileColor(hiddenColor);
    } else {
      setTileColor((prevColor) => {
        switch (state.type) {
          case "territory":
            if (state.isCaptured) {
              return territoryColor;
            } else {
              return uncapturedColor;
            }
          case "enemy":
            return enemyColor;
          case "ally":
            return allyColor;
          default:
            return prevColor;
        }
      });
    }
  }, [state.isHidden, state.type, state.isCaptured]);

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
      disabled={movesLeft <= 0}
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