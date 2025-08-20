import { useState, useEffect } from "react";
import {
  getTimeUntilNextGameTimezoneMidnight,
  getCurrentInGameTimezone,
  getNextGameTimezoneMidnight,
} from "./time";

/**
 * Calculate time remaining until next Central Time midnight (when daily puzzle changes)
 * @returns Object with hours, minutes, and formatted string
 */
export const getTimeUntilNewPuzzle = () => {
  const { hours, minutes } = getTimeUntilNextGameTimezoneMidnight();

  // Debug logging (only in development)
  if (__DEV__) {
    console.log("Countdown Debug:", {
      yourLocalTime: new Date().toLocaleString(),
      currentCentralTime: getCurrentInGameTimezone().toISOString(),
      nextMidnightCentral: getNextGameTimezoneMidnight().toISOString(),
      hoursUntil: hours,
      minutesUntil: minutes,
      timezoneOffset: new Date().getTimezoneOffset(),
    });
  }

  return {
    hours,
    minutes,
    formatted: `New puzzle in ${hours} hours, ${minutes} minutes`,
  };
};

/**
 * Hook to get real-time countdown to next puzzle
 * Updates every minute
 */
export const useCountdownToNewPuzzle = () => {
  const [timeUntilNewPuzzle, setTimeUntilNewPuzzle] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const { formatted } = getTimeUntilNewPuzzle();
      setTimeUntilNewPuzzle(formatted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return timeUntilNewPuzzle;
};
