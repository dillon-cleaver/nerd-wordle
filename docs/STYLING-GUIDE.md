# Styling Guide

Design system and styling patterns for NerdWord components.

## Design Language

Cards and tiles use a **dark gradient background** with **accent borders**, **subtle shadows**, and **light text hierarchy** for consistent depth and contrast.

### Key Patterns

- **Dark gradient fills**: Top-left (lighter) to bottom-right (darker)
- **Accent borders**: Category or semantic color at 2px
- **White text hierarchy**: 100% (primary), 80% (body), 60% (secondary), 50% (muted/links)
- **Shadows**: 8px offset, 24px radius on cards

## Constants Location

All design tokens live in `constants/styles.ts`:

| Token | Purpose |
|-------|---------|
| `colors.wordCard` | Dark card gradient, text hierarchy, badge opacity |
| `colors.tiles` | Tile gradient for LetterBox |
| `gradient` | Shared gradient direction (top-left → bottom-right) |
| `colors.categories` | Category accent colors |
| `shadow.wordCard` | Card shadow (iOS + Android) |
| `borderWidth`, `borderRadius` | Layout constants |

## Shared Components

### SubtleGradient

`components/base/SubtleGradient.tsx` — Reusable gradient fill for dark card/tile backgrounds.

```tsx
<SubtleGradient colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]} />
```

Uses `gradient.startPoint` and `gradient.endPoint` (top-level export, top-left to bottom-right).

### Card

`components/base/Card.tsx` — Base card wrapper. Use with `containerStyle` to override defaults (padding, background, border).

## Components Using This Design

| Component | Gradient | Accent | Notes |
|-----------|----------|--------|-------|
| WordCard | wordCard | Category color | Collected words list |
| GameBanner | wordCard | Success (teal) / Warning (amber) | Win/loss banner |
| LetterBox | tiles.defaultGradient* | — | Empty tile cells |

## Utilities

### hexToRgba

`utils/color.ts` — Converts hex colors to rgba for opacity variants (e.g., badge backgrounds).

```ts
hexToRgba("#ff0200", 0.2) // "rgba(255,2,0,0.2)"
```

## Rules

1. **Use constants** — Avoid hardcoded colors, spacing, or typography
2. **Prefer SubtleGradient** — For new dark card/tile backgrounds
3. **Text on dark backgrounds** — Use `colors.wordCard.textPrimary/Secondary/Muted` or `colors.neutral.white`
