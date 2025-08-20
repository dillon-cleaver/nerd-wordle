/**
 * Shared time utilities for consistent date/time handling between client and server
 * All functions use Central Time (America/Chicago) as the "game timezone"
 * This ensures puzzles switch at midnight Central Time for a better user experience
 */

// Game timezone configuration
const GAME_TIMEZONE = "America/Chicago"; // Central Time

/**
 * Get current date in YYYY-MM-DD format in the game timezone (Central Time)
 * This is the canonical way to get "today" for puzzle identification
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  // Convert to Central Time and get the date part
  // Note: en-CA locale is used because it formats dates as YYYY-MM-DD (not related to timezone)
  return now.toLocaleDateString("en-CA", {
    timeZone: GAME_TIMEZONE,
  }); // timeZone controls the timezone, en-CA just gives us YYYY-MM-DD format
};

/**
 * Get date string for a specific Date object in YYYY-MM-DD format in game timezone
 */
export const getDateString = (date: Date): string => {
  return date.toLocaleDateString("en-CA", {
    timeZone: GAME_TIMEZONE,
  });
};

/**
 * Get current time in the game timezone as a Date object
 */
export const getCurrentInGameTimezone = (): Date => {
  return new Date();
};

/**
 * Check if a date is in daylight saving time for Central Time
 */
const isDaylightSavingTime = (date: Date): boolean => {
  // Simple approximation: DST runs from second Sunday in March to first Sunday in November
  const year = date.getFullYear();
  const march = new Date(year, 2, 1); // March 1st
  const november = new Date(year, 10, 1); // November 1st

  // Find second Sunday in March
  const firstSundayMarch = new Date(march);
  firstSundayMarch.setDate(1 + ((7 - march.getDay()) % 7));
  const secondSundayMarch = new Date(firstSundayMarch);
  secondSundayMarch.setDate(firstSundayMarch.getDate() + 7);

  // Find first Sunday in November
  const firstSundayNovember = new Date(november);
  firstSundayNovember.setDate(1 + ((7 - november.getDay()) % 7));

  return date >= secondSundayMarch && date < firstSundayNovember;
};

/**
 * Get next midnight in Central Time as a UTC Date object
 */
export const getNextGameTimezoneMidnight = (): Date => {
  const now = new Date();

  // Get tomorrow's date in Central Time
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateString = getDateString(tomorrow);

  // Create midnight of tomorrow in Central Time, then convert to UTC
  // CST is UTC-6, CDT is UTC-5
  const isDST = isDaylightSavingTime(now);
  const offsetHours = isDST ? 5 : 6; // CDT is UTC-5, CST is UTC-6

  const utcMidnight = new Date(
    `${tomorrowDateString}T${offsetHours
      .toString()
      .padStart(2, "0")}:00:00.000Z`
  );

  return utcMidnight;
};

/**
 * Calculate milliseconds until next Central Time midnight
 */
export const getMillisecondsUntilNextGameTimezoneMidnight = (): number => {
  const now = new Date();
  const nextMidnight = getNextGameTimezoneMidnight();
  return nextMidnight.getTime() - now.getTime();
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date) && !isNaN(Date.parse(date));
};

/**
 * Parse YYYY-MM-DD string to UTC Date object
 */
export const parseUTCDateString = (dateString: string): Date => {
  if (!isValidDateFormat(dateString)) {
    throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
  }
  return new Date(`${dateString}T00:00:00.000Z`);
};

/**
 * Get time until next Central Time midnight in hours and minutes
 * Used for countdown display
 */
export const getTimeUntilNextGameTimezoneMidnight = () => {
  const timeDiff = getMillisecondsUntilNextGameTimezoneMidnight();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    hours,
    minutes,
    totalMinutes: Math.floor(timeDiff / (1000 * 60)),
    totalMilliseconds: timeDiff,
  };
};

// Backward compatibility exports (keeping the same function names for existing code)
export const getCurrentUTC = getCurrentInGameTimezone;
export const getNextUTCMidnight = getNextGameTimezoneMidnight;
export const getMillisecondsUntilNextUTCMidnight =
  getMillisecondsUntilNextGameTimezoneMidnight;
export const getTimeUntilNextUTCMidnight = getTimeUntilNextGameTimezoneMidnight;
