import { StyleSheet } from "react-native";
import { colors } from "../constants/styles";
import { Game } from "@/components/Game";
import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";

export default function Index() {
  return (
    // TODO: Look into how edges is actually supposed to work. I think my implementation could be improved.
    <BaseSafeAreaView addStyles={styles.container} edges={[]}>
      <Game />
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.background,
  },
});
