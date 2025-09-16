import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";

// Constants for example tile dimensions
const EXAMPLE_TILE_SIZE = 32;

// Small example tile component for the modal
const ExampleTile = ({
  letter,
  isCorrect,
  isPresent,
}: {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
}) => {
  let backgroundColor: string = colors.tiles.default;
  let textColor: string = colors.neutral.white;

  if (isCorrect) {
    backgroundColor = colors.semantic.success;
  } else if (isPresent) {
    backgroundColor = colors.tiles.wrongPlace;
    textColor = colors.neutral.black;
  } else if (letter) {
    backgroundColor = colors.neutral.black;
  }

  return (
    <View style={[styles.exampleTile, { backgroundColor }]}>
      <Text style={[styles.exampleTileText, { color: textColor }]}>
        {letter}
      </Text>
    </View>
  );
};

export const InfoModalInstructionsSection = () => {
  return (
    <View style={styles.instructionsSection}>
      <Text style={styles.subtitle}>
        Guess the <Text style={styles.loginHighlight}>NerdWord</Text> 🤓 in 6
        tries.
      </Text>

      <View style={styles.rulesList}>
        <Text style={styles.rule}>
          • Each guess must be a valid 5-letter word. Guess any five-letter word
          to help narrow down the possibilities.
        </Text>
        <Text style={styles.rule}>
          • The color of the tiles will change to show how close your guess was
          to the word.
        </Text>
      </View>

      <Text style={styles.examplesTitle}>Examples</Text>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="Q" isCorrect={true} isPresent={false} />
          <ExampleTile letter="U" isCorrect={false} isPresent={false} />
          <ExampleTile letter="A" isCorrect={false} isPresent={false} />
          <ExampleTile letter="R" isCorrect={false} isPresent={false} />
          <ExampleTile letter="K" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>Q</Text> is in the word and in the correct
          spot.
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="F" isCorrect={false} isPresent={false} />
          <ExampleTile letter="R" isCorrect={false} isPresent={true} />
          <ExampleTile letter="O" isCorrect={false} isPresent={false} />
          <ExampleTile letter="D" isCorrect={false} isPresent={false} />
          <ExampleTile letter="O" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>R</Text> is in the word but in the wrong
          spot.
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="C" isCorrect={false} isPresent={false} />
          <ExampleTile letter="A" isCorrect={false} isPresent={false} />
          <ExampleTile letter="T" isCorrect={false} isPresent={false} />
          <ExampleTile letter="A" isCorrect={false} isPresent={false} />
          <ExampleTile letter="N" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>B</Text> is not in the word in any spot.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsSection: {
    gap: spacing.sm,
    alignSelf: "stretch",
  },
  subtitle: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
    paddingBottom: spacing.xs,
  },
  rulesList: {
    gap: spacing.xs,
  },
  rule: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
  },
  examplesTitle: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  exampleContainer: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  exampleRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  exampleTile: {
    width: EXAMPLE_TILE_SIZE,
    height: EXAMPLE_TILE_SIZE,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tiles.default,
  },
  exampleTileText: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    color: colors.neutral.white,
    textAlign: "center",
  },
  explanation: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
  },
  bold: {
    fontFamily: fontFamily.openSans.bold,
  },
  loginHighlight: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
  },
});
