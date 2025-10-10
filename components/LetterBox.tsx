import {
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
} from "@/constants/styles";
import { HintOutline } from "./HintOutline";

export type LetterBoxProps = {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
  isCurrentGuess: boolean;
  invalidWord: boolean;
  showHint?: boolean;
  hintLetter?: string;
  onPressHint?: () => void;
};

const LetterBox = ({
  letter,
  isCorrect,
  isPresent,
  isCurrentGuess,
  invalidWord,
  showHint = false,
  hintLetter = "",
  onPressHint,
}: LetterBoxProps) => {
  const cellStyles: StyleProp<ViewStyle> = [styles.container];

  if (!isCurrentGuess && letter) {
    if (isCorrect) {
      cellStyles.push({ backgroundColor: colors.semantic.success });
    } else if (isPresent) {
      cellStyles.push(styles.present);
    } else {
      cellStyles.push(styles.absent);
    }
  }

  if (invalidWord) {
    cellStyles.push(styles.invalid);
  }

  const letterBox = (
    <View style={cellStyles}>
      <Text style={styles.letter}>{letter}</Text>
      {showHint && (
        <>
          <HintOutline />
          <View style={styles.previewLetterWrapper}>
            <Text style={styles.previewLetter}>{hintLetter.toUpperCase()}</Text>
          </View>
        </>
      )}
    </View>
  );

  // If showing hint and onPressHint is provided, make it pressable
  if (showHint && onPressHint) {
    return (
      <Pressable
        onPress={onPressHint}
        accessibilityRole="button"
        accessibilityLabel="Show hint modal"
        style={styles.pressableContainer}
      >
        {letterBox}
      </Pressable>
    );
  }

  return letterBox;
};

export default LetterBox;

const styles = StyleSheet.create({
  pressableContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    justifyContent: "center",
    backgroundColor: colors.tiles.default,
    alignItems: "center",
    borderRadius: borderRadius.md,
    position: "relative",
  },
  letter: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
  },
  present: {
    backgroundColor: colors.tiles.wrongPlace,
  },
  absent: {
    backgroundColor: colors.neutral.black,
  },
  invalid: {
    borderColor: colors.neutral.white,
    backgroundColor: colors.neutral.darkGray,
  },
  previewLetter: {
    textAlign: "center",
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
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
