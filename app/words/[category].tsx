import { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ViewToken,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useLocalSearchParams, router } from "expo-router";
import { ListItem } from "@/components/ListItem";
import { WordCard } from "@/components/WordCard";
import { PlaceholderCard } from "@/components/PlaceholderCard";
import { SvgIcon } from "@/components/base/SvgIcon";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { iconSizes } from "@/constants/icons";
import { useCollectedWords } from "@/hooks/useCollectedWords";
import { getCategoryById } from "@/utils/category";
import { useDevice } from "@/hooks/useDevice";

export default function CategoryWords() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const { collectedWords, loading, error } = useCollectedWords();
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const { isDesktop } = useDevice();

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

  const { words, displayName, accentColor } = categoryData;

  if (words.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.navigate("/words")}
            style={styles.backButton}
            accessibilityLabel="Go back to words list"
            accessibilityRole="button"
          >
            <SvgIcon
              name="chevron-left"
              size={iconSizes.large}
              color={colors.neutral.white}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.categoryTitle}>{displayName}</Text>
            <Text style={styles.wordCountText}>0 words</Text>
          </View>
        </View>
        <View style={styles.centered}>
          <PlaceholderCard categoryColor={accentColor} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.navigate("/words")}
          style={styles.backButton}
          accessibilityLabel="Go back to words list"
          accessibilityRole="button"
        >
          <SvgIcon
            name="chevron-left"
            size={iconSizes.large}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.categoryTitle}>{displayName}</Text>
          <Text style={styles.wordCountText}>
            {words.length} {words.length === 1 ? "word" : "words"}
          </Text>
        </View>
      </View>
      <FlatList
        data={words}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          isDesktop && styles.listContainerDesktop,
        ]}
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
    backgroundColor: colors.neutral.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    marginRight: iconSizes.large + spacing.xs * 2, // Balance the back button
  },
  categoryTitle: {
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
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
    paddingHorizontal: spacing.md,
    width: "100%",
    alignItems: "center",
  },
  listContainerDesktop: {
    maxWidth: 600,
    alignSelf: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.md,
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
