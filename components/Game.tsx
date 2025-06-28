import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GameBanner } from "./GameBanner";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
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
        <View style={styles.keyboard}>
          <Keyboard />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  container: {
    alignItems: "center",
    gap: spacing.lg,
  },
  keyboard: {
    alignItems: "center",
    width: "100%",
  },
});
