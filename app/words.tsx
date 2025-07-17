import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";
import { WordCard } from "@/components/WordCard";
import {
  WORD_CARD_MAX_WIDTH,
  WORD_CARD_MIN_WIDTH,
} from "@/constants/dimensions";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { getPuzzleResults } from "@/storage/puzzle-results.local";
import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Words() {
  // TODO: This is here temporarily --->
  useEffect(() => {
    const results = getPuzzleResults();
    console.log("Puzzle history:", results);
  }, []);

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
    gap: spacing.md,
  },
  titleTextContainer: {
    width: "100%",
    minWidth: WORD_CARD_MIN_WIDTH,
    maxWidth: WORD_CARD_MAX_WIDTH,
  },
  titleText: {
    fontSize: fontSize.title.large,
    fontFamily: fontFamily.bitter.bold,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
  },
});
