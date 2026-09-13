import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import { SvgIcon } from "./base/SvgIcon";
import {
  colors,
  borderWidth,
  borderRadius,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { opacity } from "@/constants/opacity";
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
import { iconSizes } from "@/constants/icons";

type WordCardProps = {
  collectedWord: CollectedWord;
  /**
   * Locked cards are shown after a failed attempt — grayed out with a lock
   * overlay and a "Not Collected" label. They are never added to collection.
   */
  variant?: "collected" | "locked";
};

export const WordCard = ({
  collectedWord,
  variant = "collected",
}: WordCardProps) => {
  const { wordEntry, category, completedDate, editionNumber } = collectedWord;
  const answer = wordEntry.id;
  const isLocked = variant === "locked";

  const summary = getSummaryForWord(wordEntry);
  const accentColor = isLocked
    ? colors.neutral.darkGray
    : getCategoryColor(category);
  const formattedCategory = convertCategory(category);
  const badgeAccent = isLocked ? colors.neutral.darkGray : accentColor;
  const badgeBorder = isLocked ? colors.neutral.lightGray : accentColor;
  const badgeLabel = isLocked ? "Not Collected" : formattedCategory;
  const badgeTextColor = isLocked
    ? colors.wordCard.textSecondary
    : accentColor;

  const handleWikipediaPress = () => {
    if (wordEntry.wikipediaUrl) {
      Linking.openURL(wordEntry.wikipediaUrl);
    }
  };

  const formattedDate = getShortDateString(completedDate);

  return (
    <View style={[cardShadowStyle, isLocked && styles.lockedCard]}>
      <Card
        containerStyle={[styles.container, getCardOverlayStyle(accentColor)]}
      >
        <SubtleGradient
          colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]}
        />
        <View style={[styles.content, isLocked && styles.lockedContent]}>
          <View style={styles.answerEditionRow}>
            <Text style={[styles.answerText, isLocked && styles.lockedText]}>
              {answer}
            </Text>
            <View style={styles.editionDateBlock}>
              <Text
                style={[styles.editionText, isLocked && styles.lockedText]}
              >
                #{editionNumber}
              </Text>
              <Text style={[styles.dateText, isLocked && styles.lockedMuted]}>
                {formattedDate}
              </Text>
            </View>
          </View>

          <Text style={[styles.summaryText, isLocked && styles.lockedMuted]}>
            {summary}
          </Text>

          <View style={styles.wikipediaSection}>
            <Pressable onPress={handleWikipediaPress}>
              <Text style={[styles.linkText, isLocked && styles.lockedMuted]}>
                Wikipedia →
              </Text>
            </Pressable>
          </View>

          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: hexToRgba(
                    badgeAccent,
                    colors.wordCard.badgeBackgroundOpacity
                  ),
                  borderColor: hexToRgba(
                    badgeBorder,
                    colors.wordCard.badgeBorderOpacity
                  ),
                },
              ]}
            >
              <Text style={[styles.categoryText, { color: badgeTextColor }]}>
                {badgeLabel}
              </Text>
            </View>
          </View>
        </View>

        {isLocked && (
          <View
            style={styles.lockOverlay}
            pointerEvents="none"
            accessible
            accessibilityRole="image"
            accessibilityLabel="Locked — word not collected"
          >
            <View style={styles.lockBadge}>
              <SvgIcon
                name="lock"
                size={iconSizes.large}
                color={colors.neutral.lightGray}
              />
            </View>
          </View>
        )}
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
  lockedCard: {
    opacity: opacity.subtle,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  lockedContent: {
    opacity: opacity.pressed,
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
    flexShrink: 1,
    paddingRight: spacing.sm,
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
  lockedText: {
    color: colors.wordCard.textSecondary,
  },
  lockedMuted: {
    color: colors.wordCard.textMuted,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: hexToRgba(colors.neutral.background, opacity.pressed),
  },
  lockBadge: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: (spacing.xl + spacing.sm) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
    borderWidth: borderWidth.badge,
    borderColor: colors.wordCard.divider,
  },
});
