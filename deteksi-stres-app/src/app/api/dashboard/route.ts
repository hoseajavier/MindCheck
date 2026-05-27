import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Ambil semua data TestResult untuk kalkulasi statistik kuisioner stres
  const tests = await prisma.testResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const lastTest = tests[0] || null;

  // 2. Dapatkan string tanggal hari ini dalam format lokal Indonesia (YYYY-MM-DD)
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

  // 3. Cek apakah user sudah mengisi mood khusus untuk tanggal hari ini
  const todayMoodEntry = await prisma.dailyMood.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayStr,
      },
    },
  });

  // 4. Ambil maksimal 7 data mood terbaru untuk kebutuhan grafik batang di dashboard
  const moodHistory = await prisma.dailyMood.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  return Response.json({
    // Data Kuisioner Stres (Tetap dipertahankan)
    totalTest: tests.length,
    lastTest,
    history: tests.slice(0, 3), // Menampilkan 3 riwayat kuisioner teratas di tabel

    // Data Tambahan Baru untuk Mood Tracker
    hasFilledMoodToday: !!todayMoodEntry,
    todayMood: todayMoodEntry ? todayMoodEntry.mood : null,
    moodHistory: moodHistory.reverse(), // Dibalik agar urutan grafik dari kiri (lampau) ke kanan (terbaru)
  });
}