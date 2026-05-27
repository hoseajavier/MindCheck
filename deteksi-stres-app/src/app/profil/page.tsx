"use client";

import Sidebar from "@/components/Sidebar";
import SkeletonLoading from "@/components/SkeletonLoading";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Mail, Pencil, CheckCircle, Flame, Trash2, Save, User, ShieldAlert, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed fetch profile");
      const data = await res.json();
      setUserData(data);
      setDisplayName(data.displayName || data.name || "");
      setBio(data.bio || "");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/test-result");
      if (!res.ok) throw new Error("Failed fetch history");
      const data = await res.json();
      setHistory(data || []);
    } catch (error) {
      console.error(error);
      setHistory([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchProfile(), fetchHistory()]);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    if (session) {
      loadData();
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setActionLoading(true);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio }),
      });

      if (res.ok) {
        await update();
        toast.success("Profil berhasil diperbarui", {
          style: { borderRadius: '12px', background: '#2C3E50', color: '#fff', fontSize: '14px' }
        });
        fetchProfile();
      } else {
        toast.error("Gagal menyimpan profil");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <span className="font-bold text-sm text-[#2C3E50] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Yakin ingin menghapus akun?
        </span>
        <p className="text-xs text-gray-500 leading-relaxed">
          Semua rekaman hasil deteksi stres dan riwayat mood akan terhapus permanen dari database.
        </p>
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-gray-600 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setActionLoading(true);
                const res = await fetch("/api/profile", { method: "DELETE" });
                if (res.ok) {
                  toast.success("Akun berhasil dihapus");
                  signOut({ callbackUrl: "/" });
                } else {
                  toast.error("Gagal menghapus akun");
                }
              } catch (error) {
                console.error(error);
                toast.error("Terjadi kesalahan");
              } finally {
                setActionLoading(false);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 text-xs font-bold transition cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    ), { duration: 5000, position: "top-center" });
  };

  if (status === "loading" || pageLoading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster />
      <Sidebar />

      {/* Ditambahkan pt-20 untuk mengamankan layout dari tombol menu laci pada perangkat mobile */}
      <div className="flex-1 p-5 md:p-10 pt-20 md:pt-10 max-w-[1500px] mx-auto w-full space-y-8 overflow-y-auto">
        
        {/* HEADER */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C3E50] tracking-tight">
            Profil Saya
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            Kelola konfigurasi identitas personal dan tinjau performa konsistensi kesehatan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN LEFT: FORM MANAGEMENT */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 flex flex-col justify-between space-y-6">
            <div>
              {/* COMPACT AVATAR & METADATA CARD */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 text-center sm:text-left">
                {session?.user?.image && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#6FA8A1]/20 shrink-0">
                    <Image
                      src={session.user.image}
                      alt="Profile Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#2C3E50] tracking-tight">
                    {userData?.displayName || session?.user?.name || "User MindCheck"}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 font-medium">
                    <Mail className="w-4 h-4 text-[#6FA8A1]" />
                    <span>{session?.user?.email}</span>
                  </div>
                </div>
              </div>

              {/* BARIS JUDUL EDIT PROFIL */}
              <div className="flex items-center gap-2 text-[#2C3E50] font-bold pb-2.5 border-b border-gray-100 mb-6">
                <Pencil className="w-4 h-4 text-[#6FA8A1]" />
                <span className="text-base">Konfigurasi Data Akun</span>
              </div>

              {/* INPUT FORM FIELDS */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Nama Tampilan</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-3.5 text-sm font-medium border border-gray-200 rounded-xl bg-slate-50 outline-hidden focus:bg-white focus:border-[#6FA8A1] focus:ring-4 focus:ring-[#6FA8A1]/10 transition-all"
                    placeholder="Masukkan nama tampilan Anda"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Biografi Singkat</label>
                  <textarea
                    rows={4}
                    placeholder="Ceritakan sedikit tentang dirimu atau fokus kesehatan mentalmu saat ini..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3.5 text-sm font-medium border border-gray-200 rounded-xl bg-slate-50 outline-hidden resize-none focus:bg-white focus:border-[#6FA8A1] focus:ring-4 focus:ring-[#6FA8A1]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON SIMPAN */}
            <div className="flex justify-end pt-4 border-t border-gray-50">
              <button
                onClick={handleSave}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-[#6FA8A1] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#598F88] transition disabled:opacity-50 shadow-xs hover:shadow-md cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                {actionLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>

          {/* COLUMN RIGHT: STATS & ACCOUNT PROTECTION */}
          <div className="space-y-6">
            
            {/* STATS COMPONENT 1: TOTAL EVALUASI */}
            <div className="bg-gradient-to-br from-[#6FA8A1] to-[#4A7c75] text-white rounded-3xl p-6 shadow-xs border border-[#6FA8A1]/30 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-white/80">Total Tes Selesai</p>
                <div className="p-2 bg-white/20 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-5xl font-black tracking-tight mt-4 z-10">
                {history.length} <span className="text-xl font-bold text-white/70">Tes</span>
              </h2>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-all"></div>
            </div>

            {/* STATS COMPONENT 2: STREAK CONSISTENCY */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Konsistensi Beruntun</p>
                  <h2 className="text-4xl font-black text-gray-800 pt-1">
                    {userData?.streak || 0} <span className="text-lg font-bold text-gray-400">Hari</span>
                  </h2>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* KONTEN TAMBAHAN RELEVAN: MONITOR RIWAYAT TERAKHIR */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5 text-teal-500" /> Status Terakhir:</span>
                <span className="font-bold text-gray-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {history[0]?.level || "Belum ada tes"}
                </span>
              </div>
            </div>

            {/* DANGER ZONE ACCORDION: HAPUS AKUN */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-red-100/70 space-y-4">
              <div className="flex items-center gap-3 text-rose-500">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-base">Hapus Akun</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Tindakan penghapusan akun bersifat permanen. Seluruh kredensial beserta log rekaman klinis Anda akan dihapus selamanya dari daftar penyimpanan.
              </p>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="w-full bg-rose-50 text-rose-600 font-bold text-xs py-3.5 rounded-xl hover:bg-rose-500 hover:text-white border border-rose-100 transition disabled:opacity-50 cursor-pointer text-center"
              >
                {actionLoading ? "Memproses Pemutusan..." : "Hapus Akun"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}