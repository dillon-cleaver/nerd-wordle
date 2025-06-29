import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GameBanner } from "./GameBanner";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { GameContext } from "@/context/GameContext";
import { WordCard } from "./WordCard";
import { spacing } from "@/constants/styles";
import { BannerCard } from "./BannerCard";

export const Game = () => {
  const { category, answer } = useContext(GameContext);

  useEffect(() => {
    console.info({ answer, category });
  }, []);

  return (
    <View style={styles.container}>
      <BannerCard />
      <GuessGrid />
      <Keyboard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xl,
    alignItems: "center",
    width: "100%",
  },
});
