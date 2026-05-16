import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.get("/me", authMiddleware, async (req, res) => {
  res.json({ user: (req as any).user });
});
