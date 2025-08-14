import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {
  ApiError,
  PuzzleHistoryResponse,
  PuzzleResultRequest,
  PuzzleResultResponse,
  WordsResponse,
  WordResponse,
  DailyPuzzleResponse,
} from "./types";
import {
  wordsCollection,
  dailyPuzzlesCollection,
  firestoreToWordEntry,
  firestoreToDailyPuzzle,
  getTodayDateString,
  isValidDateFormat,
} from "./utils";

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
    "https://nerd-wordle.expo.app", // Expo hosting domain
    /^https:\/\/nerd-wordle--[a-z0-9]+\.expo\.app$/, // Expo hosting preview domains
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Unauthorized: No token provided" } as ApiError);
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next(); // Call next() to continue to the next middleware/route handler
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Unauthorized: Invalid token" } as ApiError);
    return;
  }
};

// POST /puzzle-result route
app.post(
  "/puzzle-result",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const { uid } = req.user!;
      const {
        id,
        word,
        attempts,
        date,
        status,
        edition,
        hintIndex,
      }: PuzzleResultRequest = req.body;

      // Validate required fields
      if (!id || !word || attempts === undefined || !date || !status) {
        return res.status(400).json({
          error: "Missing required fields: id, word, attempts, date, or status",
        } as ApiError);
      }

      // Validate status
      if (status !== "win" && status !== "loss") {
        return res.status(400).json({
          error: "Status must be either 'win' or 'loss'",
        } as ApiError);
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
        } as ApiError);
      }

      // Store the puzzle result data (convert date string to Firestore timestamp)
      const resultData = {
        id,
        word,
        attempts,
        date: new Date(date),
        status,
        edition: edition || 1,
        hintIndex: hintIndex || 0,
      };

      await resultRef.set(resultData);

      // Return the original request format
      const responseData: PuzzleResultRequest = {
        id,
        word,
        attempts,
        date,
        status,
        edition,
        hintIndex,
      };

      return res.status(200).json({
        message: "Puzzle result recorded successfully",
        data: responseData,
      } as PuzzleResultResponse);
    } catch (err) {
      console.error("Error recording puzzle result:", err);
      return res
        .status(500)
        .json({ error: "Internal server error" } as ApiError);
    }
  }
);

// GET /puzzle-history route
app.get("/puzzle-history", verifyToken, async (req, res) => {
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
        attempts: data.attempts,
        date: data.date.toDate().toISOString(),
        status: data.status,
        edition: data.edition,
        hintIndex: data.hintIndex,
      };
    });

    return res
      .status(200)
      .json({ results, count: results.length } as PuzzleHistoryResponse);
  } catch (err) {
    console.error("Error fetching puzzle history:", err);
    return res.status(500).json({ error: "Internal server error" } as ApiError);
  }
});

// GET /words route - fetch all words
app.get("/words", async (_req: express.Request, res: express.Response) => {
  try {
    const wordsSnapshot = await wordsCollection().get();
    const words = wordsSnapshot.docs
      .map((doc) => firestoreToWordEntry(doc))
      .filter((word) => word !== null);

    return res.status(200).json({
      words,
      count: words.length,
    } as WordsResponse);
  } catch (err) {
    console.error("Error fetching words:", err);
    return res.status(500).json({ error: "Internal server error" } as ApiError);
  }
});

// GET /words/:id route - fetch specific word
app.get("/words/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const wordDoc = await wordsCollection().doc(id.toUpperCase()).get();
    const word = firestoreToWordEntry(wordDoc);

    if (!word) {
      return res.status(404).json({
        error: `Word with id "${id}" not found`,
      } as ApiError);
    }

    return res.status(200).json({ word } as WordResponse);
  } catch (err) {
    console.error(`Error fetching word ${req.params.id}:`, err);
    return res.status(500).json({ error: "Internal server error" } as ApiError);
  }
});

// GET /daily-puzzle/today route - fetch current puzzle
// NOTE: This route must come BEFORE the generic /:date route to match correctly
app.get(
  "/daily-puzzle/today",
  async (_req: express.Request, res: express.Response) => {
    try {
      const today = getTodayDateString();
      const puzzleDoc = await dailyPuzzlesCollection().doc(today).get();
      const puzzle = firestoreToDailyPuzzle(puzzleDoc);

      if (!puzzle) {
        return res.status(404).json({
          error: `No puzzle found for today (${today})`,
        } as ApiError);
      }

      return res.status(200).json({ puzzle } as DailyPuzzleResponse);
    } catch (err) {
      console.error("Error fetching today's puzzle:", err);
      return res
        .status(500)
        .json({ error: "Internal server error" } as ApiError);
    }
  }
);

// GET /daily-puzzle/:date route - fetch puzzle for specific date
app.get(
  "/daily-puzzle/:date",
  async (req: express.Request, res: express.Response) => {
    try {
      const { date } = req.params;

      if (!isValidDateFormat(date)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        } as ApiError);
      }

      const puzzleDoc = await dailyPuzzlesCollection().doc(date).get();
      const puzzle = firestoreToDailyPuzzle(puzzleDoc);

      if (!puzzle) {
        return res.status(404).json({
          error: `No puzzle found for date ${date}`,
        } as ApiError);
      }

      return res.status(200).json({ puzzle } as DailyPuzzleResponse);
    } catch (err) {
      console.error(`Error fetching puzzle for date ${req.params.date}:`, err);
      return res
        .status(500)
        .json({ error: "Internal server error" } as ApiError);
    }
  }
);

// POST /daily-puzzle route - manually schedule daily puzzles (for testing/initial seeding)
// TODO: ALPHA ONLY - Manual puzzle scheduling for testing
// Production should use automated puzzle generation algorithm
app.post(
  "/daily-puzzle",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const { date, wordId } = req.body;

      // Validate required fields
      if (!date || !wordId) {
        return res.status(400).json({
          error: "Missing required fields: date and wordId",
        } as ApiError);
      }

      if (!isValidDateFormat(date)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        } as ApiError);
      }

      // Check if word exists
      const wordDoc = await wordsCollection().doc(wordId.toUpperCase()).get();
      const word = firestoreToWordEntry(wordDoc);

      if (!word) {
        return res.status(404).json({
          error: `Word with id "${wordId}" not found`,
        } as ApiError);
      }

      // Check if puzzle for this date already exists
      const existingPuzzleDoc = await dailyPuzzlesCollection().doc(date).get();
      if (existingPuzzleDoc.exists) {
        return res.status(409).json({
          error: `A puzzle for date ${date} already exists`,
        } as ApiError);
      }

      // Create the daily puzzle
      const puzzle = { date, word };
      await dailyPuzzlesCollection().doc(date).set({
        word: word,
      });

      return res.status(201).json({
        message: "Daily puzzle created successfully",
        puzzle,
      });
    } catch (err) {
      console.error("Error creating daily puzzle:", err);
      return res
        .status(500)
        .json({ error: "Internal server error" } as ApiError);
    }
  }
);

export const api = functions.https.onRequest(app);
