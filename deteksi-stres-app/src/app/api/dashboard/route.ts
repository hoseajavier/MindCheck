import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const tests = await prisma.testResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const lastTest = tests[0] || null;

  const todayStr = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });

  const todayMoodEntry = await prisma.dailyMood.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayStr,
      },
    },
  });

  const moodHistory = await prisma.dailyMood.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  return Response.json({
    totalTest: tests.length,
    lastTest,
    history: tests.slice(0, 3),

    hasFilledMoodToday: !!todayMoodEntry,
    todayMood: todayMoodEntry ? todayMoodEntry.mood : null,
    moodHistory: moodHistory.reverse(),
  });
}
