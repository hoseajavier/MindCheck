import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { calculateStreak } from "@/lib/streak";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession();

    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.log("Data to save:", {
      userId: user.id,
      score: body.score,
      level: body.level,
      answers: body.answers,
    });

    const validLevels = ["Rendah", "Sedang", "Tinggi"];
    const level = validLevels.includes(body.level)
      ? body.level
      : "Tidak Terdeteksi";

    const result = await prisma.testResult.create({
      data: {
        userId: user.id,
        score: Number(body.score),
        level: level,
        answers: body.answers as any,
      },
    });

    const lastQuizDate = user.lastQuizDate || new Date(0);
    const currentStreak = user.streak || 0;
    const newStreak = calculateStreak(lastQuizDate, currentStreak);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: newStreak,
        lastQuizDate: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("DETAIL ERROR BACKEND:", error.message);
    return NextResponse.json(
      { error: "Failed to save", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json([]);
    }

    const results = await prisma.testResult.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
