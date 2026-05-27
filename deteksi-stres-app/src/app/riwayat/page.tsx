"use client";

import Sidebar from "@/components/Sidebar";
import {
  Smile,
  Meh,
  Frown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import SkeletonLoading from "@/components/SkeletonLoading";

export default function RiwayatPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("terbaru");

  const router = useRouter();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/test-result");
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let data = [...history];

    if (activeFilter) {
      data = data.filter((item: any) => item.level === activeFilter);
    }

    data.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "terbaru" ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [history, activeFilter, sortBy]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortBy]);

  // SINKRONISASI WARNA INDIKATOR DENGAN DASHBOARD
  const getColor = (level: string) => {
    if (level === "Rendah") return "bg-emerald-500";
    if (level === "Sedang") return "bg-amber-500";
    return "bg-rose-500";
  };

  const countLevel = (level: string) =>
    history.filter((h: any) => h.level === level).length;

  const toggleFilter = (level: string) => {
    if (activeFilter === level) {
      setActiveFilter(null);
    } else {
      setActiveFilter(level);
    }
  };

  const stabilityRate = useMemo(() => {
    if (history.length === 0) return 0;
    const lowStress = history.filter((h: any) => h.level === "Rendah").length;
    return Math.round((lowStress / history.length) * 100);
  }, [history]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 p-5 md:p-10 pt-20 md:pt-10 max-w-[1400px] mx-auto w-full space-y-8 overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C3E50] tracking-tight">
              Riwayat Kuisioner
            </h1>
            <p className="text-gray-500 mt-1">
              Pantau fluktuasi kondisi psikologis Anda secara berkala untuk menjaga stabilitas pikiran.
            </p>
          </div>
        </div>

        {/* SUMMARY CARD FILTERS */}
        <div className="grid sm:grid-cols-3 gap-5">
          <button
            onClick={() => toggleFilter("Rendah")}
            className={`group rounded-2xl p-5 bg-white border transition-all duration-200 text-left flex items-center justify-between shadow-2xs cursor-pointer
              ${activeFilter === "Rendah"
                ? "border-emerald-500 ring-4 ring-emerald-50/70"
                : "border-gray-100 hover:border-emerald-200 hover:shadow-xs"
              }
            `}
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500 w-fit">
                <Smile className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level Rendah</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-gray-800 block group-hover:scale-105 transition-transform">{countLevel("Rendah")}</span>
              <span className="text-[10px] font-semibold text-gray-400">Total</span>
            </div>
          </button>

          <button
            onClick={() => toggleFilter("Sedang")}
            className={`group rounded-2xl p-5 bg-white border transition-all duration-200 text-left flex items-center justify-between shadow-2xs cursor-pointer
              ${activeFilter === "Sedang"
                ? "border-amber-500 ring-4 ring-amber-50/70"
                : "border-gray-100 hover:border-amber-200 hover:shadow-xs"
              }
            `}
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 w-fit">
                <Meh className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level Sedang</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-gray-800 block group-hover:scale-105 transition-transform">{countLevel("Sedang")}</span>
              <span className="text-[10px] font-semibold text-gray-400">Total</span>
            </div>
          </button>

          <button
            onClick={() => toggleFilter("Tinggi")}
            className={`group rounded-2xl p-5 bg-white border transition-all duration-200 text-left flex items-center justify-between shadow-2xs cursor-pointer
              ${activeFilter === "Tinggi"
                ? "border-rose-500 ring-4 ring-rose-50/70"
                : "border-gray-100 hover:border-rose-200 hover:shadow-xs"
              }
            `}
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 w-fit">
                <Frown className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level Tinggi</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-gray-800 block group-hover:scale-105 transition-transform">{countLevel("Tinggi")}</span>
              <span className="text-[10px] font-semibold text-gray-400">Total</span>
            </div>
          </button>
        </div>

        {/* DATA TABLE AREA */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6FA8A1]" />
              <h2 className="text-lg font-bold text-[#2C3E50]">Daftar Riwayat Kuisioner</h2>
            </div>

            <div className="relative w-fit">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none text-xs font-bold text-gray-600 bg-slate-50 border border-gray-200 px-4 py-2.5 pr-10 rounded-xl outline-hidden cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="terbaru">Urutan: Terbaru</option>
                <option value="terlama">Urutan: Terlama</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* TABLE COMPONENT */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px] space-y-3">
              
              {/* TABLE HEADER */}
              <div className="grid grid-cols-4 text-[11px] font-bold text-gray-400 px-3 tracking-widest uppercase border-b border-gray-100 pb-2.5">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Tanggal Tes</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Waktu</span>
                <span>Tingkat Stres</span>
                <span className="text-right">Aksi</span>
              </div>

              {/* ROWS DATA */}
              {currentData.length > 0 ? (
                currentData.map((item: any) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-4 items-center bg-white border border-gray-100 hover:border-[#6FA8A1]/30 hover:bg-slate-50/40 px-3 py-3.5 rounded-2xl transition duration-150"
                  >
                    <span className="font-semibold text-gray-800 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </span>

                    <span className="text-gray-500 text-sm font-medium">
                      {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}WIB
                    </span>

                    {/* DOCK SINKRONISASI TAMPILAN SESUAI HALAMAN DASHBOARD */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${getColor(item.level)}`} />
                      <span className="font-medium text-gray-700">{item.level}</span>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => router.push(`/hasil/${item.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#6FA8A1] border border-[#6FA8A1]/20 hover:bg-[#6FA8A1] hover:text-white px-3 py-2 rounded-xl transition cursor-pointer"
                      >
                        Lihat Detail<ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 border border-dashed border-gray-200 rounded-2xl text-center text-sm text-gray-400 font-medium">
                  Tidak ditemukan riwayat kuisioner pada filter ini.
                </div>
              )}
            </div>
          </div>

          {/* TABLE FOOTER & PAGINATION */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-gray-100 text-xs font-bold text-gray-400">
            <span>
              MENAMPILKAN {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalItems)} DARI {totalItems} RIWAYAT KUISIONER
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-gray-600"
                >
                  <ChevronLeft size={16} />
                </button>

                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition duration-150 cursor-pointer
                      ${currentPage === page
                        ? "bg-[#6FA8A1] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-gray-600"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}