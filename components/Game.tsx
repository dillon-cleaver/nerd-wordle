import { useContext, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { GameBanner } from "./GameBanner";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { BaseSafeAreaView } from "./base/BaseSafeAreaView";
import { colors, fontSize, fontFamily, spacing } from "../constants/styles";
import { useDevice } from "../hooks/useDevice";
import { usePlatform } from "@/hooks/usePlatform";
import { useUser } from "@/hooks/useUser";
import { GameContext } from "@/context/GameContext";

type GameProps = {};

export const Game = ({}: GameProps) => {
  const { loading } = useUser();
  const { isDesktop } = useDevice();
  const { isIOS } = usePlatform();
  const { gameStatus, guesses, category, answer } = useContext(GameContext);

  useEffect(() => {
    console.info({ answer, category });
  }, []);

  const containerStyle = [
    isIOS && styles.container,
    isDesktop && styles.desktopContainer,
  ];

  if (loading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <BaseSafeAreaView
      addStyles={containerStyle}
      edges={["bottom", "left", "right"]}
    >
      {gameStatus === "running" ? (
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      ) : (
        <View style={styles.categoryTextContainer}>
          <GameBanner
            gameStatus={gameStatus}
            numGuesses={guesses.length}
            answer={answer}
          />
        </View>
      )}
      <View style={styles.gridAndKeyboardContainer}>
        <View style={styles.gridContainer}>
          <GuessGrid />
        </View>
        <Keyboard />
      </View>
    </BaseSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  desktopContainer: {
    maxWidth: 600,
    alignSelf: "center",
  },
  categoryTextContainer: {
    minHeight: 100,
    maxHeight: 400,
    justifyContent: "center",
    paddingLeft: spacing.md,
  },
  gridContainer: {
    alignItems: "center",
  },
  gridAndKeyboardContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    gap: 64,
    paddingBottom: spacing.lg,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.large,
    fontFamily: fontFamily.bitter.bold,
  },
});
