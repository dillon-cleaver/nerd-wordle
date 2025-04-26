import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { Word } from "@/constants/words";

type GuessGridProps = {
  guesses: Word[];
  answer: Word;
  numGuesses: number;
  tentativeGuess: string;
  invalidWord: boolean;
};

export const GuessGrid = ({
  guesses,
  answer,
  numGuesses,
  tentativeGuess,
  invalidWord,
}: GuessGridProps) => {
  return range(0, numGuesses).map((rowIndex) => {
    const currentGuess =
      rowIndex === guesses.length ? tentativeGuess : guesses[rowIndex] || "";
    const isCurrentGuess = rowIndex === guesses.length;

    return (
      <GuessRow
        key={rowIndex}
        currentGuess={currentGuess}
        answer={answer}
        isCurrentGuess={isCurrentGuess}
        invalidWord={invalidWord && isCurrentGuess}
      />
    );
  });
};
