import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { Word } from "@/constants/words";

type GuessGridProps = {
  guesses: Word[];
  answer: Word;
  numGuesses: number;
  tentativeGuess: string;
  invalidWord: boolean;
  hint?: {
    row: number;
    col: number;
    letter: string;
  };
  category: string;
};

export const GuessGrid = ({
  guesses,
  answer,
  numGuesses,
  tentativeGuess,
  invalidWord,
  hint,
  category,
}: GuessGridProps) => {
  return range(0, numGuesses).map((rowIndex) => {
    const currentGuess =
      rowIndex === guesses.length ? tentativeGuess : guesses[rowIndex] || "";
    const isCurrentGuess = rowIndex === guesses.length;

    const hintForThisRow =
      hint && hint.row === rowIndex
        ? { col: hint.col, letter: hint.letter }
        : undefined;

    return (
      <GuessRow
        key={rowIndex}
        currentGuess={currentGuess}
        answer={answer}
        isCurrentGuess={isCurrentGuess}
        invalidWord={invalidWord && isCurrentGuess}
        hint={hintForThisRow}
        category={category}
      />
    );
  });
};
