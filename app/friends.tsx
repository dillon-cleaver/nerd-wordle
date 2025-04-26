import { View, Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "../constants/styles";

export default function Friends() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>See your friends scores here</Text>
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
