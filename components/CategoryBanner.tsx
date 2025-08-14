import { BANNER_GUESS_GRID_MIN_WIDTH } from "@/constants/dimensions";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { GameContext } from "@/context/GameContext";
import { getHintForWord } from "@/utils/game";
import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";

export const CategoryBanner = () => {
  const { answerEntry, originalCategory, category } = useContext(GameContext);

  const hint = getHintForWord(answerEntry, originalCategory);

  return (
    <View style={styles.content}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    minWidth: BANNER_GUESS_GRID_MIN_WIDTH,
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
