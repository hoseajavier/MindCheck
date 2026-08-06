"use client";

import Sidebar from "@/components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import SkeletonLoading from "@/components/SkeletonLoading";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  Activity,
  BarChart3,
  Sliders,
} from "lucide-react";

export default function HasilPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res, qRes] = await Promise.all([
          fetch(`/api/test-result/${id}`),
          fetch("/api/pertanyaan"),
        ]);

        if (!res.ok || !qRes.ok) throw new Error("Gagal mengambil data");

        setResult(await res.json());
        setQuestions(await qRes.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const answerLabels = [
    "Tidak Pernah",
    "Jarang",
    "Kadang-kadang",
    "Sering",
    "Sangat Sering",
  ];

  const label = result?.level;
  const answers = result?.answers || [];

  const featureImportances = [
    {
      name: "Gerak Mata (REM)",
      key: "eye_movement",
      weight: 16.99,
    },
    {
      name: "Frekuensi Napas",
      key: "respiration_rate",
      weight: 15.7,
    },
    {
      name: "Detak Jantung",
      key: "heart_rate",
      weight: 13.71,
    },
    {
      name: "Tingkat Dengkuran",
      key: "snoring_rate",
      weight: 12.96,
    },
    {
      name: "Suhu Tubuh",
      key: "body_temperature",
      weight: 12.12,
    },
    {
      name: "Gerak Tubuh",
      key: "limb_movement",
      weight: 11.29,
    },
    {
      name: "Kadar Oksigen",
      key: "blood_oxygen",
      weight: 9.6,
    },
    {
      name: "Durasi Tidur",
      key: "sleeping_hours",
      weight: 7.59,
    },
  ];

  const biometricsCalculated = useMemo(() => {
    if (answers.length === 0 || questions.length === 0) return [];

    const groups: Record<string, number[]> = {};
    questions.forEach((q, index) => {
      if (!groups[q.category]) groups[q.category] = [];
      groups[q.category].push(answers[index] || 0);
    });

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const featureConfigs = [
      {
        key: "SNORING_RATE",
        name: "Tingkat Dengkuran",
        min: 45,
        max: 100,
        unit: "dB",
        inverse: false,
      },
      {
        key: "RESPIRATION_RATE",
        name: "Frekuensi Napas",
        min: 16,
        max: 30,
        unit: "pm",
        inverse: false,
      },
      {
        key: "BODY_TEMPERATURE",
        name: "Suhu Tubuh",
        min: 85,
        max: 99,
        unit: "°F",
        inverse: false,
      },
      {
        key: "LIMB_MOVEMENT",
        name: "Gerak Tubuh",
        min: 4,
        max: 19,
        unit: "skor",
        inverse: false,
      },
      {
        key: "BLOOD_OXYGEN",
        name: "Kadar Oksigen",
        min: 82,
        max: 97,
        unit: "%",
        inverse: true,
      },
      {
        key: "EYE_MOVEMENT",
        name: "Gerak Mata",
        min: 60,
        max: 105,
        unit: "skor",
        inverse: false,
      },
      {
        key: "SLEEPING_HOURS",
        name: "Durasi Tidur",
        min: 0,
        max: 9,
        unit: "jam",
        inverse: true,
      },
      {
        key: "HEART_RATE",
        name: "Detak Jantung",
        min: 50,
        max: 85,
        unit: "bpm",
        inverse: false,
      },
    ];

    return featureConfigs.map((cfg) => {
      const val = avg(groups[cfg.key] || [0]);
      const range = cfg.max - cfg.min;
      const calculated = cfg.inverse
        ? cfg.max - (val / 4) * range
        : cfg.min + (val / 4) * range;

      return {
        name: cfg.name,
        value: calculated.toFixed(1),
        unit: cfg.unit,
        min: cfg.min,
        max: cfg.max,
        inverse: cfg.inverse,
      };
    });
  }, [answers, questions]);

  const theme = useMemo(() => {
    if (label === "Rendah") {
      return {
        bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        cardBg: "bg-emerald-50/50 border-emerald-100",
        text: "text-emerald-800",
        badge: "bg-emerald-100 text-emerald-800",
        emoji: "😊",
        desc: "Kondisi Anda berada dalam rentang stres yang wajar dan masih terkelola dengan baik. Stres dalam kadar ini normal dan bisa membentuk kemampuan menghadapi tantangan sehari-hari. Pertahankan kebiasaan sehat Anda: tidur cukup 7 jam atau lebih dengan jadwal teratur, tetap aktif bergerak, dan jaga pola makan seimbang.",
      };
    }
    if (label === "Sedang") {
      return {
        bg: "bg-gradient-to-br from-amber-400 to-orange-500",
        cardBg: "bg-amber-50/50 border-amber-100",
        text: "text-amber-800",
        badge: "bg-amber-100 text-amber-800",
        emoji: "😐",
        desc: "Tubuh Anda mulai menunjukkan tanda tekanan kognitif dan kelelahan fisik. Teknik pernapasan dalam (tarik napas 5 detik, tahan 2 detik, hembuskan 5 detik) dapat membantu menenangkan sistem saraf dan meredakan respons stres tubuh. Ambil jeda sejenak, kurangi beban aktivitas, dan jaga asupan nutrisi seimbang.",
      };
    }
    return {
      bg: "bg-gradient-to-br from-rose-500 to-red-600",
      cardBg: "bg-rose-50/50 border-rose-100",
      text: "text-rose-800",
      badge: "bg-rose-100 text-rose-800",
      emoji: "😟",
      desc: "Tingkat stres Anda tergolong tinggi dan berpotensi berdampak pada kesehatan fisik maupun emosional dalam jangka panjang. Jika strategi mandiri terasa tidak cukup membantu dan Anda merasa kewalahan, sangat disarankan untuk berkonsultasi dengan psikolog atau tenaga profesional kesehatan mental untuk mendapatkan penanganan yang lebih terarah.",
    };
  }, [label]);

  if (loading || !result) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 p-5 md:p-10 pt-20 md:pt-10 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#6FA8A1] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </button>
        </div>

        <div className="text-center md:text-left border-b border-gray-100 pb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E2F2F0] text-[#4A7c75] rounded-full text-xs font-bold tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5" /> Hasil Analisis Prediksi
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C3E50] tracking-tight mt-2">
            Ringkasan Kesehatan Mental Anda
          </h1>
        </div>

        <div
          className={`${theme.bg} rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}
        >
          <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
              Tingkat Stres Terdeteksi
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
              <span>{theme.emoji}</span> {label}
            </h2>
            <p className="text-white/90 text-sm leading-relaxed font-medium pt-1">
              {theme.desc}
            </p>
            <div className="text-white/60 text-xs font-mono pt-2">
              Waktu Pemeriksaan:{" "}
              {new Date(result.createdAt).toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short",
              })}{" "}
              WIB
            </div>
          </div>
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xs border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#6FA8A1]" />
              <div>
                <h3 className="font-bold text-base text-[#2C3E50]">
                  Parameter Indikator Biometrik
                </h3>
                <p className="text-[11px] text-gray-400">
                  Nilai variabel hasil ekstraksi dari jawaban kuisioner Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {biometricsCalculated.map((bio, index) => {
                const currentVal = parseFloat(bio.value);

                const rawPercentage =
                  ((currentVal - bio.min) / (bio.max - bio.min)) * 100;

                const percentage = bio.inverse
                  ? 100 - rawPercentage
                  : rawPercentage;
                const boundedPercentage = Math.min(
                  Math.max(percentage, 0),
                  100,
                );

                const isWarning = boundedPercentage > 65;

                return (
                  <div
                    key={index}
                    className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-2 shadow-sm"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-700 truncate">
                          {bio.name}
                        </h4>
                      </div>

                      <span
                        className={`text-xs font-black shrink-0 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap ${
                          isWarning
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-[#4A7c75]"
                        }`}
                      >
                        {bio.value}{" "}
                        <span className="text-[9px] font-bold">{bio.unit}</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? "bg-rose-500" : "bg-[#6FA8A1]"
                        }`}
                        style={{ width: `${boundedPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#6FA8A1]" />
              <div>
                <h3 className="font-bold text-base text-[#2C3E50]">
                  Bobot Kontribusi Fitur
                </h3>
                <p className="text-[11px] text-gray-400">
                  Tingkat pengaruh indikator terhadap akurasi Random Forest.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {featureImportances.map((feat, index) => {
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700 flex items-center gap-1">
                          {feat.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-gray-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {feat.weight}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-slate-400/80`}
                        style={{ width: `${(feat.weight / 17) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpenDetail(!openDetail)}
            className="w-full flex justify-between items-center p-5 md:p-6 text-left cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#6FA8A1]" />
              <h3 className="font-bold text-base md:text-lg text-[#2C3E50]">
                Uraian Lembar Detail Jawaban Kuisioner
              </h3>
            </div>
            <div className="p-1 bg-slate-100 rounded-lg text-gray-500">
              {openDetail ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {openDetail && (
            <div className="p-5 md:p-6 border-t border-gray-100 bg-slate-50/50 space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-700">
                  Daftar Rekaman Jawaban Lengkap
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 border border-gray-200/60 rounded-xl bg-white p-3 shadow-2xs">
                  {questions.map((q, index) => {
                    const score = answers[index];

                    const questionText = typeof q === "string" ? q : q.question;

                    return (
                      <div
                        key={q.id || index}
                        className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 last:border-0 py-3 px-2 gap-2 text-xs md:text-sm"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                            Soal {index + 1}
                          </span>
                          <p className="font-medium text-gray-700">
                            {questionText}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 md:self-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0
            ${score >= 3 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-gray-600"}`}
                          >
                            {answerLabels[score] !== undefined
                              ? answerLabels[score]
                              : "Belum dijawab"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
