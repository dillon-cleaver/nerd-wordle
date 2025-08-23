import { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ViewToken,
  ActivityIndicator,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
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
import { useCollectedWords } from "@/hooks/useCollectedWords";

export default function Words() {
  const { collectedWords, loading, error } = useCollectedWords();
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
    [viewableItems]
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.neutral.white} />
        <Text style={styles.loadingText}>Loading your words...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error loading your collected words</Text>
      </View>
    );
  }

  if (collectedWords.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Words</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Complete puzzles to see your collected words here!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>Words ({collectedWords.length})</Text>
      </View>
      <FlatList
        data={collectedWords}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems}>
            <WordCard collectedWordId={item.id} />
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
  listContainer: {
    paddingBottom: spacing.lg,
    width: "100%",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    textAlign: "center",
  },
  emptyText: {
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
});
