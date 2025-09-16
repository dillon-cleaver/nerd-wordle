import { Text, View, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";

export const InfoModalLoginSection = () => {
  return (
    <View style={styles.loginSection}>
      <Text style={styles.loginText}>
        Tap <Text style={styles.loginHighlight}>Sign in with Google</Text> in
        the sidebar to sync your progress across devices and keep track of your
        <Text style={styles.nerdWordText}> NerdWord</Text> collection!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nerdWordText: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
  },
  loginSection: {
    alignSelf: "stretch",
  },
  loginText: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
  },
  loginHighlight: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
  },
});
