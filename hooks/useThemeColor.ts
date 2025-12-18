import { colors, tileColors } from "@/constants/colors";
import { useColorScheme } from "react-native";

const colorFields = Object.keys(colors["light"]) as (keyof typeof colors["light"])[];
const tileFields = Object.keys(tileColors["light"]) as (keyof typeof tileColors["light"])[];

interface ThemeColor {
  field: (typeof colorFields)[number] | (typeof tileFields)[number];
}

export const useThemeColor = (field: ThemeColor["field"]) => {
  const theme = useColorScheme() || "light";

  let color = "";
  
  if (colorFields.includes(field as (typeof colorFields)[number])) {
    color = colors[theme][field as (typeof colorFields)[number]];
  } else if (tileFields.includes(field as (typeof tileFields)[number])) {
    color = tileColors[theme][field as (typeof tileFields)[number]];
  } else {
    throw new Error(`Invalid field: ${field}`);
  }

  return color as typeof color;
}