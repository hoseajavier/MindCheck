"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DatasetPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = async (pageNum: number, sortKey = "", sortDir = "") => {
    setIsPageLoading(true);
    try {
      const res = await fetch(
        `/api/dataset?page=${pageNum}&sort=${sortKey}&order=${sortDir}`,
      );
      const json = await res.json();
      setData(json.data);
      setTotalPages(json.totalPages);
      setTotalRecords(json.totalRecords);
    } catch (e) {
      toast.error("Gagal memuat data");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setPage(1);
    fetchData(1, key, direction);
  };

  const SortableHeader = ({ label, sortKey }: any) => (
    <th
      className="pb-4 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label} <ArrowUpDown size={14} className="opacity-40" />
      </div>
    </th>
  );

  useEffect(() => {
    fetchData(page, sortConfig.key, sortConfig.direction);
  }, [page]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const res = await fetch("/api/dataset", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Dataset berhasil diimpor!");
        fetchData(1);
      }
    } catch {
      toast.error("Gagal mengimpor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster richColors /> <Sidebar />
      <div className="flex-1 p-4 md:p-10 pt-20 md:pt-10 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-[#2C3E50]">
            Dataset Manager
          </h1>
          <label className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl cursor-pointer hover:bg-indigo-700 transition w-full sm:w-auto justify-center">
            <Upload size={18} /> {loading ? "Memproses..." : "Import CSV"}
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleUpload}
            />
          </label>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="mb-4 text-sm text-slate-500 font-medium">
            Menampilkan {data.length > 0 ? (page - 1) * 25 + 1 : 0} -{" "}
            {(page - 1) * 25 + data.length} dari {totalRecords} data
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="text-slate-400 text-xs uppercase border-b">
                <tr>
                  <SortableHeader
                    label="Snoring Rate"
                    sortKey="snoringRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Respiration Rate"
                    sortKey="respirationRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Body Temp"
                    sortKey="bodyTemperature"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Limb Move"
                    sortKey="limbMovement"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Blood Oxygen"
                    sortKey="bloodOxygen"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Eye Move"
                    sortKey="eyeMovement"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Sleep Hours"
                    sortKey="sleepingHours"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Heart Rate"
                    sortKey="heartRate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <th className="pb-4">Stress Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isPageLoading ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center">
                      <Loader2 className="animate-spin mx-auto text-indigo-600" />
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 text-sm">{row.snoringRate}</td>
                      <td className="py-4 text-sm">{row.respirationRate}</td>
                      <td className="py-4 text-sm">{row.bodyTemperature}</td>
                      <td className="py-4 text-sm">{row.limbMovement}</td>
                      <td className="py-4 text-sm">{row.bloodOxygen}</td>
                      <td className="py-4 text-sm">{row.eyeMovement}</td>
                      <td className="py-4 text-sm">{row.sleepingHours}</td>
                      <td className="py-4 text-sm">{row.heartRate}</td>
                      <td className="py-4 font-bold text-indigo-600">
                        {row.stressLevel}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border rounded-xl hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-bold">
              Halaman {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border rounded-xl hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
