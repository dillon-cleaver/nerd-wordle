import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SvgIcon } from "./base/SvgIcon";
import { isDevModeEnabled, getDevEnvironmentInfo } from "@/utils/dev-flags";
import { LetterTrackingDisplay } from "./LetterTrackingDisplay";
import {
  colors,
  fontFamily,
  fontSize,
  spacing,
  borderRadius,
} from "@/constants/styles";
import { iconSizes } from "@/constants/icons";

/**
 * Simple Development Info Display for Drawer
 * Shows current build environment info when dev mode is enabled
 */
export const DrawerDevInfo: React.FC = () => {
  if (!isDevModeEnabled()) {
    return null;
  }

  const envInfo = getDevEnvironmentInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SvgIcon
          name="info-circle"
          size={iconSizes.small}
          color={colors.semantic.warning}
        />
        <Text style={styles.headerText}>Build Environment</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Daily Bypass: {envInfo.bypassDailyLimit ? "ON" : "OFF"}
        </Text>
        <Text style={styles.infoText}>
          Debug Logs: {envInfo.debugLogging ? "ON" : "OFF"}
        </Text>
        <Text style={styles.infoText}>
          Firestore:{" "}
          {envInfo.firestoreMode === "emulator"
            ? "Local Emulator"
            : "Production"}
        </Text>
      </View>

      {/* Letter Tracking Display for Development */}
      <LetterTrackingDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.darkGray,
    margin: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.semantic.warning,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  headerText: {
    color: colors.semantic.warning,
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    marginLeft: spacing.xs,
  },
  info: {
    gap: spacing.xs / 2, // 2px using your spacing system
  },
  infoText: {
    color: colors.neutral.lightGray,
    fontFamily: fontFamily.bitter.regular,
    fontSize: 12,
    textAlign: "center",
  },
});
