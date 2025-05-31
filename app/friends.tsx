import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "../constants/styles";
import { signInWithGoogle, signOutGoogle } from "@/hooks/useGoogleSignIn";
import { useUser } from "@/context/UserContext";

export default function Friends() {
  const { authUser, loading, userProfile } = useUser();

  console.log(userProfile, "<--- userProfile");
  console.log(loading, "<--- loading");
  console.log(authUser, "<--- authUser");

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>See your friends scores here</Text>
      <View>
        <Button title="Sign out with Google" onPress={signOutGoogle} />
        {!authUser && (
          <Button title="Sign in with Google" onPress={signInWithGoogle} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral.background,
    gap: spacing.md,
  },
  text: {
    color: colors.neutral.lightGray,
    fontFamily: fontFamily.bitter.regular,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
  },
});
