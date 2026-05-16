import type { Request, Response, NextFunction } from "express";
import { db } from "../db.js";

// Bearer-token auth. Token == user id in this demo stub.
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "missing token" });

  const user = await db.user.findUnique({ where: { id: token } });
  if (!user) return res.status(401).json({ error: "invalid token" });

  (req as any).user = user;
  next();
}
