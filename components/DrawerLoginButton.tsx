import {
  colors,
  fontFamily,
  fontSize,
  spacing,
  borderRadius,
} from "@/constants/styles";
import { useUser } from "../hooks/useUser";
import { signInWithGoogle, signOutGoogle } from "@/hooks/useGoogleSignIn";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { SvgIcon } from "./base/SvgIcon";
import { iconSizes } from "@/constants/icons";

const ACTIVE_OPACITY = 0.7;

export const DrawerLoginButton = () => {
  const { authUser } = useUser();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={authUser ? signOutGoogle : signInWithGoogle}
      activeOpacity={ACTIVE_OPACITY}
    >
      <View style={styles.row}>
        <Text style={styles.label}>
          {authUser ? "Sign out of Google" : "Sign in with Google"}
        </Text>
        <SvgIcon
          color={colors.neutral.white}
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
    lineHeight: fontSize.body.base,
  },
});
