import { StyleSheet, Text, View } from "react-native";
import { Card } from "./base/Card";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import {
  WORD_CARD_MAX_WIDTH,
  WORD_CARD_MIN_WIDTH,
} from "@/constants/dimensions";
import {
  getCategoryColor,
  getCategoryTextColor,
  getHintForWord,
  getSummaryForWord,
} from "@/utils/game";

export const WordCard = () => {
  const { category, answer, originalCategory } = useContext(GameContext);

  const hint = getHintForWord(answer, originalCategory);
  const summary = getSummaryForWord(answer, originalCategory);
  const tileBackgroundColor = getCategoryColor(originalCategory);
  const textColor = getCategoryTextColor(originalCategory);

  // TODO: Make edition number dynamic
  // TODO: Make date dynamic and store on the card

  // Format date as MM/DD/YY
  const today = new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(today.getDate()).padStart(2, "0")}/${String(
    today.getFullYear()
  ).slice(-2)}`;

  return (
    <Card addStyles={styles.container}>
      <Card
        addStyles={[styles.content, { backgroundColor: tileBackgroundColor }]}
      >
        <View style={styles.answerEditionRow}>
          <Text style={[styles.answerText, { color: textColor }]}>
            {answer}
          </Text>
          <View>
            <Text style={[styles.editionText, { color: textColor }]}>#123</Text>
            <Text style={[styles.dateText, { color: textColor }]}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <Text style={[styles.hintText, { color: textColor }]}>{hint}</Text>
        <Text style={[styles.summaryText, { color: textColor }]}>
          {summary}
        </Text>
        <Text style={[styles.categoryText, { color: textColor }]}>
          {category}
        </Text>
      </Card>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: WORD_CARD_MIN_WIDTH,
    maxWidth: WORD_CARD_MAX_WIDTH,
    width: "100%",
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    gap: spacing.md,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  answerEditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  answerText: {
    fontSize: fontSize.title.xLarge,
    lineHeight: lineHeight.title.xLarge,
    fontFamily: fontFamily.bitter.bold,
  },
  editionText: {
    fontSize: fontSize.title.xLarge,
    lineHeight: lineHeight.title.xLarge,
    fontFamily: fontFamily.bitter.bold,
  },
  dateText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
  },
  hintText: {
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    fontFamily: fontFamily.bitter.italic,
  },
  summaryText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
  },
  categoryText: {
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
});
