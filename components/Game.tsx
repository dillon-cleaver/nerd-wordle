import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GameBanner } from "./GameBanner";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { BaseSafeAreaView } from "./base/BaseSafeAreaView";
import { GameContext } from "@/context/GameContext";
import { WordCard } from "./WordCard";
import { spacing } from "@/constants/styles";

type GameProps = {};

export const Game = ({}: GameProps) => {
  const { gameStatus, guesses, category, answer } = useContext(GameContext);

  useEffect(() => {
    console.info({ answer, category });
  }, []);

  return (
    <BaseSafeAreaView>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {gameStatus === "running" ? (
            <>
              <WordCard />
            </>
          ) : (
            <GameBanner
              gameStatus={gameStatus}
              numGuesses={guesses.length}
              answer={answer}
            />
          )}
          <GuessGrid />
        </View>
        <Keyboard />
      </View>
    </BaseSafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl,
  },
  container: {
    alignItems: "center",
    gap: spacing.xl,
  },
});
