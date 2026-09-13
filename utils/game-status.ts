import { GameStatus } from "@/types/game";

export type FinishedGameStatus = Extract<GameStatus, "won" | "lost">;

export const isFinishedGameStatus = (
  status: GameStatus
): status is FinishedGameStatus => status === "won" || status === "lost";
