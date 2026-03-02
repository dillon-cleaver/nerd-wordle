import { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { GameContext } from "@/context/GameContext";
import { colors } from "@/constants/styles";

export const GameReadyGate = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useContext(GameContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.neutral.white} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
  },
});
