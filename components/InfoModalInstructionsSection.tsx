import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";

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
      <Text style={styles.subtitle}>Guess the NerdWord 🤓 in 6 tries.</Text>

      <View style={styles.rulesList}>
        <Text style={styles.rule}>
          • Each guess must be a valid 5-letter word.
        </Text>
        <Text style={styles.rule}>
          • The color of the tiles will change to show how close your guess was
          to the word.
        </Text>
      </View>

      <Text style={styles.examplesTitle}>Examples</Text>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="W" isCorrect={true} isPresent={false} />
          <ExampleTile letter="O" isCorrect={false} isPresent={false} />
          <ExampleTile letter="R" isCorrect={false} isPresent={false} />
          <ExampleTile letter="D" isCorrect={false} isPresent={false} />
          <ExampleTile letter="Y" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>W</Text> is in the word and in the correct
          spot.
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="L" isCorrect={false} isPresent={false} />
          <ExampleTile letter="I" isCorrect={false} isPresent={true} />
          <ExampleTile letter="G" isCorrect={false} isPresent={false} />
          <ExampleTile letter="H" isCorrect={false} isPresent={false} />
          <ExampleTile letter="T" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>I</Text> is in the word but in the wrong
          spot.
        </Text>
      </View>

      <View style={styles.exampleContainer}>
        <View style={styles.exampleRow}>
          <ExampleTile letter="R" isCorrect={false} isPresent={false} />
          <ExampleTile letter="O" isCorrect={false} isPresent={false} />
          <ExampleTile letter="G" isCorrect={false} isPresent={false} />
          <ExampleTile letter="U" isCorrect={false} isPresent={false} />
          <ExampleTile letter="E" isCorrect={false} isPresent={false} />
        </View>
        <Text style={styles.explanation}>
          <Text style={styles.bold}>U</Text> is not in the word in any spot.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsSection: {
    gap: spacing.md,
    alignSelf: "stretch",
  },
  subtitle: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
    marginBottom: spacing.sm,
  },
  rulesList: {
    gap: spacing.sm,
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
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  exampleContainer: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  exampleRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  exampleTile: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tiles.default,
  },
  exampleTileText: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: 14,
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
});
