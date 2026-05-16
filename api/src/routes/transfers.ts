import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../db.js";

export const transfersRouter = Router();

// GET /api/transfers - the user's sent transfer history.
transfersRouter.get("/", authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;
  const transfers = await db.transfer.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ transfers });
});
