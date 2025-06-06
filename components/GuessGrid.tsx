import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";

export const GuessGrid = () => {
  const {
    guesses,
    answer,
    tentativeGuess,
    invalidWord,
    hint,
    originalCategory,
  } = useContext(GameContext);

  return range(0, NUMBER_OF_GUESSES).map((rowIndex) => {
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
        category={originalCategory}
      />
    );
  });
};
