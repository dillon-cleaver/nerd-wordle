import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";
import { WordCard } from "@/components/WordCard";
import { colors } from "@/constants/styles";
import { StyleSheet, View } from "react-native";

export default function Words() {
  return (
    <BaseSafeAreaView addStyles={styles.container} edges={[]}>
      <View style={styles.content}>
        <WordCard />
      </View>
    </BaseSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.background,
  },
  content: {
    alignItems: "center",
  },
});
