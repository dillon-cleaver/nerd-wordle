import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";
import { WordCard } from "@/components/WordCard";
import { WORD_CARD_MAX_WIDTH } from "@/constants/dimensions";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { StyleSheet, View, Text } from "react-native";

export default function Words() {
  return (
    <BaseSafeAreaView addStyles={styles.container} edges={[]}>
      <View style={styles.content}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Words</Text>
        </View>
        <WordCard />
      </View>
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.neutral.background,
  },
  content: {
    alignItems: "center",
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  titleTextContainer: {
    width: "100%",
    maxWidth: WORD_CARD_MAX_WIDTH,
  },
  titleText: {
    fontSize: fontSize.title.xLarge,
    fontFamily: fontFamily.bitter.bold,
    lineHeight: lineHeight.title.xLarge,
    color: colors.neutral.white,
  },
});
