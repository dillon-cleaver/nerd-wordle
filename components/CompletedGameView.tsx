import { View, StyleSheet, Text } from "react-native";
import { colors, spacing } from "@/constants/styles";
import { BannerCard } from "./BannerCard";
import { useCountdownToNewPuzzle } from "@/utils/countdown";

interface CompletedGameViewProps {
  todayResult: {
    id: string;
    word: string;
    attempts: number;
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
      const attempts = todayResult.attempts;
      const attemptsText = attempts === 1 ? "guess" : "guesses";
      return `🎉 You solved today&apos;s puzzle in ${attempts} ${attemptsText}!`;
    } else {
      return `😔 You didn&apos;t solve today&apos;s puzzle. The word was ${todayResult.word}.`;
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral.white,
    opacity: 0.8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.neutral.white,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    color: colors.neutral.white,
    opacity: 0.7,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  gridPlaceholder: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.neutral.darkGray,
    borderRadius: 8,
    minHeight: 200,
    justifyContent: "center",
  },
  gridPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.neutral.white,
    opacity: 0.6,
  },
  gridPlaceholderSubtext: {
    fontSize: 14,
    color: colors.neutral.white,
    opacity: 0.5,
  },
  timerContainer: {
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  timerText: {
    fontSize: 14,
    opacity: 0.7,
    color: colors.neutral.white,
  },
});
