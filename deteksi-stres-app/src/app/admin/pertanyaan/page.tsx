"use client";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Sidebar from "@/components/Sidebar";
import {
  Plus,
  Upload,
  Trash2,
  Edit2,
  GripVertical,
  Loader2,
  Inbox,
} from "lucide-react";

const CATEGORIES = [
  "SNORING_RATE",
  "RESPIRATION_RATE",
  "BODY_TEMPERATURE",
  "LIMB_MOVEMENT",
  "BLOOD_OXYGEN",
  "EYE_MOVEMENT",
  "SLEEPING_HOURS",
  "HEART_RATE",
];

function SortableQuestion({ q, onDelete, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-2 group hover:border-indigo-200 transition"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 hover:text-indigo-600"
      >
        <GripVertical size={20} />
      </div>
      <span className="font-bold text-slate-500 w-8 text-center">
        {q.orderNumber}
      </span>
      <div className="flex-1">
        <p className="text-slate-700 font-medium">{q.question}</p>
        <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border">
          {q.category.replace(/_/g, " ")}
        </span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onEdit(q)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(q.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ManageQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    type: "add" | "edit";
    data: any;
  }>({ open: false, type: "add", data: null });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const res = await fetch("/api/pertanyaan");
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    const isEdit = modal.type === "edit";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch("/api/pertanyaan", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modal.data?.id, question: text, category }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan pertanyaan");
      }
      toast.success(
        isEdit
          ? "Pertanyaan berhasil diperbarui"
          : "Pertanyaan berhasil disimpan",
      );
      setModal({ open: false, type: "add", data: null });
      setText("");
      await fetchData();
    } catch (error) {
      console.error("Simpan pertanyaan error:", error);
      toast.error("Gagal menyimpan pertanyaan");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/pertanyaan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setDeleteId(null);
      fetchData();
      toast.error("Pertanyaan dihapus");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/pertanyaan", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Gagal Import File CSV");
      }
      await fetchData();
      toast.success("CSV Berhasil Diimport!");
    } catch (error) {
      console.error("Import CSV Error:", error);
      toast.error("Gagal Import CSV");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster richColors position="top-right" />
      <Sidebar />

      <div className="flex-1 p-4 md:p-10 pt-20 md:pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C3E50]">
            Kelola Pertanyaan
          </h1>

          <div className="flex gap-2 w-full sm:w-auto">
            <label className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2.5 rounded-2xl cursor-pointer flex items-center justify-center gap-2 hover:bg-emerald-700 transition text-sm">
              <Upload size={16} /> Import
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
            <button
              onClick={() => {
                setText("");
                setModal({ open: true, type: "add", data: null });
              }}
              className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition text-sm"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Inbox className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-700">
              Data Pertanyaan Belum Ada
            </h3>
            <p className="text-slate-500">
              Silahkan tambah manual atau import file CSV untuk mulai.
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={async (e: any) => {
              const { active, over } = e;
              if (active.id !== over.id) {
                const oldIdx = questions.findIndex((q) => q.id === active.id);
                const newIdx = questions.findIndex((q) => q.id === over.id);
                const updated = arrayMove(questions, oldIdx, newIdx).map(
                  (q, i) => ({ ...q, orderNumber: i + 1 }),
                );
                setQuestions(updated);
                await fetch("/api/pertanyaan", {
                  method: "PATCH",
                  body: JSON.stringify({ id: active.id, newOrder: newIdx + 1 }),
                });
              }
            }}
          >
            <SortableContext
              items={questions}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((q) => (
                <SortableQuestion
                  key={q.id}
                  q={q}
                  onDelete={setDeleteId}
                  onEdit={(q: any) => {
                    setText(q.question);
                    setCategory(q.category);
                    setModal({ open: true, type: "edit", data: q });
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      {modal.open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <h2 className="font-bold text-lg mb-4">Form Pertanyaan</h2>
            <div className="overflow-y-auto flex-1 pr-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full p-4 border rounded-2xl mb-4"
                placeholder="Tulis pertanyaan..."
              />
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Kategori
              </label>
              <div className="relative mb-6">
                <div
                  onClick={() => setIsCatOpen(!isCatOpen)}
                  className="w-full p-4 border rounded-2xl bg-slate-50 cursor-pointer flex justify-between items-center"
                >
                  {category.replace(/_/g, " ")} <span>▼</span>
                </div>
                {isCatOpen && (
                  <div className="absolute w-full mt-2 bg-white border rounded-2xl shadow-xl max-h-48 overflow-y-auto z-50">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setIsCatOpen(false);
                        }}
                        className="p-4 hover:bg-indigo-50 cursor-pointer text-sm"
                      >
                        {cat.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="flex-1 p-3 rounded-xl border font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white p-3 rounded-xl font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl w-96 shadow-2xl">
            <h2 className="font-bold text-lg mb-2">Hapus Pertanyaan?</h2>
            <p className="text-slate-500 mb-6">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 p-3 rounded-xl border font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 text-white p-3 rounded-xl font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
