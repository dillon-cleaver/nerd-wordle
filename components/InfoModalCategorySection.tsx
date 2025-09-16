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
      <Text style={styles.categoryText}>Today&apos;s Category: {category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: spacing.sm,
  },
  categoryText: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    color: colors.neutral.white,
    textAlign: "left",
  },
});
