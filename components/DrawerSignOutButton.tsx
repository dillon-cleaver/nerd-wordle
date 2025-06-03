import { colors, fontFamily, fontSize } from "@/constants/styles";
import { useUser } from "@/context/UserContext";
import { signInWithGoogle, signOutGoogle } from "@/hooks/useGoogleSignIn";
import { DrawerItem } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
export const DrawerSignOutButton = () => {
  const { authUser } = useUser();

  return (
    <DrawerItem
      label={authUser ? "Sign out" : "Sign in"}
      onPress={authUser ? signOutGoogle : signInWithGoogle}
      labelStyle={styles.label}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.neutral.white,
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.medium,
  },
});
