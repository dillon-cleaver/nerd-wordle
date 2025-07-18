import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { GameContext } from "@/context/GameContext";
import { spacing } from "@/constants/styles";
import { BannerCard } from "./BannerCard";

export const Game = () => {
  const { category, answer } = useContext(GameContext);

  useEffect(() => {
    console.info({ answer, category });
  }, [answer, category]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BannerCard />
        <GuessGrid />
      </View>
      <View style={styles.keyboardContainer}>
        <Keyboard />
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
});
