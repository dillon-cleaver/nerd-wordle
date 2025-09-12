import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {
  ApiError,
  PuzzleHistoryResponse,
  PuzzleResultRequest,
  PuzzleResultResponse,
  WordResponse,
  DailyPuzzleResponse,
  DailyPuzzleSeed,
} from "./types";
import {
  wordsCollection,
  dailyPuzzlesCollection,
  firestoreToWordEntry,
  firestoreToDailyPuzzle,
} from "./utils";
import { getTodayDateString, isValidDateFormat } from "./shared/time";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Configure CORS for local development and Expo requests
const corsOptions = {
  origin: [
    "http://localhost:8081", // Expo dev server
    "http://localhost:19006", // Expo web
    "exp://localhost:19000", // Expo mobile
    "https://nerd-word-cfda3.web.app", // Your Firebase hosting domain
    "https://nerd-word-cfda3.firebaseapp.com",
    "https://nerd-word.expo.app", // Expo hosting domain
    /^https:\/\/nerd-word--[a-z0-9]+\.expo\.app$/, // Expo hosting preview domains
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyToken = async (
  req: express.Request,
  res: express.Response<ApiError>,
  next: express.NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next(); // Call next() to continue to the next middleware/route handler
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

// POST /puzzle-result route
app.post(
  "/puzzle-result",
  verifyToken,
  async (
    req: express.Request,
    res: express.Response<PuzzleResultResponse | ApiError>
  ) => {
    try {
      const { uid } = req.user!;
      const {
        id,
        word,
        guesses,
        attempts,
        date,
        status,
        edition,
        hintIndex,
        letterTracking,
      }: PuzzleResultRequest = req.body;

      // Validate required fields
      if (
        !id ||
        !word ||
        guesses === undefined ||
        attempts === undefined ||
        !date ||
        !status ||
        !letterTracking
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: id, word, guesses, attempts, date, status, or letterTracking",
        });
      }

      // Validate status
      if (status !== "win" && status !== "loss") {
        return res.status(400).json({
          error: "Status must be either 'win' or 'loss'",
        });
      }

      // Check if result with this id already exists
      const resultRef = db
        .collection("users")
        .doc(uid)
        .collection("puzzleHistory")
        .doc(id);

      const existingResult = await resultRef.get();

      if (existingResult.exists) {
        return res.status(409).json({
          error: "A puzzle result with this id already exists",
        });
      }

      // Store the puzzle result data (convert date string to Firestore timestamp)
      const resultData = {
        id,
        word,
        guesses,
        attempts,
        date: new Date(date),
        status,
        edition: edition || 1,
        hintIndex: hintIndex || 0,
        letterTracking: letterTracking || [], // Include letter tracking data
      };

      await resultRef.set(resultData);

      // Return the original request format
      const responseData: PuzzleResultRequest = {
        id,
        word,
        guesses,
        attempts,
        date,
        status,
        edition,
        hintIndex,
        letterTracking,
      };

      return res.status(200).json({
        message: "Puzzle result recorded successfully",
        data: responseData,
      });
    } catch (err) {
      console.error("Error recording puzzle result:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /puzzle-history route
app.get(
  "/puzzle-history",
  verifyToken,
  async (
    req: express.Request,
    res: express.Response<PuzzleHistoryResponse | ApiError>
  ) => {
    try {
      const { uid } = req.user!;

      const resultsSnapshot = await db
        .collection("users")
        .doc(uid)
        .collection("puzzleHistory")
        .orderBy("date", "desc")
        .get();

      const results: PuzzleResultRequest[] = resultsSnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          word: data.word,
          guesses: data.guesses,
          attempts: data.attempts,
          date: data.date.toDate().toISOString(),
          status: data.status,
          edition: data.edition,
          hintIndex: data.hintIndex,
          letterTracking: data.letterTracking || [], // Include letter tracking with fallback
        };
      });

      return res.status(200).json({ results, count: results.length });
    } catch (err) {
      console.error("Error fetching puzzle history:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /words/new-since/:version - fetch words added after a specific app version
app.get(
  "/words/new-since/:version",
  async (
    req: express.Request,
    res: express.Response<
      { words: any[]; count: number; bundleVersion: string } | ApiError
    >
  ) => {
    try {
      const { version } = req.params;

      console.log(`Fetching words newer than bundle version: ${version}`);

      // Query words added after the bundle version
      // This assumes words have a 'version' or 'dateAdded' field
      const wordsSnapshot = await wordsCollection()
        .where("version", ">", version)
        .get();

      const newWords = wordsSnapshot.docs
        .map((doc) => firestoreToWordEntry(doc))
        .filter((word) => word !== null);

      console.log(`Found ${newWords.length} words newer than ${version}`);

      return res.status(200).json({
        words: newWords,
        count: newWords.length,
        bundleVersion: version,
      });
    } catch (err) {
      console.error("Error fetching new words:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /words/:id route - fetch specific word (admin/debug only)
app.get(
  "/words/:id",
  async (
    req: express.Request,
    res: express.Response<WordResponse | ApiError>
  ) => {
    try {
      const { id } = req.params;
      const wordDoc = await wordsCollection().doc(id.toUpperCase()).get();
      const word = firestoreToWordEntry(wordDoc);

      if (!word) {
        return res.status(404).json({
          error: `Word with id "${id}" not found`,
        });
      }

      return res.status(200).json({ word });
    } catch (err) {
      console.error(`Error fetching word ${req.params.id}:`, err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /daily-puzzle/today route - fetch current puzzle
// NOTE: This route must come BEFORE the generic /:date route to match correctly
app.get(
  "/daily-puzzle/today",
  async (
    _req: express.Request,
    res: express.Response<DailyPuzzleResponse | ApiError>
  ) => {
    try {
      const today = getTodayDateString();
      const puzzleDoc = await dailyPuzzlesCollection().doc(today).get();
      const puzzle = firestoreToDailyPuzzle(puzzleDoc);

      if (!puzzle) {
        return res.status(404).json({
          error: `No puzzle found for today (${today})`,
        });
      }

      return res.status(200).json({ puzzle });
    } catch (err) {
      console.error("Error fetching today's puzzle:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /daily-puzzle/:date route - fetch puzzle for specific date
app.get(
  "/daily-puzzle/:date",
  async (
    req: express.Request,
    res: express.Response<DailyPuzzleResponse | ApiError>
  ) => {
    try {
      const { date } = req.params;

      if (!isValidDateFormat(date)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      const puzzleDoc = await dailyPuzzlesCollection().doc(date).get();
      const puzzle = firestoreToDailyPuzzle(puzzleDoc);

      if (!puzzle) {
        return res.status(404).json({
          error: `No puzzle found for date ${date}`,
        });
      }

      return res.status(200).json({ puzzle });
    } catch (err) {
      console.error(`Error fetching puzzle for date ${req.params.date}:`, err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// POST /daily-puzzle route - manually schedule daily puzzles (for testing/initial seeding)
// TODO: ALPHA ONLY - Manual puzzle scheduling for testing
// Production should use automated puzzle generation algorithm
app.post(
  "/daily-puzzle",
  verifyToken,
  async (
    req: express.Request,
    res: express.Response<
      { message: string; puzzle: DailyPuzzleSeed } | ApiError
    >
  ) => {
    try {
      const { date, wordId } = req.body;

      // Validate required fields
      if (!date || !wordId) {
        return res.status(400).json({
          error: "Missing required fields: date and wordId",
        });
      }

      if (!isValidDateFormat(date)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      // Check if word exists
      const wordDoc = await wordsCollection().doc(wordId.toUpperCase()).get();
      const word = firestoreToWordEntry(wordDoc);

      if (!word) {
        return res.status(404).json({
          error: `Word with id "${wordId}" not found`,
        });
      }

      // Check if puzzle for this date already exists
      const existingPuzzleDoc = await dailyPuzzlesCollection().doc(date).get();
      if (existingPuzzleDoc.exists) {
        return res.status(409).json({
          error: `A puzzle for date ${date} already exists`,
        });
      }

      // Create the daily puzzle
      const puzzle: DailyPuzzleSeed = { date, word };
      await dailyPuzzlesCollection().doc(date).set({
        word: word,
      });

      return res.status(201).json({
        message: "Daily puzzle created successfully",
        puzzle,
      });
    } catch (err) {
      console.error("Error creating daily puzzle:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const api = functions.https.onRequest(app);
