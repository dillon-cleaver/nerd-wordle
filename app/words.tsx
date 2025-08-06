import { ListItem } from "@/components/ListItem";
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
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { useEffect, useCallback } from "react";
import { StyleSheet, View, Text, FlatList, ViewToken } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function Words() {
  // TODO: This is here temporarily --->
  useEffect(() => {
    const results = loadPuzzleResultsLocal();
    console.log("Puzzle history:", results);
  }, []);

  // TODO: Replace this with real data
  const data = new Array(25).fill(0).map((_, index) => ({ id: index }));

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
    [viewableItems]
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Words</Text>
      </View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems}>
            <WordCard />
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.neutral.background,
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
