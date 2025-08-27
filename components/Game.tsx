import { useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { GameContext } from "@/context/GameContext";
import { colors, spacing } from "@/constants/styles";
import { BannerCard } from "./BannerCard";
import { useCountdownToNewPuzzle } from "@/utils/countdown";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

export const Game = () => {
  const { category, answer, isLoading } = useContext(GameContext);
  const timeUntilNewPuzzle = useCountdownToNewPuzzle();

  useEffect(() => {
    if (isDebugLoggingEnabled()) {
      console.info({ answer, category });
    }
  }, [answer, category]);

  // If loading, show empty container to prevent flashing
  if (isLoading) {
    return <View style={styles.container} />;
  }

  // Always show the active game view with banner + grid + keyboard
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BannerCard />
        <GuessGrid />
      </View>
      <View style={styles.keyboardContainer}>
        <Keyboard />
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
  keyboardContainer: {
    paddingHorizontal: spacing.sm,
  },
  timerContainer: {
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  // TODO: Stylize this
  timerText: {
    fontSize: 14,
    opacity: 0.7,
    color: colors.neutral.white,
  },
});
