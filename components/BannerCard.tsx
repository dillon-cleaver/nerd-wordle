import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

export const BannerCard = () => {
  const { gameStatus, guesses, answer, category } = useContext(GameContext);

  // TODO: Make the hints dynamic
  return gameStatus === "running" ? (
    <View style={styles.content}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.hint}>
        Even Heisenberg couldn’t pin this one down exactly.
      </Text>
    </View>
  ) : (
    <GameBanner
      gameStatus={gameStatus}
      numGuesses={guesses.length}
      answer={answer}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  category: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
  },
  hint: {
    fontFamily: fontFamily.bitter.italic,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
  },
});
