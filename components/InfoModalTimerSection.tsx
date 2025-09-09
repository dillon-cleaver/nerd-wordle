import { Text, View, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";

type InfoModalTimerSectionProps = {
  timeUntilNewPuzzle: string;
};

export const InfoModalTimerSection = ({
  timeUntilNewPuzzle,
}: InfoModalTimerSectionProps) => {
  return (
    <View style={styles.timerSection}>
      <Text style={styles.timerText}>{timeUntilNewPuzzle}</Text>
      <Text style={styles.madeInText}>Made with ❤️ in Minneapolis, MN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerSection: {
    alignItems: "center",
  },
  timerText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
  madeInText: {
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
});
