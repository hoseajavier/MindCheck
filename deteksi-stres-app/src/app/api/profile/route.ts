import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ONE_DAY = 1000 * 60 * 60 * 24;

function calculateDayDifference(date1: Date, date2: Date) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diff = d1.getTime() - d2.getTime();

  return Math.floor(diff / ONE_DAY);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let updatedUser = user;

    if (user.lastQuizDate) {
      const now = new Date();

      const lastQuiz = new Date(user.lastQuizDate);

      const diffDays = calculateDayDifference(
        now,
        lastQuiz
      );

      if (diffDays > 1 && user.streak > 0) {
        updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            streak: 0,
          },
        });
      }
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },

      data: {
        displayName: body.displayName,
        bio: body.bio,
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.user.delete({
      where: {
        email: session.user.email,
      },
    });

    return NextResponse.json({
      message: "Akun berhasil dihapus",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal menghapus akun" },
      { status: 500 }
    );
  }
}