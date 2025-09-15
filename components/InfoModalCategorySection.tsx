import { Text, View, StyleSheet } from "react-native";
import { Card } from "./base/Card";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";

type InfoModalCategorySectionProps = {
  category: string;
  categoryColor: string;
  categoryTextColor: string;
};

export const InfoModalCategorySection = ({
  category,
  categoryColor,
  categoryTextColor,
}: InfoModalCategorySectionProps) => {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryLabel}>Today&apos;s Category & Color</Text>
      <Card
        containerStyle={[
          styles.categoryCardContainer,
          { borderColor: categoryColor },
        ]}
      >
        <Card
          containerStyle={{
            backgroundColor: categoryColor,
            padding: spacing.md,
            borderRadius: borderRadius.sm,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[styles.category, { color: categoryTextColor }]}>
            {category}
          </Text>
        </Card>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    alignItems: "stretch",
    alignSelf: "stretch",
    gap: spacing.sm,
  },
  categoryCardContainer: {
    alignSelf: "stretch",
    borderWidth: 2,
  },
  categoryLabel: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.medium,
    color: colors.neutral.lightGray,
    textAlign: "left",
  },
  category: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    textAlign: "center",
  },
});
