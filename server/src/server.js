
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Security middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map(url => url.trim())
    : "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "ProjectMate Backend is running successfully!",
    status: "OK",
    service: "ProjectMate API"
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ProjectMate API",
    database: "connected"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

// Server startup
const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`ProjectMate API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
