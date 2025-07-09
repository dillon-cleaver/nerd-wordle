import { StyleSheet, Text } from "react-native";
import { Card } from "./base/Card";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
} from "@/constants/styles";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import {
  WORD_CARD_GUESS_GRID_MAX_WIDTH,
  WORD_CARD_GUESS_GRID_MIN_WIDTH,
} from "@/constants/dimensions";

export const WordCard = () => {
  const { category } = useContext(GameContext);

  return (
    <Card addStyles={styles.container}>
      <Card addStyles={styles.content}>
        <Text style={styles.categoryText}>{category}</Text>
      </Card>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: WORD_CARD_GUESS_GRID_MIN_WIDTH,
    maxWidth: WORD_CARD_GUESS_GRID_MAX_WIDTH,
    width: "100%",
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  content: {
    borderRadius: borderRadius.sm,
    flex: 1,
    backgroundColor: colors.categories.science,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    fontFamily: fontFamily.bitter.bold,
  },
});
