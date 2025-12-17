import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TileProps {
  type: "blank";
  x: number;
  y: number;
  size: number;
}

  export default function Tile({ type, x, y, size }: TileProps) {
    const [isSelected, setIsSelected] = useState(false);

  return (
    <Pressable 
      style={{ 
        backgroundColor: isSelected ? "white" : "red", 
        width: size, 
        height: size
       }}
      onPress={() => setIsSelected(!isSelected)}
    >
      <View style={styles.tile}>
        <Text>Tile</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
  },
});