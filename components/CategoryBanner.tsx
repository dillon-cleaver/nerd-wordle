import { MOBILE_BANNER_GUESS_GRID_MIN_WIDTH, DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH } from "@/constants/dimensions";
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
import { useDevice } from "@/hooks/useDevice";

export const CategoryBanner = () => {
  const { answerEntry, originalCategory, category } = useContext(GameContext);
  const { isDesktop } = useDevice();

  const hint = getHintForWord(answerEntry, originalCategory);

  const contentStyle = [
    styles.content,
    {
      minWidth: isDesktop 
        ? DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH 
        : MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
    },
  ];

  return (
    <View style={contentStyle}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
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
