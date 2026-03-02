import { useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ViewToken,
  ActivityIndicator,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { ListItem } from "@/components/ListItem";
import { CategoryCard } from "@/components/CategoryCard";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { useCollectedWords } from "@/hooks/useCollectedWords";
import { getCategoriesWithCounts } from "@/utils/category";
import { useDevice } from "@/hooks/useDevice";

export default function Words() {
  const { collectedWords, loading, error } = useCollectedWords();
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const { isDesktop } = useDevice();

  // Get categories with their word counts
  const categories = useMemo(
    () => getCategoriesWithCounts(collectedWords),
    [collectedWords]
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
    [viewableItems]
  );

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/words/${categoryId}`);
  };

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
      <FlatList
        data={categories}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          isDesktop && styles.listContainerDesktop,
        ]}
        renderItem={({ item }) => (
          <ListItem item={item} viewableItems={viewableItems}>
            <CategoryCard
              category={item}
              onPress={() => handleCategoryPress(item.id)}
            />
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: "100%",
  },
  listContainerDesktop: {
    maxWidth: 600,
    alignSelf: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  emptyText: {
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.regular,
    color: colors.neutral.white,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },
});
