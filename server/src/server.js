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
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.get("/api/health", (req,res)=>res.json({ status:"ok", service:"ProjectMate API" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(()=>app.listen(port, ()=>console.log(`ProjectMate API listening on ${port}`)))
  .catch(err=>{ console.error("Startup failed:", err.message); process.exit(1); });
