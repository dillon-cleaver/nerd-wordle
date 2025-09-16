import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { Card } from "./base/Card";
import { SvgIcon } from "./base/SvgIcon";
import {
  borderRadius,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { iconSizes } from "@/constants/icons";
import {
  WORD_CARD_MAX_WIDTH,
  WORD_CARD_MIN_WIDTH,
} from "@/constants/dimensions";
import {
  getCategoryColor,
  getCategoryTextColor,
  getSummaryForWord,
  convertCategory,
} from "@/utils/game";
import { CollectedWord } from "@/hooks/useCollectedWords";
import { getShortDateString } from "@/utils/time";

type WordCardProps = {
  collectedWord: CollectedWord;
};

export const WordCard = ({ collectedWord }: WordCardProps) => {
  const { wordEntry, category, completedDate, editionNumber } = collectedWord;
  const answer = wordEntry.id;

  const summary = getSummaryForWord(wordEntry);
  const tileBackgroundColor = getCategoryColor(category);
  const textColor = getCategoryTextColor(category);

  // Format the category display name
  const formattedCategory = convertCategory(category);

  const handleWikipediaPress = () => {
    if (wordEntry.wikipediaUrl) {
      Linking.openURL(wordEntry.wikipediaUrl);
    }
  };

  // Format date as MM/DD/YY using timezone-aware utility
  const formattedDate = getShortDateString(completedDate);

  return (
    <Card
      containerStyle={[styles.container, { borderColor: tileBackgroundColor }]}
    >
      <Card
        containerStyle={[
          styles.content,
          { backgroundColor: tileBackgroundColor },
        ]}
      >
        <View style={styles.answerEditionRow}>
          <Text style={[styles.answerText, { color: textColor }]}>
            {answer}
          </Text>
          <View>
            <Text style={[styles.editionText, { color: textColor }]}>
              #{editionNumber}
            </Text>
            <Text style={[styles.dateText, { color: textColor }]}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <Text style={[styles.summaryText, { color: textColor }]}>
          {summary}
        </Text>
        <Pressable onPress={handleWikipediaPress}>
          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, { color: textColor }]}>
              Wikipedia
            </Text>
            <SvgIcon
              name="chevron-right"
              size={iconSizes.small}
              color={textColor}
            />
          </View>
        </Pressable>
        <Text style={[styles.categoryText, { color: textColor }]}>
          {formattedCategory}
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
  linkText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
});
