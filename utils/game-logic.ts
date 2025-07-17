import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStatus, Hint, GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/backend";
import { savePuzzleResultsLocally } from "./puzzle-result-storage";
import { Word } from "@/types/word";
import { WORD_DATA } from "@/constants/words";
// import { syncPuzzleResultToBackend } from "./puzzle-result-sync";

export const handleSubmitGuess = (
  tentativeGuess: string,
  guesses: Word[],
  answer: Word,
  updaters: GameStateUpdaters
) => {
  if (tentativeGuess.length !== 5) return;

  const isValidWord = tentativeGuess.toUpperCase() in WORD_DATA;

  if (!isValidWord) {
    updaters.setInvalidWord(true);
    setTimeout(() => {
      updaters.setInvalidWord(false);
      updaters.setTentativeGuess("");
    }, 1500);
    return;
  }

  const nextGuesses = [...guesses, tentativeGuess as Word];

  const correctLettersInPlace = guesses
    .flatMap((guess) =>
      guess.split("").map((char, i) => (char === answer[i] ? char : null))
    )
    .filter(Boolean);

  let nextHint: Hint = undefined;
  if (tentativeGuess !== answer && guesses.length >= 3) {
    for (let i = 0; i < 5; i++) {
      const letter = tentativeGuess[i];
      const isMisplaced =
        letter &&
        letter !== answer[i] &&
        answer.includes(letter) &&
        tentativeGuess.indexOf(letter) !== answer.indexOf(letter) &&
        !correctLettersInPlace.includes(letter);

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

  updaters.setGuesses(nextGuesses);
  updaters.setHint(nextHint);
  updaters.setTentativeGuess("");

  if (tentativeGuess === answer) {
    updaters.setGameStatus("won");
    updaters.setHint(undefined);

    const result: PuzzleResult = {
      // id: new Date().toISOString().split("T")[0],
      id: new Date().toISOString(),
      word: answer,
      date: new Date().toISOString(),
      attempts: guesses.length,
      status: "win",
    };
    savePuzzleResultsLocally(result);
    // syncPuzzleResultToBackend(result).catch(console.error);
  } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
    updaters.setGameStatus("lost");
    updaters.setHint(undefined);

    const result: PuzzleResult = {
      // id: new Date().toISOString().split("T")[0],
      id: new Date().toISOString(),
      word: answer,
      date: new Date().toISOString(),
      attempts: guesses.length,
      status: "fail",
    };
    savePuzzleResultsLocally(result);
    // syncPuzzleResultToBackend(result).catch(console.error);
  }
};

export const handleKeyPress = (
  key: string,
  gameStatus: GameStatus,
  tentativeGuess: string,
  updaters: {
    setTentativeGuess: (guess: string) => void;
    handleSubmitGuess: () => void;
  }
) => {
  if (gameStatus !== "running") return;

  if (key === "ENTER") {
    updaters.handleSubmitGuess();
  } else if (key === "BACKSPACE") {
    updaters.setTentativeGuess(tentativeGuess.slice(0, -1));
  } else if (tentativeGuess.length < 5) {
    updaters.setTentativeGuess(tentativeGuess + key);
  }
};
