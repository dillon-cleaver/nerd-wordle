import { StyleSheet, Text, View } from "react-native";
import { Card } from "./base/Card";
import {
  borderRadius,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  colors,
} from "@/constants/styles";
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
    <Card containerStyle={[styles.container, { borderColor: categoryColor }]}>
      <View style={[styles.content, { borderColor: categoryColor }]}>
        <View style={styles.centered}>
          <Text style={[styles.placeholderText, { color: colors.neutral.white }]}>
            No words collected yet
          </Text>
        </View>
      </View>
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
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    borderWidth: 2,
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
  },
});
