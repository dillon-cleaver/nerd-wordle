# Update UI to Apple Liquid Glass Design Language

## Summary

Adopt Apple's **Liquid Glass** design language (introduced at WWDC 2025 for iOS 26 / macOS Tahoe) across the NerdWord app. This involves replacing the current opaque dark gradient card/tile aesthetic with translucent, frosted-glass surfaces that blur and tint the content behind them, giving the UI a modern, layered feel while preserving the existing dark theme and category color system.

## Motivation

- Apple's Liquid Glass is the new standard design vocabulary starting with iOS 26. Adopting it keeps NerdWord visually current and native-feeling on Apple platforms.
- The existing design system already uses layered cards with gradients and shadows — Liquid Glass extends this with real translucency, making the hierarchy more dynamic.
- The current codebase has **no blur or translucency effects** (`expo-blur` is not installed), so this is a net-new visual capability.

## Scope

### New Dependency

- **`expo-blur`** — provides `<BlurView>` for iOS/Android/web frosted-glass effect.

### Design Token Changes (`constants/styles.ts`)

Add a new `glass` token group alongside the existing `colors`, `gradient`, and `shadow` exports:

```ts
const glass = {
  /** BlurView intensity (0–100). Higher = more frosted. */
  intensity: 40,
  /** Tint style for BlurView */
  tint: "dark" as const,
  /** Semi-transparent overlay on top of blur */
  overlay: "rgba(30, 33, 43, 0.45)",
  /** Border for glass surfaces — subtle white edge catch */
  border: "rgba(255, 255, 255, 0.12)",
  /** Thicker border variant for highlighted glass (win/loss states) */
  borderAccent: "rgba(255, 255, 255, 0.25)",
  /** Inner highlight gradient (simulates light refraction) */
  highlightStart: "rgba(255, 255, 255, 0.08)",
  highlightEnd: "rgba(255, 255, 255, 0.0)",
} as const;
```

### New Base Component: `GlassCard`

Create `components/base/GlassCard.tsx` — a drop-in companion to `SubtleGradient` that wraps `<BlurView>` with the glass overlay, border, and inner highlight gradient.

**Props:**
- `intensity?: number` (default from `glass.intensity`)
- `tint?: "light" | "dark" | "default"` (default from `glass.tint`)
- `accentColor?: string` (optional border tint, e.g., category color)
- `children: ReactNode`
- `style?: StyleProp<ViewStyle>`

### Components to Update

| Component | Current Approach | Liquid Glass Update |
|-----------|-----------------|---------------------|
| **WordCard** | `SubtleGradient` + opaque 2px category border | `GlassCard` with category-tinted border; blur reveals list background |
| **GameBanner** | `SubtleGradient` + success/warning border | `GlassCard` with semantic-colored accent border |
| **LetterBox** (empty) | `SubtleGradient` with tile gradient | `GlassCard` at lower intensity (~20) for subtle glass on empty tiles |
| **BaseModal** | Opaque `#1e212b` background + `rgba(0,0,0,0.6)` backdrop | `GlassCard` modal content + backdrop blur via `BlurView` behind scrim |
| **Keyboard keys** | Opaque `lightGray` background | Semi-transparent glass keys with light tint |
| **HintModal / InfoModal** | Inherits from `BaseModal` | Inherits glass modal treatment |

### Background & Layout Changes

- **`BaseSafeAreaView`** — Consider a subtle background pattern or gradient so that glass surfaces have something to refract against (a solid `#1e212b` background won't showcase blur).
- **`app/_layout.tsx`** — Navigation header can adopt a glass toolbar style via `headerTransparent: true` + `BlurView` header background.

### Animation Considerations

- Glass surfaces should animate smoothly with existing `react-native-reanimated` transitions.
- `FadeInUp` on `Game.tsx` should work with glass cards without visual artifacts.
- Consider adding a subtle scale/opacity transition on `GlassCard` mount for a polished feel.

### Color Adjustments

The current text hierarchy (`textPrimary: 0.8`, `textSecondary: 0.6`, `textMuted: 0.5`) may need slight opacity bumps to maintain readability on translucent backgrounds. Test and adjust as needed.

### Accessibility

- Ensure sufficient contrast ratios (WCAG AA) on glass surfaces — the blur overlay should be dark enough for white text.
- Respect `prefers-reduced-transparency` / `accessibilityReduceTransparency` — fall back to the current opaque `SubtleGradient` when the user has transparency disabled.
- Maintain existing `accessibilityRole` and `accessibilityLabel` attributes on all updated components.

## Files Affected

| File | Change Type |
|------|-------------|
| `package.json` | Add `expo-blur` dependency |
| `constants/styles.ts` | Add `glass` token group |
| `components/base/GlassCard.tsx` | **New** — glass surface base component |
| `components/base/SubtleGradient.tsx` | No change (kept as fallback for reduced-transparency) |
| `components/base/BaseModal.tsx` | Replace opaque background with `GlassCard`; add backdrop blur |
| `components/base/Card.tsx` | May wrap or integrate `GlassCard` as an option |
| `components/WordCard.tsx` | Swap `SubtleGradient` → `GlassCard` |
| `components/GameBanner.tsx` | Swap `SubtleGradient` → `GlassCard` |
| `components/LetterBox.tsx` | Use `GlassCard` for empty tiles |
| `components/Keyboard.tsx` | Glass key styling |
| `components/base/BaseSafeAreaView.tsx` | Background enhancement for blur effect |
| `app/_layout.tsx` | Glass navigation header |
| `utils/cardStyles.ts` | Update `getCardOverlayStyle` for glass borders |
| `docs/STYLING-GUIDE.md` | Document Liquid Glass patterns and `GlassCard` usage |

## Implementation Plan

1. **Install `expo-blur`** and verify it works on web + iOS + Android.
2. **Add `glass` tokens** to `constants/styles.ts`.
3. **Build `GlassCard` base component** with blur, overlay, border, and highlight.
4. **Add accessibility fallback** — detect reduced-transparency preference, fall back to `SubtleGradient`.
5. **Update `BaseModal`** — glass content container + backdrop blur.
6. **Update `WordCard` and `GameBanner`** — swap gradient for glass.
7. **Update `LetterBox`** — subtle glass on empty tiles.
8. **Update `Keyboard`** — glass key backgrounds.
9. **Enhance `BaseSafeAreaView`** background for blur contrast.
10. **Update navigation header** in `app/_layout.tsx`.
11. **Adjust text opacity** if contrast is insufficient on glass.
12. **Update `docs/STYLING-GUIDE.md`** with Liquid Glass patterns.
13. **Run `pnpm run lint && pnpm run typecheck`** and fix any issues.
14. **Test on web, iOS, and Android** for visual consistency and performance.

## Acceptance Criteria

- [ ] All card/tile surfaces use translucent glass effect instead of opaque gradients
- [ ] Category and semantic accent colors are preserved as border tints on glass
- [ ] Modals have frosted-glass backgrounds with backdrop blur
- [ ] Keyboard keys use glass styling
- [ ] Navigation header uses glass toolbar
- [ ] `prefers-reduced-transparency` falls back to existing opaque design
- [ ] Text contrast meets WCAG AA on all glass surfaces
- [ ] No regressions in `pnpm run lint && pnpm run typecheck`
- [ ] `npx expo export --platform web` builds successfully
- [ ] Visual consistency across web, iOS, and Android

## Labels

`enhancement`, `ui`, `design-system`
