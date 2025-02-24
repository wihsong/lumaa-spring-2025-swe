import { Router, Request, Response } from "express";
import pool from "../database";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Protect all task routes with authMiddleware
router.use(authMiddleware);

// GET /tasks
router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;  // userId from token
  try {
    // Only fetch tasks for this user
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE "userId" = $1
       ORDER BY id ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving tasks" });
  }
});

// POST /tasks
router.post("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    // Insert new task for this user
    const result = await pool.query(
      `INSERT INTO tasks (title, description, "userId")
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating task" });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { title, description, isComplete } = req.body;

  try {
    // Ensure the task belongs to the logged-in user
    const existing = await pool.query(
      `SELECT * FROM tasks
       WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Update the task
    const updated = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, "isComplete" = $3
       WHERE id = $4
       RETURNING *`,
      [title, description, isComplete, id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  try {
    // Ensure the task belongs to this user
    const existing = await pool.query(
      `SELECT * FROM tasks
       WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Delete the task
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

export default router;
