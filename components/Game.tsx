import * as React from "react";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { sample } from "../utils/sample";
import { WORDS } from "../constants/words.constants";
import { NUMBER_OF_GUESSES } from "../constants/numbers.constants";
import GuessGrid from "./GuessGrid";
import GuessInput from "./GuessInput";
import GameBanner from "./GameBanner";

// Pick a random word on every page load.
const answer = sample(WORDS as string[]);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

type GameProps = {};

const Game = ({}: GameProps) => {
  // "won" | "running" | "lost"
  const [gameStatus, setGameStatus] = useState<"won" | "running" | "lost">(
    "running"
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");

  function handleSubmitGuess() {
    if (tentativeGuess.length !== 5) return;

    setGuesses((prevGuesses) => {
      const nextGuesses = [...prevGuesses, tentativeGuess];

      if (tentativeGuess === answer) {
        setGameStatus("won");
      } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
        setGameStatus("lost");
      }

      setTentativeGuess("");
      return nextGuesses;
    });
  }

  return (
    <View style={styles.container}>
      <GuessGrid
        guesses={guesses}
        answer={answer}
        numGuesses={NUMBER_OF_GUESSES}
      />

      <GuessInput
        gameStatus={gameStatus}
        tentativeGuess={tentativeGuess}
        onGuessChange={setTentativeGuess}
        onSubmit={handleSubmitGuess}
      />

      <GameBanner
        gameStatus={gameStatus}
        numGuesses={guesses.length}
        answer={answer}
      />
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
