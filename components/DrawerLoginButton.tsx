import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";
import { useUser } from "../hooks/useUser";
import { signInWithGoogle, signOutGoogle } from "@/hooks/useGoogleSignIn";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { SvgIcon } from "./base/SvgIcon";
import { iconSizes } from "@/constants/icons";
import Constants from "expo-constants";

const ACTIVE_OPACITY = 0.7;

export const DrawerLoginButton = () => {
  const { authUser } = useUser();
  const isExpoGo = Constants.executionEnvironment === "storeClient";

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={
        isExpoGo ? undefined : authUser ? signOutGoogle : signInWithGoogle
      }
      activeOpacity={ACTIVE_OPACITY}
      disabled={isExpoGo}
    >
      <View style={styles.row}>
        <Text style={[styles.label, isExpoGo && styles.disabled]}>
          {authUser ? "Sign out of Google" : "Sign in with Google"}
        </Text>
        <SvgIcon
          color={isExpoGo ? colors.neutral.darkGray : colors.neutral.white}
          name="chevron-right"
          size={iconSizes.small}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    color: colors.neutral.white,
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
  },
  disabled: {
    color: colors.neutral.darkGray,
  },
});
