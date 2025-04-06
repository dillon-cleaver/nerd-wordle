import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { sample } from "../utils/sample";
import { WORDS, Word, WordCategory } from "../constants/words";
import { NUMBER_OF_GUESSES } from "../constants/numbers";
import GuessGrid from "./GuessGrid";
import GameBanner from "./GameBanner";
import Keyboard from "./Keyboard";
import { BaseSafeAreaView } from "./base/BaseSafeAreaView";
import {
  colors,
  fontSize,
  fontFamily,
  borderRadius,
  spacing,
} from "../constants/styles";

type GameProps = {};

const Game = ({}: GameProps) => {
  const [{ category, answer }] = useState(() => {
    const selectedCategory = sample(Object.keys(WORDS)) as WordCategory;
    return {
      category: selectedCategory,
      answer: sample([...WORDS[selectedCategory]]),
    };
  });

  // Log the answer in a useEffect to ensure it only logs in the browser
  useEffect(() => {
    console.info({ answer, category });
  }, [answer, category]);

  const [gameStatus, setGameStatus] = useState<"won" | "running" | "lost">(
    "running"
  );
  const [guesses, setGuesses] = useState<Word[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);

  function handleSubmitGuess() {
    if (tentativeGuess.length !== 5) return;

    const isValidWord = Object.values(WORDS)
      .flat()
      .includes(tentativeGuess as Word);

    if (!isValidWord) {
      setInvalidWord(true);
      setTimeout(() => {
        setInvalidWord(false);
        setTentativeGuess("");
      }, 1500);
      return;
    }

    setGuesses((prevGuesses) => {
      const nextGuesses = [...prevGuesses, tentativeGuess as Word];

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
    <BaseSafeAreaView addStyles={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      <GuessGrid
        guesses={guesses}
        answer={answer}
        numGuesses={NUMBER_OF_GUESSES}
        tentativeGuess={tentativeGuess}
        invalidWord={invalidWord}
      />

      <Keyboard guesses={guesses} answer={answer} onKeyPress={handleKeyPress} />

      <GameBanner
        gameStatus={gameStatus}
        numGuesses={guesses.length}
        answer={answer}
      />
    </BaseSafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryContainer: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.darkBlue,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.medium,
    fontFamily: fontFamily.bitter.medium,
  },
});
