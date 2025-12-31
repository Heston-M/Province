import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, ColorValue, Platform, ScrollView, ScrollViewProps, StyleSheet, View } from "react-native";

interface FadingScrollViewProps extends ScrollViewProps {
  fadeColor?: string;
  fadeSize?: number;
}

export default function FadingScrollView({
  fadeColor = "#ffffff",
  fadeSize = 30,
  children,
  style,
  onScroll,
  onContentSizeChange,
  onLayout,
  ...scrollViewProps
}: FadingScrollViewProps) {
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number): string => {
    // Handle rgba strings
    if (hex.startsWith("rgba")) return hex;
    if (hex.startsWith("rgb")) {
      const rgbMatch = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
      }
    }
    // Handle hex colors
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const fadeColors = Array.from({ length: 11 }, (_, i) => hexToRgba(fadeColor, 1 - i * 0.1));
  fadeColors.push("transparent");

  const threshold = 5;
  const showTopFade = scrollY > threshold;
  const showBottomFade = scrollY + scrollViewHeight < contentHeight - threshold;

  const fadeTopAnim = useRef(new Animated.Value(showTopFade ? 1 : 0)).current;
  const fadeBottomAnim = useRef(new Animated.Value(showBottomFade ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeTopAnim, {
      toValue: showTopFade ? 1 : 0,
      duration: 500,
      useNativeDriver: Platform.OS !== "web",
    }).start();
    Animated.timing(fadeBottomAnim, {
      toValue: showBottomFade ? 1 : 0,
      duration: 500,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [showTopFade, showBottomFade]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    setScrollY(0);
  }, [children]);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    setScrollY(contentOffset.y);
    onScroll?.(event);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
    onContentSizeChange?.(width, height);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
    onLayout?.(event);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        {...scrollViewProps}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        ref={scrollViewRef}
      >
        {children}
      </ScrollView>
      {showTopFade && (
        <Animated.View style={[styles.fadeTop, { height: fadeSize, opacity: fadeTopAnim }]}>
          <LinearGradient
            colors={fadeColors as [ColorValue, ColorValue, ...ColorValue[]]}
            style={[styles.fadeTop, { height: fadeSize }]}
            pointerEvents="none"
          />
        </Animated.View>
      )}
      {showBottomFade && (
        <Animated.View style={[styles.fadeBottom, { height: fadeSize, opacity: fadeBottomAnim }]}>
          <LinearGradient
            colors={fadeColors.slice().reverse() as [ColorValue, ColorValue, ...ColorValue[]]}
            style={[styles.fadeBottom, { height: fadeSize }]}
            pointerEvents="none"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

