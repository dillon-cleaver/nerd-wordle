import { StyleSheet } from "react-native";
import { colors } from "../constants/styles";
import { Game } from "@/components/Game";
import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";

export default function Index() {
  return (
    <BaseSafeAreaView addStyles={styles.container}>
      <Game />
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.background,
  },
});
