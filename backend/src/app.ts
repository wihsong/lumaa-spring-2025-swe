// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./database";
import tasksRouter from "./routes/tasks";

// NEW: import the auth routes
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT 'Hello from PostgreSQL' AS message");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// NEW: Mount /auth routes
app.use("/auth", authRoutes);

// Existing /tasks routes
app.use("/tasks", tasksRouter);

export default app;
