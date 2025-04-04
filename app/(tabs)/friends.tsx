import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../../constants/styles";

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
    backgroundColor: colors.background.dark,
  },
  text: {
    color: colors.text.primary,
    fontFamily: fonts.bitter.regular,
    fontSize: 22,
  },
});
