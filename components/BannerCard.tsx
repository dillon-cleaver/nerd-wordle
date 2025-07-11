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
import { getHintForWord } from "@/utils/game";

export const BannerCard = () => {
  const { gameStatus, guesses, answer, category, originalCategory } =
    useContext(GameContext);

  const hint = getHintForWord(answer, originalCategory);

  return gameStatus === "running" ? (
    <View style={styles.content}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.hint}>{hint}</Text>
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
    gap: spacing.xs,
    marginLeft: -spacing.md,
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
