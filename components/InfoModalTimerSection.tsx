import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { opacity } from "@/constants/opacity";

type InfoModalTimerSectionProps = {
  timeUntilNewPuzzle: string;
};

export const InfoModalTimerSection = ({
  timeUntilNewPuzzle,
}: InfoModalTimerSectionProps) => {
  return (
    <View style={styles.timerSection}>
      <Text style={styles.timerText}>{timeUntilNewPuzzle}</Text>
      <Text style={styles.madeInText}>
        Made with ❤️ in Minneapolis, MN (CST)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerSection: {
    alignItems: "center",
    gap: spacing.xs,
  },
  timerText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    opacity: opacity.subtle,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
  madeInText: {
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    opacity: opacity.moderate,
    color: colors.neutral.white,
    fontFamily: fontFamily.bitter.regular,
  },
});
