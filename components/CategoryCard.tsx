import { StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  borderRadius,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { CategoryInfo, getRainbowGradientColors } from "@/utils/category";
import { opacity } from "@/constants/opacity";

type CategoryCardProps = {
  category: CategoryInfo;
  onPress: () => void;
};

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const { displayName, backgroundColor, textColor, wordCount } = category;
  const isRainbow = backgroundColor === "rainbow";

  const content = (
    <View style={styles.content}>
      <View style={styles.nameCountRow}>
        <Text style={[styles.nameText, { color: textColor }]}>
          {displayName}
        </Text>
        <Text style={[styles.countText, { color: textColor }]}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </Text>
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? opacity.pressed : 1 },
      ]}
    >
      {isRainbow ? (
        <LinearGradient
          colors={getRainbowGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientContent]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.solidContent, { backgroundColor }]}>
          {content}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  gradientContent: {
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  solidContent: {
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  content: {
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
  },
  countText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    flexShrink: 0,
  },
});
