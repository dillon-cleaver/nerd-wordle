import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  shouldShowDevBadge,
  getDevEnvironmentInfo,
  isDevModeEnabled,
} from "@/utils/dev-flags";
import {
  colors,
  fontFamily,
  spacing,
  borderRadius,
  fontSize,
  lineHeight,
} from "@/constants/styles";

/**
 * Development mode indicator badge
 * Shows "DEV" when EXPO_PUBLIC_DEV_MODE is true
 * Shows "alpha" when in production mode and EXPO_PUBLIC_SHOW_DEV_BADGE is true
 */
export const DevModeBadge: React.FC = () => {
  if (!shouldShowDevBadge()) {
    return null;
  }

  const envInfo = getDevEnvironmentInfo();
  const isDevMode = isDevModeEnabled();

  // In development: show "DEV" with warning background
  // In production: show "alpha" with success background and italic text
  const badgeText = isDevMode ? "DEV" : "alpha";
  const containerStyle = isDevMode
    ? styles.devContainer
    : styles.alphaContainer;
  const textStyle = isDevMode ? styles.devText : styles.alphaText;

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{badgeText}</Text>
      {envInfo.bypassDailyLimit && <Text style={styles.subText}>∞</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  // Legacy container style (can be removed after confirming new styles work)
  container: {
    backgroundColor: colors.semantic.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  // Development mode styles
  devContainer: {
    backgroundColor: colors.semantic.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  devText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
  // Alpha mode styles
  alphaContainer: {
    backgroundColor: colors.semantic.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  alphaText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.boldItalic,
  },
  // Legacy text style (can be removed after confirming new styles work)
  text: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
  subText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    marginLeft: spacing.xs,
    fontFamily: fontFamily.bitter.bold,
  },
});
