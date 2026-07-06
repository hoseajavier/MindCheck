"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SkeletonLoading from "@/components/SkeletonLoading";
import { Calendar, CheckCircle, Lightbulb, Smile, Frown, AlertCircle, BatteryLow, Flame, Heart, Info } from "lucide-react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [tip, setTip] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hasSubmittingMood, setHasSubmittingMood] = useState(false);

  const tips = [
    "Ambil napas dalam selama 5 detik, tahan, dan lepaskan perlahan.",
    "Luangkan waktu 10 menit untuk berjalan santai di luar ruangan tanpa ponsel.",
    "Tuliskan 3 hal kecil yang paling kamu syukuri hari ini di selembar kertas.",
    "Kurangi screen time minimal 30 menit sebelum kamu memejamkan mata untuk tidur.",
    "Coba meditasi singkat atau mindfulness selama 5 menit untuk menenangkan pikiran.",
    "Minum segelas air putih hangat dan regangkan otot bahu serta lehermu saat ini.",
    "Dengarkan satu lagu instrumental favoritmu sambil duduk bersandar dengan rileks.",
    "Batasi konsumsi kafein berlebih hari ini jika kamu sedang merasa cemas.",
    "Jangan ragu untuk mengatakan 'tidak' pada hal yang sekiranya membebani kapasitasmu hari ini.",
    "Istirahatkan matamu dengan metode 20-20-20: setiap 20 menit, tatap objek sejauh 20 kaki selama 20 detik.",
  ];

  const moodOptions = [
    { label: "Senang", icon: Smile, color: "text-emerald-500 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
    { label: "Tenang", icon: Heart, color: "text-teal-500 bg-teal-50 border-teal-200 hover:bg-teal-100" },
    { label: "Lelah", icon: BatteryLow, color: "text-purple-500 bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { label: "Cemas", icon: AlertCircle, color: "text-amber-500 bg-amber-50 border-amber-200 hover:bg-amber-100" },
    { label: "Sedih", icon: Frown, color: "text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { label: "Marah", icon: Flame, color: "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100" },
  ];

  const getRandomTip = () => tips[Math.floor(Math.random() * tips.length)];

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);

      if (json.hasFilledMoodToday) {
        setSelectedMood(json.todayMood);
        setHasSubmittingMood(true);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    }
  };

  useEffect(() => {
    const initData = async () => {
      await fetchDashboardData();
      setTip(getRandomTip());
      setLoading(false);
    };

    if (session) initData();
  }, [session]);

  const handleMoodSubmit = async (moodLabel: string) => {
    setSelectedMood(moodLabel);
    setHasSubmittingMood(true);

    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodLabel }),
      });

      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Gagal menyimpan data mood ke server:", error);
    }
  };

  const getColor = (level: string) => {
    if (level === "Rendah") return "bg-emerald-500";
    if (level === "Sedang") return "bg-amber-500";
    return "bg-rose-500";
  };

  const chartData =
    data?.history
      ?.slice(0, 5)
      ?.reverse()
      ?.map((item: any, index: number) => ({
        id: `${item.id}-${index}`,
        datetime: new Date(item.createdAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        stress: item.level === "Rendah" ? 1 : item.level === "Sedang" ? 2 : 3,
        label: item.level,
      })) || [];

  const moodChartData =
    data?.moodHistory?.map((item: any) => ({
      date: new Date(item.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      moodValue:
        item.mood === "Senang" ? 6 : item.mood === "Tenang" ? 5 : item.mood === "Lelah" ? 4 : item.mood === "Cemas" ? 3 : item.mood === "Sedih" ? 2 : 1,
      moodLabel: item.mood,
    })) || [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <SkeletonLoading />
      </div>
    );
  }

  const displayName = session?.user?.displayName || session?.user?.name || "User";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-10 pt-20 md:pt-10 max-w-[1400px] mx-auto w-full space-y-6 md:space-y-8 overflow-y-auto">
        
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C3E50] tracking-tight">
            Halo, {displayName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Bagaimana kondisi ketenangan pikiranmu hari ini?
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 md:p-5 shadow-2xs">
          <h2 className="font-bold text-amber-800 text-sm flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-amber-600 shrink-0" /> Informasi Penting
          </h2>
          <p className="text-xs sm:text-sm text-amber-700 leading-relaxed opacity-90">
            Hasil prediksi tingkat stres pada sistem ini merupakan deteksi awal (skrining mandiri) dan <strong>bukan diagnosis klinis</strong>. Untuk evaluasi medis yang komprehensif, disarankan berkonsultasi dengan profesional kesehatan mental.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-linear-to-br from-[#B9E6E1] via-[#CBEFE6] to-[#E3F8F2] rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xs border border-[#A3D5CF]/30 relative overflow-hidden">
            <div className="space-y-2 md:space-y-3 z-10">
              <span className="inline-block bg-white/70 text-[#2C3E50] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Kuisioner Utama
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1A2E3B] leading-tight pt-2">
                Jaga Keseimbangan <br /> Pikiran dan Mentalmu
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm max-w-sm leading-relaxed">
                Luangkan waktu 5 menit untuk menjawab pertanyaan guna mengetahui beban stres psikologis Anda saat ini.
              </p>
            </div>
            <div className="mt-5 md:mt-6 z-10">
              <button
                onClick={() => router.push("/kuisioner")}
                className="w-full sm:w-auto bg-[#6FA8A1] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#598F88] active:scale-[0.98] transition-all shadow-xs cursor-pointer text-center"
              >
                Mulai Kuisioner
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-[#6FA8A1] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Tes Terakhir</p>
                {data?.lastTest ? (
                  <div className="mt-0.5 truncate">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                      {formatDate(data.lastTest.createdAt)}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Status: <span className="text-[#6FA8A1] font-bold">{data.lastTest.level}</span>
                    </p>
                  </div>
                ) : (
                  <h3 className="text-sm sm:text-base font-bold text-gray-400 mt-0.5">Belum ada tes</h3>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">Total Evaluasi</p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {data?.totalTest || 0} <span className="text-xs sm:text-sm font-normal text-gray-400">kali</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-2xs border border-gray-100 flex flex-col justify-between gap-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#2C3E50]">Mood Tracker Harian</h3>
              <p className="text-xs text-gray-400 mt-0.5">Catat suasana hatimu sekali dalam kurun waktu 24 jam.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedMood === option.label;
                return (
                  <button
                    key={option.label}
                    disabled={hasSubmittingMood}
                    onClick={() => handleMoodSubmit(option.label)}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 border rounded-xl transition-all duration-200 gap-1 text-[11px] font-bold
                      ${isSelected ? "border-current ring-2 ring-[#6FA8A1] bg-slate-50" : option.color} 
                      ${hasSubmittingMood ? (isSelected ? "opacity-100 cursor-not-allowed" : "opacity-40 cursor-not-allowed grayscale") : "cursor-pointer"}`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="truncate w-full text-center">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={`rounded-xl p-2.5 text-center border text-xs font-medium ${hasSubmittingMood ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-slate-50 border-slate-100 text-gray-500"}`}>
              {hasSubmittingMood ? `✓ Jurnal emosi "${selectedMood}" tersimpan.` : "Bagaimana suasana hatimu saat ini?"}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#D4EFEA] p-5 sm:p-6 rounded-3xl border border-[#A3D5CF]/40 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-white/90 p-2 rounded-xl text-[#4A7c75] shadow-2xs shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#2C3E50]">Rekomendasi Tindakan</h3>
                <p className="text-xs text-gray-500">Langkah kecil harian untuk meredakan ketegangan beban pikiran.</p>
              </div>
            </div>
            <div className="my-2 bg-white/60 border border-white p-4 rounded-2xl flex-1 flex items-center">
              <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                "{tip}"
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={() => setTip(getRandomTip())}
                className="text-xs font-bold text-[#4A7c75] hover:underline cursor-pointer"
              >
                Ganti Tip Lain &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-base sm:text-lg text-[#2C3E50]">Grafik Tingkat Stres</h3>
              <p className="text-xs text-gray-400">Analisis garis dari evaluasi berkala Anda.</p>
            </div>
            <div className="h-60 sm:h-72 w-full text-[10px] sm:text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="datetime" tick={{ fill: "#94A3B8" }} />
                  <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tick={{ fill: "#94A3B8" }} tickFormatter={(val) => val === 1 ? "Rendah" : val === 2 ? "Sedang" : "Tinggi"} />
                  <Tooltip content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-white border border-gray-100 rounded-xl shadow-md p-2.5 text-xs">
                      <p className="font-bold text-gray-700">{payload[0].payload.datetime}</p>
                      <p className="text-[#6FA8A1] font-bold mt-0.5">Stres: {payload[0].payload.label}</p>
                    </div>
                  ) : null} />
                  <Line type="monotone" dataKey="stress" stroke="#6FA8A1" strokeWidth={3} dot={{ r: 4, fill: "#6FA8A1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-base sm:text-lg text-[#2C3E50]">Grafik Suasana Hati Sepekan</h3>
              <p className="text-xs text-gray-400">Rangkuman grafik emosi harian Anda yang tersimpan.</p>
            </div>
            <div className="h-60 sm:h-72 w-full text-[10px] sm:text-xs">
              {moodChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed rounded-2xl border-gray-200 text-gray-400 p-4 text-center">
                  Belum ada riwayat perekaman mood minggu ini.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fill: "#94A3B8" }} />
                    <YAxis domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} tick={{ fill: "#94A3B8" }} tickFormatter={(val) => val === 6 ? "Senang" : val === 5 ? "Tenang" : val === 4 ? "Lelah" : val === 3 ? "Cemas" : val === 2 ? "Sedih" : "Marah"} />
                    <Tooltip content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-white border border-gray-100 rounded-xl shadow-md p-2.5 text-xs">
                        <p className="font-bold text-gray-700">{payload[0].payload.date}</p>
                        <p className="text-teal-600 font-bold mt-0.5">Mood: {payload[0].payload.moodLabel}</p>
                      </div>
                    ) : null} />
                    <Bar dataKey="moodValue" fill="#85C1C9" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-2xs border border-gray-100">
          <div className="flex justify-between items-center mb-5 gap-2">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#2C3E50]">Riwayat Kuisioner Terbaru</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daftar rekaman riwayat pengerjaan tes.</p>
            </div>
            <button onClick={() => router.push("/user/riwayat")} className="text-xs sm:text-sm font-bold text-[#6FA8A1] hover:underline shrink-0 cursor-pointer">
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[600px] space-y-2">
              <div className="grid grid-cols-4 text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-2 tracking-wider uppercase">
                <span>Tanggal</span>
                <span>Waktu</span>
                <span>Tingkat Stres</span>
                <span className="text-right">Aksi</span>
              </div>

              {!data?.history || data.history.length === 0 ? (
                <div className="text-center py-8 text-xs sm:text-sm text-gray-400">Belum ada riwayat hasil tes kuisioner.</div>
              ) : (
                data.history.map((item: any) => (
                  <div key={item.id} className="grid grid-cols-4 items-center border-b border-gray-50 py-3 text-xs sm:text-sm text-gray-600 hover:bg-slate-50/50 rounded-xl px-1 transition duration-150">
                    <span className="font-semibold text-gray-800">{new Date(item.createdAt).toLocaleDateString("id-ID")}</span>
                    <span className="text-gray-400">{new Date(item.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getColor(item.level)} shrink-0`} />
                      <span className="font-medium text-gray-700">{item.level}</span>
                    </div>
                    <div className="text-right">
                      <button onClick={() => router.push(`/user/hasil/${item.id}`)} className="text-[11px] font-bold text-[#6FA8A1] border border-[#6FA8A1]/20 hover:bg-[#6FA8A1] hover:text-white px-2.5 py-1.5 rounded-lg transition cursor-pointer">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}