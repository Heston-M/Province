import { useGameplay } from "@/contexts/GameplayContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TileState } from "@/types/tileState";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TileProps {
  state: TileState;
  size: number;
  onSelect: (state: TileState) => void;
}

export default function Tile({ state, size, onSelect }: TileProps) {
  const backgroundColor = useThemeColor("default");
  const hoverColor = useThemeColor("hover");
  const borderColor = useThemeColor("border");
  const selectedColor = useThemeColor("selected");

  const { movesLeft } = useGameplay();

  const [isSelected, setIsSelected] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return (
    <Pressable 
      style={{ 
        backgroundColor: isSelected ? selectedColor : isHover ? hoverColor : backgroundColor,
        width: size, 
        height: size
       }}
      onHoverIn={() => setIsHover(true)}
      onHoverOut={() => setIsHover(false)}
      onPress={() => {
        setIsSelected(!isSelected);
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