import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStatus, Hint, GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/puzzle-result";
import { savePuzzleResult } from "@/storage/puzzle-results";
import { addToCollection } from "@/storage/word-collections";
import { WordEntry, WordId, NerdWordEntry } from "@/types/word";
// import { getAuth } from "firebase/auth";
// import { syncPuzzleResultToBackend } from "./puzzle-result-sync";

// TODO: Replace with React Native-compatible UUID generation when building for native
// Consider: react-native-get-random-values + uuid, or expo-crypto
const generatePuzzleId = () => crypto.randomUUID();
// const UID = getAuth().currentUser?.uid ?? null;

export const handleSubmitGuess = (
  tentativeGuess: string,
  guesses: WordId[],
  answerEntry: WordEntry,
  updaters: GameStateUpdaters,
  hintIndex: number,
  getWordEntry: (id: WordId) => WordEntry | undefined,
  isValidWord: (word: string) => boolean
) => {
  if (tentativeGuess.length !== 5) return;
  const answerId = answerEntry.id as WordId;

  if (!isValidWord(tentativeGuess)) {
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

  let nextHint: Hint | undefined = undefined;
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

  const nextGuessesEntries: WordEntry[] = nextGuesses
    .map((id) => getWordEntry(id))
    .filter((entry): entry is WordEntry => entry !== undefined);

  updaters.setGuesses(nextGuessesEntries);
  updaters.setHint(nextHint);
  updaters.setTentativeGuess("");

  if (tentativeGuess === answerId) {
    updaters.setGameStatus("won");
    updaters.setHint(undefined);

    const puzzleId = generatePuzzleId();
    const edition =
      answerEntry.category === "common"
        ? 0
        : (answerEntry as NerdWordEntry).edition;

    const result: PuzzleResult = {
      id: puzzleId,
      word: answerId,
      edition,
      date: new Date(),
      guesses: nextGuesses.length,
      hintIndex,
      status: "win",
    };
    savePuzzleResult(null, result);

    // Add to collection for nerd words
    if (answerEntry.category !== "common") {
      addToCollection(answerId, edition, new Date());
      console.log(
        `Word collected! ${answerId} (Edition ${edition}) - ${nextGuesses.length} guesses, hint index ${hintIndex}`
      );
    }

    // syncPuzzleResultToBackend(result).catch(console.error);
  } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
    updaters.setGameStatus("lost");
    updaters.setHint(undefined);

    const edition =
      answerEntry.category === "common"
        ? 0
        : (answerEntry as NerdWordEntry).edition;
    const result: PuzzleResult = {
      id: generatePuzzleId(),
      word: answerId,
      edition,
      date: new Date(),
      guesses: nextGuesses.length,
      hintIndex,
      status: "fail",
    };
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
