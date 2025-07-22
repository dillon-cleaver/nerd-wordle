import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { ApiError, WinRecordRequest, WinRecordResponse } from "../../types/api";

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

// POST /win route
app.post(
  "/win",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const { uid } = req.user!;
      const { id, word, attempts, date, edition, hintIndex }: WinRecordRequest =
        req.body;

      // Validate required fields
      if (!id || !word || attempts === undefined || !date) {
        return res.status(400).json({
          error: "Missing required fields: id, word, attempts, or date",
        } as ApiError);
      }

      // Check if win with this id already exists
      const winRef = db
        .collection("users")
        .doc(uid)
        .collection("winHistory")
        .doc(id);

      const existingWin = await winRef.get();

      if (existingWin.exists) {
        return res.status(409).json({
          error: "A win with this id already exists",
        } as ApiError);
      }

      // Store the win data (covert date string to Firestore timestamp)
      const winData = {
        id,
        word,
        attempts,
        date: new Date(date),
        edition: edition || 1,
        hintIndex: hintIndex || 0,
      };

      await winRef.set(winData);

      // Return the original request format
      const responseData: WinRecordRequest = {
        id,
        word,
        attempts,
        date,
        edition,
        hintIndex,
      };

      return res.status(200).json({
        message: "Win recorded successfully",
        data: responseData,
      } as WinRecordResponse);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET / win route
// HERE --->

export const api = functions.https.onRequest(app);
