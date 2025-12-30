import { StyleSheet, Text, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * @description
 * Maps React Native fontWeight values to Comfortaa font variants
 */
const getFontFamily = (fontWeight?: string | number): string => {
  if (fontWeight === "300" || fontWeight === 300) return "Comfortaa-Light";
  if (fontWeight === "500" || fontWeight === 500) return "Comfortaa-Medium";
  if (fontWeight === "600" || fontWeight === 600) return "Comfortaa-SemiBold";
  if (fontWeight === "bold" || fontWeight === "700" || fontWeight === 700) return "Comfortaa-Bold";
  return "Comfortaa";
};

/**
 * @description
 * A custom Text component that applies the Comfortaa font family.
 * Automatically maps fontWeight props to the correct font variant.
 */
export default function CustomText({ style, ...props }: CustomTextProps) {
  const styleArray = Array.isArray(style) ? style : [style];
  const flattenedStyle = StyleSheet.flatten(styleArray);
  const fontWeight = flattenedStyle?.fontWeight;
  
  const fontFamily = getFontFamily(fontWeight);
  
  return <Text style={[{ fontFamily }, style]} {...props} />;
}

