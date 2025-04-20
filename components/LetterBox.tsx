import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { borderRadius, colors, fontSize } from "@/constants/styles";

const LETTERBOX_WIDTH_HEIGHT = 56;

export type LetterBoxProps = {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
  isCurrentGuess: boolean;
  invalidWord: boolean;
};

const LetterBox = ({
  letter,
  isCorrect,
  isPresent,
  isCurrentGuess,
  invalidWord,
}: LetterBoxProps) => {
  const cellStyles: StyleProp<ViewStyle> = [styles.letterBox];

  if (!isCurrentGuess && letter) {
    if (isCorrect) {
      cellStyles.push(styles.correct);
    } else if (isPresent) {
      cellStyles.push(styles.present);
    } else {
      cellStyles.push(styles.absent);
    }
  }

  if (invalidWord) {
    cellStyles.push(styles.invalid);
  }

  return (
    <View style={cellStyles}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

export default LetterBox;

const styles = StyleSheet.create({
  letterBox: {
    width: LETTERBOX_WIDTH_HEIGHT,
    height: LETTERBOX_WIDTH_HEIGHT,
    borderWidth: 2,
    borderColor: colors.neutral.lightGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  letter: {
    fontFamily: "Bitter-Bold",
    fontSize: fontSize.title.large,
    color: colors.neutral.white,
  },
  correct: {
    backgroundColor: colors.secondary.main,
    borderColor: colors.secondary.main,
  },
  present: {
    backgroundColor: colors.secondary.lighter,
    borderColor: colors.secondary.lighter,
  },
  absent: {
    backgroundColor: colors.neutral.darkGray,
    borderColor: colors.neutral.darkGray,
  },
  // TODO: Make the "invalid word state less scary/red" --->
  invalid: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.semantic.error,
  },
});
