import { Text, View, StyleSheet } from "react-native";
import { InfoModalCategorySection } from "./InfoModalCategorySection";
import { InfoModalInstructionsSection } from "./InfoModalInstructionsSection";
import { InfoModalTimerSection } from "./InfoModalTimerSection";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

type InfoModalContentProps = {
  category: string;
  categoryColor: string;
  categoryTextColor: string;
  timeUntilNewPuzzle: string;
};

export const InfoModalContent = ({
  category,
  categoryColor,
  categoryTextColor,
  timeUntilNewPuzzle,
}: InfoModalContentProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>

      <InfoModalCategorySection
        category={category}
        categoryColor={categoryColor}
        categoryTextColor={categoryTextColor}
      />

      <InfoModalInstructionsSection />

      <InfoModalTimerSection timeUntilNewPuzzle={timeUntilNewPuzzle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
