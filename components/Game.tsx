import { useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GameBanner } from "./GameBanner";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { BaseSafeAreaView } from "./base/BaseSafeAreaView";
import { useUser } from "@/hooks/useUser";
import { GameContext } from "@/context/GameContext";
import { WordCard } from "./WordCard";

type GameProps = {};

export const Game = ({}: GameProps) => {
  const { gameStatus, guesses, category, answer } = useContext(GameContext);

  useEffect(() => {
    console.info({ answer, category });
  }, []);

  return (
    <BaseSafeAreaView edges={[]}>
      <View
        style={{
          backgroundColor: "purple",
        }}
      >
        {gameStatus === "running" ? (
          <>
            {/* <Text style={styles.categoryText}>{category}</Text> */}
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
        <Keyboard />
      </View>
    </BaseSafeAreaView>
  );
};
