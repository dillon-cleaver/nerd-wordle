import { WordCategory } from "@/constants/words";
import { createContext, ReactNode, useState } from "react";

type GameContextType = {
  category: WordCategory;
};
export const GameContext = createContext<GameContextType>({
  category: "fantasyAndSciFi",
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<WordCategory>("fantasyAndSciFi");

  return (
    <GameContext.Provider value={{ category }}>{children}</GameContext.Provider>
  );
};
