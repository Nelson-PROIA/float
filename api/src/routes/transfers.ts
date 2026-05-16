import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../db.js";
import { checkDailyLimit } from "../services/limits.js";

export const transfersRouter = Router();

// GET /api/transfers
// Returns the user's transfer activity - both sent AND received transfers,
// merged into a single chronological feed.
//
// Response shape changed: each item now has a `direction` discriminator
// ("sent" | "received"). Clients that previously assumed a flat list of
// sent transfers need to update.
transfersRouter.get("/", authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;

  const [sent, received] = await Promise.all([
    db.transfer.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.transfer.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const activity = [
    ...sent.map((t) => ({ direction: "sent" as const, ...t })),
    ...received.map((t) => ({ direction: "received" as const, ...t })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json({ activity });
});

// POST /api/transfers - send money to another user.
transfersRouter.post("/", authMiddleware, async (req, res) => {
  const senderId = (req as any).user.id;
  const { recipientId, amount, memo } = req.body;

  const ok = await checkDailyLimit(senderId, amount);
  if (!ok) return res.status(400).json({ error: "daily spend limit exceeded" });

  const transfer = await db.transfer.create({
    data: { senderId, recipientId, amount, memo, status: "completed" },
  });
  res.json({ transfer });
});
