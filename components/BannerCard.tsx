import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { WordCard } from "./WordCard";
import { GameBanner } from "./GameBanner";

export const BannerCard = () => {
  const { gameStatus, guesses, answer } = useContext(GameContext);

  return gameStatus === "running" ? (
    <WordCard />
  ) : (
    <GameBanner
      gameStatus={gameStatus}
      numGuesses={guesses.length}
      answer={answer}
    />
  );
};
