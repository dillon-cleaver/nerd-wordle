import {
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import { SubtleGradient } from "./base/SubtleGradient";
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

export const LetterBox = ({
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

  if (invalidWord) {
    cellStyles.push(styles.invalidBorder);
  }

  const feedbackBackground =
    invalidWord
      ? colors.neutral.darkGray
      : !isCurrentGuess && letter
        ? isCorrect
          ? colors.semantic.success
          : isPresent
            ? colors.tiles.wrongPlace
            : colors.neutral.black
        : null;

  const letterBox = (
    <View style={cellStyles}>
      {feedbackBackground ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: feedbackBackground },
          ]}
        />
      ) : (
        <SubtleGradient
          colors={[
            colors.tiles.defaultGradientStart,
            colors.tiles.defaultGradientEnd,
          ]}
        />
      )}
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
    alignItems: "center",
    borderRadius: borderRadius.md,
    position: "relative",
    overflow: "hidden",
  },
  letter: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
  },
  invalidBorder: {
    borderColor: colors.neutral.white,
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
