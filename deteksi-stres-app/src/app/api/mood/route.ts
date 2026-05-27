import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Sesuaikan path authOptions Anda
import { prisma } from "@/lib/prisma"; // Sesuaikan path instance prisma Anda

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mood } = await req.json();
    if (!mood) {
      return NextResponse.json({ error: "Mood diperlukan" }, { status: 400 });
    }

    // Ambil data user berdasarkan email session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Ambil tanggal hari ini dalam format lokal waktu Indonesia (YYYY-MM-DD)
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

    // Gunakan upsert: jika hari ini sudah ada maka skip/update, jika belum ada maka create baru
    const dailyMood = await prisma.dailyMood.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayStr,
        },
      },
      update: { mood }, // memperbarui mood jika klik ganti sebelum 24 jam
      create: {
        userId: user.id,
        mood,
        date: todayStr,
      },
    });

    return NextResponse.json({ success: true, dailyMood });
  } catch (error) {
    console.error("Error saving mood:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}