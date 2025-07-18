import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStatus, Hint, GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/puzzle-result";
import { savePuzzleResult } from "@/storage/puzzle-results";
import { WordEntry, WordId } from "@/types/word";
import { WORD_DATA } from "@/constants/words";
// import { getAuth } from "firebase/auth";
// import { syncPuzzleResultToBackend } from "./puzzle-result-sync";

const ISO = new Date().toISOString();
// const UID = getAuth().currentUser?.uid ?? null;

export const handleSubmitGuess = (
  tentativeGuess: string,
  guesses: WordId[],
  answerEntry: WordEntry,
  updaters: GameStateUpdaters,
  hintIndex: number
) => {
  if (tentativeGuess.length !== 5) return;
  const answerId = answerEntry.id as WordId; // 5‑letter string, e.g. "PIXAR"

  const isValidWord = tentativeGuess.toUpperCase() in WORD_DATA;

  if (!isValidWord) {
    updaters.setInvalidWord(true);
    setTimeout(() => {
      updaters.setInvalidWord(false);
      updaters.setTentativeGuess("");
    }, 1500);
    return;
  }

  const nextGuesses: WordId[] = [
    ...guesses,
    tentativeGuess.toUpperCase() as WordId,
  ];

  const correctLettersInPlace = guesses
    .flatMap((guess) =>
      guess.split("").map((char, i) => (char === answerId[i] ? char : null))
    )
    .filter(Boolean);

  let nextHint: Hint = undefined;
  if (tentativeGuess !== answerId && guesses.length >= 3) {
    for (let i = 0; i < 5; i++) {
      const letter = tentativeGuess[i];
      const isMisplaced =
        letter &&
        letter !== answerId[i] &&
        answerId.includes(letter) &&
        tentativeGuess.indexOf(letter) !== answerId.indexOf(letter) &&
        !correctLettersInPlace.includes(letter);

      if (isMisplaced) {
        nextHint = {
          row: guesses.length + 1,
          col: answerId.indexOf(letter),
          letter,
        };
        break;
      }
    }
  }

  const nextGuessesEntries: WordEntry[] = nextGuesses.map((id) => ({
    id,
    ...WORD_DATA[id],
    edition: WORD_DATA[id].edition ?? 1,
  }));

  updaters.setGuesses(nextGuessesEntries);
  updaters.setHint(nextHint);
  updaters.setTentativeGuess("");

  if (tentativeGuess === answerId) {
    updaters.setGameStatus("won");
    updaters.setHint(undefined);

    const result: PuzzleResult = {
      // id: new Date().toISOString().split("T")[0],
      id: ISO,
      word: answerId,
      date: ISO,
      guesses: nextGuesses.length,
      hintIndex,
      status: "win",
    };
    // savePuzzleResult(UID, result);
    savePuzzleResult(null, result);
    // syncPuzzleResultToBackend(result).catch(console.error);
  } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
    updaters.setGameStatus("lost");
    updaters.setHint(undefined);

    const result: PuzzleResult = {
      // id: new Date().toISOString().split("T")[0],
      id: ISO,
      word: answerId,
      date: ISO,
      guesses: nextGuesses.length,
      hintIndex,
      status: "fail",
    };
    // savePuzzleResult(UID, result);
    savePuzzleResult(null, result);
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
