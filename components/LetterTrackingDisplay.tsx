import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GameContext } from "@/context/GameContext";
import {
  colors,
  fontSize,
  fontFamily,
  spacing,
  lineHeight,
} from "@/constants/styles";

export const LetterTrackingDisplay = () => {
  const { letterGuesses, answerEntry } = useContext(GameContext);

  if (letterGuesses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Letter Tracking</Text>
        <Text style={styles.emptyText}>No letters tracked yet</Text>
      </View>
    );
  }

  // Group letters by row
  const lettersByRow = letterGuesses.reduce((acc, guess) => {
    if (!acc[guess.row]) {
      acc[guess.row] = [];
    }
    acc[guess.row].push(guess);
    return acc;
  }, {} as Record<number, typeof letterGuesses>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Letter Tracking</Text>
      <Text style={styles.subtitle}>
        Word: {answerEntry?.id || "Loading..."} | Letters:{" "}
        {letterGuesses.length}
      </Text>

      {Object.entries(lettersByRow)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([rowIndex, rowGuesses]) => (
          <View key={rowIndex} style={styles.row}>
            <Text style={styles.rowLabel}>Row {parseInt(rowIndex) + 1}:</Text>
            <View style={styles.letters}>
              {rowGuesses
                .sort((a, b) => a.position - b.position)
                .map((guess, index) => (
                  <Text key={index} style={styles.letter}>
                    {guess.letter}
                  </Text>
                ))}
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    margin: spacing.sm,
  },
  title: {
    fontSize: fontSize.body.medium,
    lineHeight: lineHeight.body.medium,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.openSans.regular,
    color: colors.neutral.lightGray,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.openSans.regular,
    color: colors.neutral.lightGray,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.openSans.medium,
    color: colors.neutral.white,
    minWidth: 60,
  },
  letters: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  letter: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
    backgroundColor: colors.neutral.darkGray,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
