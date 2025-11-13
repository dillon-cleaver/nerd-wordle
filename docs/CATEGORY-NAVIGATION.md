# Category-Based Words Navigation

## Overview

The Words route has been redesigned to use a category-based navigation system. Instead of showing a long list of all collected words, users now see a list of categories and can tap into each to view words from that specific category.

## User Experience

### Main Words Screen (`/words`)

The main words screen displays a vertical list of category cards:

1. **All Category** (Special)
   - Displayed at the top of the list
   - Shows total count of all collected words
   - Features a rainbow gradient background
   - Tapping shows all collected words across all categories

2. **Individual Categories**
   - Each category is displayed as a full-width card
   - Background color matches the category's theme color
   - Shows the count of collected words in that category
   - Categories displayed:
     - Video Games (Pink - #FF659A)
     - Superheroes (Purple - #35009A)
     - Fantasy and Sci-Fi (Green - #059901)
     - Anime and Manga (Orange - #FF9901)
     - Science (Purple - #CD66FF)
     - Movies (Red - #FF0200)
     - Literature (Magenta - #99019A)
     - Tabletop and Board Games (Yellow - #FFFF00)
     - Tech and Internet Culture (Cyan - #0199CC)

### Category Detail Screen (`/words/[category]`)

When a user taps on a category:

1. **Header**
   - Shows the category display name
   - Shows word count for that category

2. **Word List**
   - Displays all words from that category using the existing `WordCard` component
   - Words appear in reverse chronological order (newest first)
   - Same animated list behavior as before

3. **Empty State**
   - If no words have been collected in that category
   - Shows a placeholder card with dashed border
   - Border color matches the category theme
   - Displays "No words collected yet" message

## Technical Implementation

### New Files

1. **`utils/category.ts`**
   - `getCategoriesWithCounts()`: Generates category info with word counts
   - `getCategoryById()`: Retrieves a specific category's data
   - `getRainbowGradientColors()`: Returns colors for the rainbow gradient
   - `CategoryInfo` type: Defines the structure of category data

2. **`components/CategoryCard.tsx`**
   - Displays a category with colored background
   - Supports both solid colors and rainbow gradient
   - Handles press events for navigation
   - Applies opacity on press for feedback

3. **`components/PlaceholderCard.tsx`**
   - Shows empty state when no words collected in a category
   - Features dashed border matching category color
   - Same dimensions as regular word cards

4. **`app/words/index.tsx`** (Moved from `app/words.tsx`)
   - Main category list screen
   - Uses `getCategoriesWithCounts()` to build category list
   - Navigates to category detail on tap

5. **`app/words/[category].tsx`** (New)
   - Dynamic route for category detail
   - Uses `useLocalSearchParams()` to get category ID
   - Displays words filtered by category
   - Shows placeholder when empty

### Modified Files

1. **`constants/opacity.ts`**
   - Added `pressed: 0.7` for touchable feedback

### Dependencies Added

- `expo-linear-gradient`: For rainbow gradient on "All" category

## Navigation Flow

```
/words (Category List)
  ├─ All → /words/all (All collected words)
  ├─ Video Games → /words/videoGames
  ├─ Superheroes → /words/superheroes
  ├─ Fantasy and Sci-Fi → /words/fantasyAndSciFi
  ├─ Anime and Manga → /words/animeAndManga
  ├─ Science → /words/science
  ├─ Movies → /words/movies
  ├─ Literature → /words/literature
  ├─ Tabletop and Board Games → /words/tabletopAndBoardGames
  └─ Tech and Internet Culture → /words/techAndInternetCulture
```

## Design Tokens

The implementation reuses existing design tokens:

- **Colors**: From `constants/styles.ts` → `colors.categories.*`
- **Typography**: Bitter Bold for headings, Bitter Regular for body text
- **Spacing**: Consistent with existing card layouts
- **Border Radius**: Same as WordCard component
- **Card Dimensions**: Uses `WORD_CARD_MIN_WIDTH` and `WORD_CARD_MAX_WIDTH`

## Backward Compatibility

- The `WordCard` component remains unchanged
- The `useCollectedWords` hook is still used
- All existing color and typography constants are preserved
- The navigation structure is additive (no breaking changes)

## Testing Considerations

When testing this feature:

1. **Empty State**: Test with a new user who has no collected words
2. **Single Category**: Test with words in only one category
3. **All Categories**: Test with words distributed across all categories
4. **Rainbow Gradient**: Verify the "All" category displays correctly
5. **Navigation**: Ensure smooth transitions between screens
6. **Loading States**: Verify loading indicators work correctly
7. **Error States**: Test error handling when word data fails to load

## Future Enhancements

Potential improvements for future iterations:

1. Category statistics (e.g., completion percentage)
2. Filtering/sorting options within categories
3. Search functionality across categories
4. Category achievement badges
5. Animations for category transitions
6. Favorites/bookmarking system
