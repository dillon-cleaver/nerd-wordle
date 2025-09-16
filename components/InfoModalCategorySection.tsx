import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

type InfoModalCategorySectionProps = {
  category: string;
};

export const InfoModalCategorySection = ({
  category,
}: InfoModalCategorySectionProps) => {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryLabel}>Today&apos;s category:</Text>
      <Text style={styles.categoryName}>{category}</Text>
      <Text style={styles.categoryExplanation}>
        Each day features a different nerdy category: Science, Movies,
        Literature, Fantasy and Sci-Fi, Video Games, Anime and Manga, Tabletop
        and Board Games, Tech and Internet Culture, and Superheroes.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  categoryLabel: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    color: colors.neutral.white,
    opacity: 0.8,
    textAlign: "left",
  },
  categoryName: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
    textAlign: "left",
  },
  categoryExplanation: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    color: colors.neutral.white,
    textAlign: "left",
    opacity: 0.8,
    paddingTop: spacing.xs,
  },
});
