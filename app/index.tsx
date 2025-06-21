import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/styles";
import { Game } from "@/components/Game";
import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";
import { useUser } from "@/hooks/useUser";

export default function Index() {
  const { loading } = useUser();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
  },
});
