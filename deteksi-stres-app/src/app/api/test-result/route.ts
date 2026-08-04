import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { calculateStreak } from "@/lib/streak";
import { encrypt, decrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validLevels = ["Rendah", "Sedang", "Tinggi"];

    const level = validLevels.includes(body.level)
      ? body.level
      : "Tidak Terdeteksi";

    const encryptedAnswers = encrypt(JSON.stringify(body.answers));

    const result = await prisma.testResult.create({
      data: {
        userId: userId,
        level,
        answers: encryptedAnswers,
      },
    });

    const lastQuizDate = user.lastQuizDate || new Date(0);
    const currentStreak = user.streak || 0;

    const newStreak = calculateStreak(lastQuizDate, currentStreak);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        streak: newStreak,
        lastQuizDate: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("DETAIL ERROR BACKEND:", error.message);

    return NextResponse.json(
      {
        error: "Failed to save",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const results = await prisma.testResult.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const decryptedResults = results.map((result) => ({
      ...result,
      answers: JSON.parse(decrypt(result.answers)),
    }));

    return NextResponse.json(decryptedResults);
  } catch (error) {
    console.error("GET Test Result Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
