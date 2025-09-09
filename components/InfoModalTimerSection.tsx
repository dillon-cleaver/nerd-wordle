import { Text, View, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize } from "@/constants/styles";

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
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
  madeInText: {
    fontSize: 14,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
});
