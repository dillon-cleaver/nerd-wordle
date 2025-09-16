import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { shouldShowDevBadge, getDevEnvironmentInfo } from "@/utils/dev-flags";
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
 * Shows when EXPO_PUBLIC_SHOW_DEV_BADGE is true
 */
export const DevModeBadge: React.FC = () => {
  if (!shouldShowDevBadge()) {
    return null;
  }

  const envInfo = getDevEnvironmentInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>DEV</Text>
      {envInfo.bypassDailyLimit && <Text style={styles.subText}>∞</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.semantic.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    alignItems: "center",
  },
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
