// src/routes/auth.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database";
// Optional: If you want JWT:
import jwt from "jsonwebtoken";

const router = Router();

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertResult = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username`,
      [username, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    // (Optional) Create a JWT token right after register:
    const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
      },
      // token, // if you want to return token on register
    });
  } catch (error) {
    console.error("POST /auth/register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // (Optional) Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return res.json({ 
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("POST /auth/login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
