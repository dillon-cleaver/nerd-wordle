import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/styles";
import { Game } from "@/components/Game";
import { BaseSafeAreaView } from "@/components/base/BaseSafeAreaView";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function Index() {
  const { loading, authUser } = useUser();

  // TODO: TEMPORARY: Log fresh Firebase token for API testing
  useEffect(() => {
    const logToken = async () => {
      if (authUser) {
        try {
          const token = await authUser.getIdToken(true); // Force refresh
          console.log("🔑 Fresh Firebase Token for API testing:");
          console.log(token);
          console.log("Copy this token and use it in Yaak!");
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };
    logToken();
  }, [authUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
  },
});
