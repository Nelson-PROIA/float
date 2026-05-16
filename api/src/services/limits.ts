import { db } from "../db.js";

// Returns true if the user has remaining capacity to send `amount` today.
// Sums today's completed transfers sent by this user and compares
// against their dailySpendLimit.
export async function checkDailyLimit(userId: string, amount: number) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todays = await db.transfer.findMany({
    where: {
      senderId: userId,
      createdAt: { gte: startOfDay },
      status: "completed",
    },
  });

  const sentToday = todays.reduce((sum, t) => sum + t.amount, 0);
  return sentToday + amount <= user.dailySpendLimit;
}
