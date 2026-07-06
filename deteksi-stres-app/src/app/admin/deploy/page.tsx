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
        toast.success("Model berhasil dideploy ke sistem!");
        fetchActiveModel();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster richColors /> <Sidebar />
      <div className="flex-1 p-4 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#2C3E50] mb-2">
            Model Deployment
          </h1>
          <p className="text-slate-500 mb-8">
            Kelola dan deploy file model untuk fitur prediksi stres.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl">
                <Brain size={32} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                  Model Aktif Saat Ini
                </p>
                <p className="text-xl font-bold text-slate-800 truncate">
                  {modelInfo.modelName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <RefreshCw size={20} className="text-indigo-600" /> Deploy Model
            Baru
          </h2>

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-indigo-300 transition group">
            <FileCode
              size={48}
              className="mx-auto text-slate-300 mb-4 group-hover:text-indigo-400 transition"
            />
            <p className="text-slate-600 mb-6">
              Pilih file model hasil training (.pkl / .joblib)
            </p>

            <label
              className={`bg-indigo-600 text-white px-8 py-3 rounded-2xl cursor-pointer hover:bg-indigo-700 transition flex items-center justify-center w-max mx-auto ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />{" "}
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
  );
}
