import CustomText from "@/components/ui/CustomText";
import { RulesPage } from "@/constants/rules";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import FadingScrollView from "./ui/FadingScrollView";

interface RulesPageRendererProps {
  page: RulesPage;
}

export default function RulesPageRenderer({ page }: RulesPageRendererProps) {
  const { theme, getThemeColor } = useThemeContext();
  const backgroundColor = getThemeColor("background");
  const textColor = getThemeColor("text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FadingScrollView
        showsVerticalScrollIndicator={false}
        fadeColor={backgroundColor}
        fadeSize={30}
      >
        <CustomText style={[styles.title, { color: textColor }]}>{page.title}</CustomText>
        <View style={styles.content}>
          {page.sections.map((section, index) => {
            switch (section.type) {
              case "text":
                return (
                  <CustomText key={index} style={[styles.text, { color: textColor }]}>
                    {section.content}
                  </CustomText>
                );
              case "image":
                return (
                  <View key={index} style={styles.imageContainer}>
                    <Image 
                      source={theme === "light" ? section.image?.source : section.image?.darkThemeSource ?? section.image?.source} 
                      style={[styles.image, { width: section.image?.width ?? 200, height: section.image?.height ?? 200 }]}
                      contentFit="contain"
                    />
                    {section.image?.caption && (
                      <CustomText style={[styles.caption, { width: section.image?.width ?? 200, color: textColor }]}>
                        {section.image?.caption}
                      </CustomText>
                    )}
                  </View>
                );
              case "text-image":
                return (
                  <View key={index} style={styles.textImageContainer}>
                    <CustomText style={[styles.text, { height: section.image?.height ?? 200, color: textColor }]}>
                      {section.content}
                    </CustomText>
                    {section.image && (
                      <View style={styles.imageContainer}>
                        <Image 
                          source={theme === "light" ? section.image?.source : section.image?.darkThemeSource ?? section.image?.source} 
                          style={[styles.textImage, { width: section.image?.width ?? 200, height: section.image?.height ?? 200 }]} 
                          contentFit="contain"
                        />
                        {section.image.caption && (
                          <CustomText style={[styles.caption, { width: section.image?.width ?? 200, color: textColor, textAlign: "center" }]}>
                            {section.image.caption}
                          </CustomText>
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
      </FadingScrollView>
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