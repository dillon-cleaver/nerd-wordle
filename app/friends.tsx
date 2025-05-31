import { View, Text, StyleSheet, Button } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "../constants/styles";
import { signInWithGoogle, signOutGoogle } from "@/hooks/useGoogleSignIn";

export default function Friends() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>See your friends scores here</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
        <Button title="Sign out with Google" onPress={signOutGoogle} />
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
  },
  text: {
    color: colors.neutral.lightGray,
    fontFamily: fontFamily.bitter.regular,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
  },
});
