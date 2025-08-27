import { View, StyleSheet, Text } from "react-native";
import {
  colors,
  spacing,
  fontSize,
  fontFamily,
  borderRadius,
} from "@/constants/styles";
import { BannerCard } from "./BannerCard";
import { useCountdownToNewPuzzle } from "@/utils/countdown";

interface CompletedGameViewProps {
  todayResult: {
    id: string;
    word: string;
    guesses: number; // Number of guesses in this game session
    attempts: number; // Number of times this puzzle has been attempted
    date: string;
    status: "win" | "loss";
    edition?: number;
    hintIndex?: number;
  };
}

export const CompletedGameView = ({ todayResult }: CompletedGameViewProps) => {
  const timeUntilNewPuzzle = useCountdownToNewPuzzle();

  const getStatusMessage = () => {
    if (todayResult.status === "win") {
      const guesses = todayResult.guesses;
      const guessesText = guesses === 1 ? "guess" : "guesses";
      return `🎉 You solved today's puzzle in ${guesses} ${guessesText}!`;
    } else {
      return `😔 You didn't solve today's puzzle. The word was ${todayResult.word}.`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BannerCard />
        <View style={styles.statusContainer}>
          <Text style={styles.completedText}>
            Today&apos;s Puzzle - COMPLETED
          </Text>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
          <Text style={styles.instructionText}>
            Come back tomorrow for a new puzzle!
          </Text>
        </View>
        <View style={styles.gridPlaceholder}>
          <Text style={styles.gridPlaceholderText}>Puzzle grid completed</Text>
          <Text style={styles.gridPlaceholderSubtext}>
            Word: {todayResult.word}
          </Text>
        </View>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeUntilNewPuzzle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    gap: spacing.xl,
    width: "100%",
  },
  content: {
    gap: spacing.xl,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  statusContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  completedText: {
    fontSize: fontSize.body.base,
    color: colors.neutral.white,
    opacity: 0.8,
    fontFamily: fontFamily.openSans.medium,
  },
  statusText: {
    fontSize: fontSize.body.medium,
    color: colors.neutral.white,
    textAlign: "center",
    fontFamily: fontFamily.bitter.bold,
  },
  instructionText: {
    fontSize: fontSize.title.base,
    color: colors.neutral.white,
    opacity: 0.7,
    textAlign: "center",
    marginTop: spacing.sm,
    fontFamily: fontFamily.openSans.regular,
  },
  gridPlaceholder: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.neutral.darkGray,
    borderRadius: borderRadius.md,
    minHeight: 200,
    justifyContent: "center",
  },
  gridPlaceholderText: {
    fontSize: fontSize.body.base,
    color: colors.neutral.white,
    opacity: 0.6,
    fontFamily: fontFamily.openSans.medium,
  },
  gridPlaceholderSubtext: {
    fontSize: fontSize.title.base,
    color: colors.neutral.white,
    opacity: 0.5,
    fontFamily: fontFamily.openSans.regular,
  },
  timerContainer: {
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  timerText: {
    fontSize: fontSize.title.base,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
});
