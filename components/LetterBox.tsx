import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { borderRadius, colors, fontSize } from "@/constants/styles";
import { HintOutline } from "./HintOutline";

const LETTERBOX_WIDTH_HEIGHT = 56;

export type LetterBoxProps = {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
  isCurrentGuess: boolean;
  invalidWord: boolean;
  showHint?: boolean;
  hintLetter?: string;
};

const LetterBox = ({
  letter,
  isCorrect,
  isPresent,
  isCurrentGuess,
  invalidWord,
  showHint = false,
  hintLetter = "",
}: LetterBoxProps) => {
  const cellStyles: StyleProp<ViewStyle> = [styles.wrapper];

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
      {showHint && (
        <>
          <HintOutline
            size={LETTERBOX_WIDTH_HEIGHT}
            color={colors.tiles.wrongPlace}
            strokeWidth={3}
            duration={900}
          />
          <View style={styles.previewLetterWrapper}>
            <Text style={styles.previewLetter}>{hintLetter.toUpperCase()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default LetterBox;

const styles = StyleSheet.create({
  wrapper: {
    width: LETTERBOX_WIDTH_HEIGHT,
    height: LETTERBOX_WIDTH_HEIGHT,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
    position: "relative",
  },
  letter: {
    fontFamily: "Bitter-Bold",
    fontSize: fontSize.title.large,
    color: colors.neutral.white,
  },
  correct: {
    backgroundColor: colors.tiles.correct,
  },
  present: {
    backgroundColor: colors.tiles.wrongPlace,
  },
  absent: {
    backgroundColor: colors.neutral.black,
  },
  // TODO: Make the "invalid word state less scary/red" --->
  invalid: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.semantic.error,
  },
  previewLetter: {
    textAlign: "center",
    fontFamily: "Bitter-Bold",
    fontSize: fontSize.title.large,
    color: colors.neutral.white,
    opacity: 0.4,
    zIndex: 1,
  },
  previewLetterWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
