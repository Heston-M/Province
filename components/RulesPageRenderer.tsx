import { RulesPage } from "@/constants/rules";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface RulesPageRendererProps {
  page: RulesPage;
}

export default function RulesPageRenderer({ page }: RulesPageRendererProps) {
  const { getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{page.title}</Text>
      <View style={styles.content}>
        {page.sections.map((section, index) => {
          switch (section.type) {
            case "text":
              return (
                <Text key={index} style={[styles.text, { color: textColor }]}>
                  {section.content}
                </Text>
              );
            case "image":
              return (
                <View key={index} style={styles.imageContainer}>
                  <Image 
                    source={section.image?.source} 
                    style={[styles.image, { width: section.image?.width ?? 200, height: section.image?.height ?? 200 }]}
                    contentFit="contain"
                  />
                  {section.image?.caption && (
                    <Text style={[styles.caption, { width: section.image?.width ?? 200, color: textColor }]}>
                      {section.image?.caption}
                    </Text>
                  )}
                </View>
              );
            case "text-image":
              return (
                <View key={index} style={styles.textImageContainer}>
                  <Text style={[styles.text, { height: section.image?.height ?? 200, color: textColor }]}>
                    {section.content}
                  </Text>
                  {section.image && (
                    <View style={styles.imageContainer}>
                      <Image 
                        source={section.image.source} 
                        style={[styles.textImage, { width: section.image?.width ?? 200, height: section.image?.height ?? 200 }]} 
                        contentFit="contain"
                      />
                      {section.image.caption && (
                        <Text style={[styles.caption, { width: section.image?.width ?? 200, color: textColor, textAlign: "center" }]}>
                          {section.image.caption}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            default:
              return null;
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    maxWidth: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    gap: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  caption: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
    textAlign: "center",
  },
  textImageContainer: {
    flexDirection: "row",
    gap: 10,
  },
  textImage: {
    width: 100,
    height: 100,
  },
});