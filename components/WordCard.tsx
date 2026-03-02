import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import {
  colors,
  borderWidth,
  borderRadius,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import {
  getCardOverlayStyle,
  cardShadowStyle,
} from "@/utils/cardStyles";
import {
  WORD_CARD_MAX_WIDTH,
  WORD_CARD_MIN_WIDTH,
} from "@/constants/dimensions";
import {
  getCategoryColor,
  getSummaryForWord,
  convertCategory,
} from "@/utils/game";
import { CollectedWord } from "@/hooks/useCollectedWords";
import { getShortDateString } from "@/utils/time";
import { hexToRgba } from "@/utils/color";

type WordCardProps = {
  collectedWord: CollectedWord;
};

export const WordCard = ({ collectedWord }: WordCardProps) => {
  const { wordEntry, category, completedDate, editionNumber } = collectedWord;
  const answer = wordEntry.id;

  const summary = getSummaryForWord(wordEntry);
  const accentColor = getCategoryColor(category);
  const formattedCategory = convertCategory(category);

  const handleWikipediaPress = () => {
    if (wordEntry.wikipediaUrl) {
      Linking.openURL(wordEntry.wikipediaUrl);
    }
  };

  const formattedDate = getShortDateString(completedDate);

  return (
    <View style={cardShadowStyle}>
      <Card
        containerStyle={[styles.container, getCardOverlayStyle(accentColor)]}
      >
        <SubtleGradient
          colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]}
        />
        <View style={styles.content}>
          <View style={styles.answerEditionRow}>
            <Text style={styles.answerText}>{answer}</Text>
            <View style={styles.editionDateBlock}>
              <Text style={styles.editionText}>#{editionNumber}</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>

          <Text style={styles.summaryText}>{summary}</Text>

          <View style={styles.wikipediaSection}>
            <Pressable onPress={handleWikipediaPress}>
              <Text style={styles.linkText}>Wikipedia →</Text>
            </Pressable>
          </View>

          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: hexToRgba(
                    accentColor,
                    colors.wordCard.badgeBackgroundOpacity
                  ),
                  borderColor: hexToRgba(
                    accentColor,
                    colors.wordCard.badgeBorderOpacity
                  ),
                },
              ]}
            >
              <Text style={[styles.categoryText, { color: accentColor }]}>
                {formattedCategory}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: WORD_CARD_MIN_WIDTH,
    maxWidth: WORD_CARD_MAX_WIDTH,
    width: "100%",
    borderWidth: borderWidth.wordCard,
    borderRadius: borderRadius.card,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  answerEditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  answerText: {
    fontSize: fontSize.title.xLarge,
    lineHeight: lineHeight.title.xLarge,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
  },
  editionDateBlock: {
    alignItems: "flex-end",
  },
  editionText: {
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
  },
  dateText: {
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    fontFamily: fontFamily.bitter.medium,
    color: colors.wordCard.textSecondary,
  },
  summaryText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.medium,
    color: colors.wordCard.textPrimary,
    marginBottom: spacing.md,
  },
  wikipediaSection: {
    borderTopWidth: borderWidth.divider,
    borderTopColor: colors.wordCard.divider,
    paddingTop: spacing.smMd,
  },
  linkText: {
    fontSize: fontSize.body.small,
    fontFamily: fontFamily.bitter.medium,
    color: colors.wordCard.textMuted,
  },
  badgeContainer: {
    marginTop: spacing.smMd,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.smMd,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: borderWidth.badge,
  },
  categoryText: {
    fontSize: fontSize.body.small,
    fontFamily: fontFamily.bitter.bold,
  },
});
