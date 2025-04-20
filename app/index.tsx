import { View, StyleSheet } from "react-native";
import { colors } from "../constants/styles";
import Game from "@/components/Game";

export default function Index() {
  return (
    <View style={styles.container}>
      <Game />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.black,
  },
});
