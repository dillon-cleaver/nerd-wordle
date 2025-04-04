import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { sample } from "../utils/sample";
import { WORDS } from "../constants/words";
import { NUMBER_OF_GUESSES } from "../constants/numbers";
import GuessGrid from "./GuessGrid";
import GameBanner from "./GameBanner";
import Keyboard from "./Keyboard";

type GameProps = {};

const Game = ({}: GameProps) => {
  const [answer] = useState(() => sample(WORDS as string[]));

  // Log the answer in a useEffect to ensure it only logs in the browser
  useEffect(() => {
    console.info({ answer });
  }, [answer]);

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

  function handleKeyPress(key: string) {
    if (gameStatus !== "running") return;

    if (key === "ENTER") {
      handleSubmitGuess();
    } else if (key === "⌫") {
      setTentativeGuess((prev) => prev.slice(0, -1));
    } else if (tentativeGuess.length < 5) {
      setTentativeGuess((prev) => prev + key);
    }
  }

  return (
    <View style={styles.container}>
      <GuessGrid
        guesses={guesses}
        answer={answer}
        numGuesses={NUMBER_OF_GUESSES}
        tentativeGuess={tentativeGuess}
      />

      <Keyboard guesses={guesses} answer={answer} onKeyPress={handleKeyPress} />

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
