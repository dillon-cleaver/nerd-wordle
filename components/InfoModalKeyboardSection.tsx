import { Text, View, StyleSheet } from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { opacity } from "@/constants/opacity";

export const InfoModalKeyboardSection = () => {
  return (
    <View style={styles.keyboardSection}>
      <Text style={styles.subtitle}>Keyboard Shortcuts</Text>

      <View style={styles.shortcutsList}>
        <View style={styles.shortcutGroup}>
          <Text style={styles.shortcutGroupTitle}>Game Controls</Text>
          <Text style={styles.shortcut}>• A-Z: Type letters</Text>
          <Text style={styles.shortcut}>• Enter: Submit guess</Text>
          <Text style={styles.shortcut}>• Backspace: Delete letter</Text>
        </View>

        <View style={styles.shortcutGroup}>
          <Text style={styles.shortcutGroupTitle}>Navigation</Text>
          <Text style={styles.shortcut}>• Ctrl+H: Open help</Text>
          <Text style={styles.shortcut}>• Escape: Close modals</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardSection: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
    paddingBottom: spacing.xs,
  },
  shortcutsList: {
    gap: spacing.sm,
    alignSelf: "stretch",
  },
  shortcutGroup: {
    gap: spacing.xs,
  },
  shortcutGroupTitle: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    color: colors.neutral.white,
    textAlign: "left",
    opacity: opacity.subtle,
  },
  shortcut: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    color: colors.neutral.white,
    textAlign: "left",
    opacity: opacity.subtle,
    paddingLeft: spacing.xs,
  },
});
