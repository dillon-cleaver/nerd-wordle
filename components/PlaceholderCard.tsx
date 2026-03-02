import { StyleSheet, Text, View } from "react-native";
import { Card } from "./base/Card";
import { SubtleGradient } from "./base/SubtleGradient";
import {
  borderRadius,
  borderWidth,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  colors,
} from "@/constants/styles";
import { getCardOverlayStyle, cardShadowStyle } from "@/utils/cardStyles";
import {
  WORD_CARD_MAX_WIDTH,
  WORD_CARD_MIN_WIDTH,
} from "@/constants/dimensions";

type PlaceholderCardProps = {
  categoryColor: string;
};

export const PlaceholderCard = ({
  categoryColor,
}: PlaceholderCardProps) => {
  return (
    <View style={cardShadowStyle}>
      <Card
        containerStyle={[
          styles.container,
          getCardOverlayStyle(categoryColor),
        ]}
      >
        <SubtleGradient
          colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]}
        />
        <View style={[styles.content, { borderColor: categoryColor }]}>
          <View style={styles.centered}>
            <Text style={styles.placeholderText}>No words collected yet</Text>
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
    flex: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    borderWidth: borderWidth.wordCard,
    borderStyle: "dashed",
    backgroundColor: "transparent",
    minHeight: 150,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    textAlign: "center",
    color: colors.wordCard.textSecondary,
  },
});
