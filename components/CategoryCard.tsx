import { StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import {
  borderRadius,
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { getCardOverlayStyle, cardShadowStyle } from "@/utils/cardStyles";
import { CategoryInfo, getRainbowGradientColors } from "@/utils/category";
import { opacity } from "@/constants/opacity";

type CategoryCardProps = {
  category: CategoryInfo;
  onPress: () => void;
};

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const { displayName, accentColor, isRainbow, wordCount } = category;

  const cardContent = (
    <>
      <SubtleGradient
        colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]}
      />
      <View style={styles.content}>
        <View style={styles.nameCountRow}>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.countText}>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? opacity.pressed : 1 },
      ]}
    >
      <View style={cardShadowStyle}>
        {isRainbow ? (
          <LinearGradient
            colors={getRainbowGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rainbowBorder}
          >
            <Card containerStyle={styles.rainbowInnerCard}>
              {cardContent}
            </Card>
          </LinearGradient>
        ) : (
          <Card
            containerStyle={[
              styles.container,
              getCardOverlayStyle(accentColor),
            ]}
          >
            {cardContent}
          </Card>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  container: {
    borderWidth: borderWidth.wordCard,
    borderRadius: borderRadius.card,
  },
  rainbowBorder: {
    borderRadius: borderRadius.card,
    padding: borderWidth.wordCard,
  },
  rainbowInnerCard: {
    borderRadius: borderRadius.card - borderWidth.wordCard,
    overflow: "hidden",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  nameCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  nameText: {
    flex: 1,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
  },
  countText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    flexShrink: 0,
    color: colors.wordCard.textSecondary,
  },
});
