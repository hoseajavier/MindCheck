import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const [tests, todayMood, moodHistory] = await Promise.all([
    prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    prisma.dailyMood.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
          }),
        },
      },
    }),

    prisma.dailyMood.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

  return Response.json({
    totalTest: await prisma.testResult.count({
      where: { userId },
    }),

    lastTest: tests[0] ?? null,
    history: tests,

    hasFilledMoodToday: !!todayMood,
    todayMood: todayMood?.mood ?? null,

    moodHistory: moodHistory.reverse(),
  });
}