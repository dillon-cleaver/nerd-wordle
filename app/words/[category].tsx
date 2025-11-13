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
import { useLocalSearchParams } from "expo-router";
import { ListItem } from "@/components/ListItem";
import { WordCard } from "@/components/WordCard";
import { PlaceholderCard } from "@/components/PlaceholderCard";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { useCollectedWords } from "@/hooks/useCollectedWords";
import { getCategoryById } from "@/utils/category";

export default function CategoryWords() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
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

  // Get the category data
  const categoryData = getCategoryById(categoryId || "", collectedWords);

  if (!categoryData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  const { words, displayName, backgroundColor } = categoryData;

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.categoryTitle}>{displayName}</Text>
        </View>
        <View style={styles.centered}>
          <PlaceholderCard
            categoryColor={backgroundColor === "rainbow" ? colors.neutral.white : backgroundColor}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.categoryTitle}>{displayName}</Text>
        <Text style={styles.wordCountText}>
          {words.length} {words.length === 1 ? "word" : "words"}
        </Text>
      </View>
      <FlatList
        data={words}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems}>
            <WordCard collectedWord={item} />
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
  headerContainer: {
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryTitle: {
    fontSize: fontSize.title.xLarge,
    lineHeight: lineHeight.title.xLarge,
    fontFamily: fontFamily.bitter.bold,
    color: colors.neutral.white,
  },
  wordCountText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
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
    width: "100%",
  },
  loadingText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    textAlign: "center",
  },
});
