"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SkeletonLoading from "@/components/SkeletonLoading";
import { ChevronLeft, ChevronRight, HelpCircle, Check } from "lucide-react";

const questions = [
  "Seberapa sering Anda mendengkur saat tidur?",
  "Seberapa sering Anda terbangun karena suara dengkuran sendiri?",
  "Seberapa sering orang lain mengatakan Anda mendengkur keras?",
  "Seberapa sering napas Anda terasa cepat saat istirahat?",
  "Seberapa sering Anda merasa sesak napas ringan?",
  "Seberapa sering Anda bernapas tidak teratur saat cemas?",
  "Seberapa sering tubuh Anda terasa lebih panas tanpa aktivitas berat?",
  "Seberapa sering Anda berkeringat saat merasa stres?",
  "Seberapa sering tubuh Anda terasa panas saat sulit tidur?",
  "Seberapa sering tubuh Anda bergerak saat tidur?",
  "Seberapa sering kaki atau tangan bergerak tanpa sadar saat tidur?",
  "Seberapa sering Anda merasa gelisah saat beristirahat?",
  "Seberapa sering Anda merasa kekurangan oksigen?",
  "Seberapa sering Anda merasa napas terasa pendek saat tidur?",
  "Seberapa sering Anda merasa pusing setelah bangun tidur?",
  "Seberapa sering mata terasa sulit rileks saat malam hari?",
  "Seberapa sering mata Anda terasa lelah akibat kurang tidur?",
  "Seberapa sering Anda mengalami mimpi berlebihan atau tidur gelisah?",
  "Seberapa sering Anda tidur kurang dari 7 jam?",
  "Seberapa sering Anda sulit tidur di malam hari?",
  "Seberapa sering Anda terbangun di kandungan tengah malam?",
  "Seberapa sering detak jantung terasa cepat?",
  "Seberapa sering Anda merasa jantung berdebar saat stres?",
  "Seberapa sering Anda merasa cemas tanpa sebab yang jelas?",
];

const options = [
  "Tidak Pernah",
  "Jarang",
  "Kadang-kadang",
  "Sering",
  "Sangat Sering",
];

export default function KuisionerPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const total = questions.length;
  const progress = ((current + 1) / total) * 100;

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);

    if (current < total - 1) {
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
      }, 250);
    }
  };

  const next = async () => {
    if (answers[current] === undefined) return;
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      await submitAnswers();
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const mapToModelInput = () => {
    return {
      snoring_rate: 45 + avg(answers.slice(0, 3)) * 13.75,
      respiration_rate: 16 + avg(answers.slice(3, 6)) * 3.5,
      body_temperature: 85 + avg(answers.slice(6, 9)) * 3.5,
      limb_movement: 4 + avg(answers.slice(9, 12)) * 3.75,
      blood_oxygen: 97 - avg(answers.slice(12, 15)) * 3.75,
      eye_movement: 60 + avg(answers.slice(15, 18)) * 11,
      sleeping_hours: 9 - avg(answers.slice(18, 21)) * 2.25,
      heart_rate: 50 + avg(answers.slice(21, 24)) * 8.75,
    };
  };

  const submitAnswers = async () => {
    try {
      setSubmitLoading(true);
      const payload = mapToModelInput();

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal prediksi");
      const data = await res.json();
      const score = answers.reduce((a, b) => a + b, 0);

      const saveRes = await fetch("/api/test-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, level: data.label, answers }),
      });

      if (!saveRes.ok) throw new Error("Gagal menyimpan");
      const savedData = await saveRes.json();
      router.push(`/hasil/${savedData.id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan hasil");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading || submitLoading) {
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

      <div className="flex-1 p-4 sm:p-6 md:p-10 pt-20 md:pt-10 max-w-4xl mx-auto w-full flex flex-col justify-start gap-4">
        {/* HEADER */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2C3E50] tracking-tight">
            Kuisioner Deteksi Tingkat Stres
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
            Isilah kuisioner berikut sesuai dengan kondisi objektif Anda
            belakangan ini.
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              Progres Pengisian
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#6FA8A1] bg-[#E2F2F0] px-2.5 py-0.5 rounded-full">
              {current + 1} / {total} Soal
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#6FA8A1] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* MAIN QUESTION CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xs border border-gray-100/80 p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-[#6FA8A1]">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Pertanyaan Ke-{current + 1}
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#2C3E50] leading-relaxed">
              {questions[current]}
            </h2>
          </div>

          {/* LIKERT OPTIONS GRID */}
          <div className="my-6 space-y-2.5">
            {options.map((opt, i) => {
              const isChecked = answers[current] === i;
              return (
                <label
                  key={i}
                  className={`flex items-center justify-between border rounded-xl sm:rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 group
                    ${isChecked ? "bg-[#E2F2F0] border-[#6FA8A1] text-[#244b46] ring-1 ring-[#6FA8A1]" : "bg-white border-gray-200/80 hover:border-gray-300 hover:bg-slate-50 text-gray-700"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0
                      ${isChecked ? "border-[#6FA8A1] bg-[#6FA8A1] text-white" : "border-gray-300 bg-white group-hover:border-gray-400"}`}
                    >
                      {isChecked && (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm md:text-base ${isChecked ? "font-bold" : "font-medium"}`}
                    >
                      {opt}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name={`question-${current}`}
                    checked={isChecked}
                    onChange={() => handleSelect(i)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0
                ${current === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60" : "bg-slate-100 hover:bg-slate-200 text-gray-700 cursor-pointer active:scale-95"}`}
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>

            <button
              onClick={next}
              disabled={answers[current] === undefined}
              className={`flex items-center gap-1 px-5 py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-3xs shrink-0
                ${answers[current] === undefined ? "bg-[#6FA8A1]/40 cursor-not-allowed" : "bg-[#6FA8A1] hover:bg-[#598F88] hover:shadow-xs cursor-pointer active:scale-95"}`}
            >
              {current === total - 1 ? (
                <>Kalkulasi &gt;</>
              ) : (
                <>
                  Lanjut <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
