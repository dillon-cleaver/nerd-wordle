import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { sample } from "../utils/sample";
import { WORDS, Word, WordCategory } from "../constants/words";
import { NUMBER_OF_GUESSES } from "../constants/numbers";
import { GuessGrid } from "./GuessGrid";
import { GameBanner } from "./GameBanner";
import { Keyboard } from "./Keyboard";
import { BaseSafeAreaView } from "./base/BaseSafeAreaView";
import { colors, fontSize, fontFamily, spacing } from "../constants/styles";
import { initializeGame } from "@/utils/game";

type GameProps = {};

export const Game = ({}: GameProps) => {
  const [{ category, answer, originalCategory }] = useState(initializeGame);

  console.log(category);

  useEffect(() => {
    console.info({ answer, category });
  }, [answer, category]);

  const [gameStatus, setGameStatus] = useState<"won" | "running" | "lost">(
    "running"
  );
  const [guesses, setGuesses] = useState<Word[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [hint, setHint] = useState<
    | {
        row: number;
        col: number;
        letter: string;
      }
    | undefined
  >(undefined);

  function handleSubmitGuess() {
    if (tentativeGuess.length !== 5) return;

    // That flattens all categories, including "common", into a single array — so words like "SLATE" or "AUDIO" can still be guessed.
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

    const nextGuesses = [...guesses, tentativeGuess as Word];

    const correctLettersInPlace = guesses
      .flatMap((guess) =>
        guess.split("").map((char, i) => (char === answer[i] ? char : null))
      )
      .filter(Boolean);

    let nextHint: typeof hint = undefined;
    if (
      tentativeGuess !== answer &&
      (guesses.length === 2 || guesses.length === 3)
    ) {
      for (let i = 0; i < 5; i++) {
        const letter = tentativeGuess[i];
        const isMisplaced =
          letter &&
          letter !== answer[i] &&
          answer.includes(letter) &&
          tentativeGuess.indexOf(letter) !== answer.indexOf(letter) &&
          !correctLettersInPlace.includes(letter); // <== NEW GUARD HERE

        if (isMisplaced) {
          nextHint = {
            row: guesses.length + 1,
            col: answer.indexOf(letter),
            letter,
          };
          break;
        }
      }
    }

    setGuesses(nextGuesses);
    setHint(nextHint);
    setTentativeGuess("");

    if (tentativeGuess === answer) {
      setGameStatus("won");
      setHint(undefined);
    } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
      setGameStatus("lost");
      setHint(undefined);
    }
  }

  function handleKeyPress(key: string) {
    if (gameStatus !== "running") return;

    if (key === "ENTER") {
      handleSubmitGuess();
    } else if (key === "BACKSPACE") {
      setTentativeGuess((prev) => prev.slice(0, -1));
    } else if (tentativeGuess.length < 5) {
      setTentativeGuess((prev) => prev + key);
    }
  }

  return (
    <BaseSafeAreaView
      addStyles={styles.container}
      edges={["bottom", "left", "right"]}
    >
      {gameStatus === "running" ? (
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      ) : (
        <View style={styles.categoryTextContainer}>
          <GameBanner
            gameStatus={"won"}
            numGuesses={guesses.length}
            answer={answer}
          />
        </View>
      )}
      <View style={styles.gridAndKeyboardContainer}>
        <View style={styles.gridContainer}>
          <GuessGrid
            guesses={guesses}
            answer={answer}
            numGuesses={NUMBER_OF_GUESSES}
            tentativeGuess={tentativeGuess}
            invalidWord={invalidWord}
            hint={hint}
            category={originalCategory}
          />
        </View>
        <Keyboard
          guesses={guesses}
          answer={answer}
          onKeyPress={handleKeyPress}
          category={originalCategory}
        />
      </View>
    </BaseSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  categoryTextContainer: {
    flex: 1,
    maxHeight: 200,
    justifyContent: "center",
    paddingLeft: spacing.md,
  },
  gridContainer: {
    alignItems: "center",
  },
  gridAndKeyboardContainer: {
    gap: 64,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.large,
    fontFamily: fontFamily.bitter.bold,
  },
});
