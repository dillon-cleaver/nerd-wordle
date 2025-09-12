import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";

export const InfoModalInstructionsSection = () => {
  return (
    <View style={styles.instructionsSection}>
      <Text style={styles.instructions}>
        GUESS THE HIDDEN WORD in six tries or less to collect today&apos;s
        NerdWord! 🤓
      </Text>
      <Text style={styles.instructions}>
        Fill out all five tiles in row, then press enter to submit a guess. The
        color of the tiles will change to show how close your guess was to the
        word.
      </Text>
      <Text style={styles.instructions}>
        Tiles will turn <Text style={[styles.greenHighlight]}>green</Text> if
        the letter is in the word and in the correct position.{" "}
        <Text style={styles.mustardHighlight}>Yellow</Text> means the letter is
        in the word but in the wrong position.{" "}
        <Text style={styles.blackHighlight}>Black</Text> means the letter is not
        in the word at all.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsSection: {
    gap: spacing.md,
  },
  instructions: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
  },
  categoryHighlight: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  greenHighlight: {
    backgroundColor: colors.semantic.success,
    color: colors.neutral.white,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  mustardHighlight: {
    backgroundColor: colors.semantic.warning,
    color: colors.neutral.black,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  blackHighlight: {
    backgroundColor: colors.neutral.black,
    color: colors.neutral.white,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
});
