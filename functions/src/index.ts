import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {
  ApiError,
  PuzzleHistoryResponse,
  PuzzleResultRequest,
  PuzzleResultResponse,
} from "./types";

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

export const api = functions.https.onRequest(app);
