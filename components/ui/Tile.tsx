import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TileProps {
  type: "blank";
  x: number;
  y: number;
  size: number;
}

export default function Tile({ type, x, y, size }: TileProps) {
  const backgroundColor = useThemeColor("default");
  const hoverColor = useThemeColor("hover");
  const borderColor = useThemeColor("border");
  const selectedColor = useThemeColor("selected");
  
  const [isSelected, setIsSelected] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return (
    <Pressable 
      style={{ 
        backgroundColor: isSelected ? selectedColor : isHover ? hoverColor : backgroundColor,
        borderColor: borderColor,
        width: size, 
        height: size
       }}
      onHoverIn={() => setIsHover(true)}
      onHoverOut={() => setIsHover(false)}
      onPress={() => setIsSelected(!isSelected)}
    >
      <View style={styles.tile}></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
  },
});