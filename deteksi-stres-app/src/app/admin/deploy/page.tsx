"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Brain, RefreshCw, FileCode, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DeployModelPage() {
  const [modelInfo, setModelInfo] = useState({ modelName: "Memuat..." });
  const [isUploading, setIsUploading] = useState(false);

  const fetchActiveModel = async () => {
    try {
      const res = await fetch("/api/deploy");
      const data = await res.json();
      setModelInfo(data);
    } catch (error) {
      console.error("Gagal memuat info model", error);
    }
  };

  useEffect(() => {
    fetchActiveModel();
  }, []);

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Model berhasil dideploy!");
        fetchActiveModel();
      } else {
        toast.error("Gagal mengupload model");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster richColors />
      <Sidebar />

      <div className="flex-1 w-full overflow-hidden p-4 sm:p-6 md:p-10 pt-20 md:pt-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] mb-2">
              Model Deployment
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Kelola dan deploy file model untuk fitur prediksi stres.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-indigo-50 text-indigo-600 rounded-2xl sm:rounded-3xl shrink-0">
                <Brain size={24} className="sm:size-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-wider">
                  Model Aktif
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                  {modelInfo.modelName}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
              <RefreshCw size={18} className="text-indigo-600" /> Deploy Model
              Baru
            </h2>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center hover:border-indigo-300 transition group">
              <FileCode
                size={40}
                className="mx-auto text-slate-300 mb-4 group-hover:text-indigo-400 transition"
              />
              <p className="text-sm text-slate-600 mb-6 px-4">
                Pilih file model hasil training (.pkl / .joblib)
              </p>

              <label
                className={`bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-indigo-700 transition flex items-center justify-center w-full sm:w-max mx-auto text-sm sm:text-base font-medium ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Memproses...
                  </>
                ) : (
                  "Pilih File Model"
                )}
                <input
                  type="file"
                  className="hidden"
                  accept=".pkl,.joblib"
                  onChange={handleModelUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
