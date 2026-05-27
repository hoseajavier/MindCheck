"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SkeletonLoading from "@/components/SkeletonLoading";
import { articles } from "@/data/artikel";
import { Search, ExternalLink, LayoutGrid } from "lucide-react";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const allCats = articles.map((a) => a.category);
    return ["Semua", ...Array.from(new Set(allCats))];
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "Semua" ||
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (pageLoading) {
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

      {/* pt-20 ditambahkan agar layout aman di layar HP dan tidak tertutup tombol menu laci */}
      <div className="flex-1 p-5 md:p-10 pt-20 md:pt-10 max-w-[1400px] mx-auto w-full space-y-8 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C3E50] tracking-tight flex items-center gap-2">
              Artikel Kesehatan Mental
            </h1>
            <p className="text-gray-500 mt-1">
              Kumpulan artikel literasi ilmiah terpercaya mengenai
              penanggulangan stres dan manajemen pikiran.
            </p>
          </div>
        </div>

        {/* CONTROLS: SEARCH BAR & KATEGORI FILTER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          {/* Input Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari topik atau kata kunci artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-hidden focus:border-[#6FA8A1] focus:ring-4 focus:ring-[#6FA8A1]/10 transition-all font-medium"
            />
          </div>

          {/* Navigasi Kategori Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive =
                selectedCategory === cat ||
                (cat === "Semua" && !selectedCategory);
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat === "Semua" ? null : cat)
                  }
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap
                    ${
                      isActive
                        ? "bg-[#6FA8A1] text-white shadow-2xs"
                        : "bg-slate-50 text-gray-500 hover:bg-slate-100 border border-transparent hover:border-gray-200"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ARTICLES GRID LAYOUT */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden hover:shadow-md hover:border-gray-200/60 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  {/* IMAGE WITH ZOOM HOVER EFFECT */}
                  <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    {/* Floating Category Badge */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#4A7c75] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-2xs border border-white/50">
                      {article.category}
                    </span>
                  </div>

                  {/* CORE TEXT CONTENT */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-[#2C3E50] leading-snug group-hover:text-[#6FA8A1] transition-colors duration-200">
                      {article.title}
                    </h2>

                    {/* Ringkasan Utama (Summary) */}
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {article.summary}
                    </p>

                    {/* Pembatas halus */}
                    <div className="w-full border-b border-gray-100 pt-1" />

                    {/* Uraian Edukasi (Content) */}
                    <p className="text-xs text-gray-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/60">
                      {article.content}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER INFORMATION */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-gray-50 mt-auto">
                  <span className="text-xs font-semibold text-gray-400">
                    Via:{" "}
                    <span className="text-gray-500 underline decoration-[#6FA8A1]/40 decoration-2">
                      {article.source}
                    </span>
                  </span>

                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-[#6FA8A1] text-gray-700 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200/60 hover:border-transparent transition-all shadow-3xs cursor-pointer"
                  >
                    Buka Sumber <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-3xl">
            <LayoutGrid className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">
              Artikel Tidak Ditemukan
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Coba gunakan kata kunci pencarian atau filter kategori lainnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
