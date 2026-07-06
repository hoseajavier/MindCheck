import Sidebar from "@/components/Sidebar";
import { Users, Activity, ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getAdminData() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
    include: {
      _count: {
        select: { testResults: true },
      },

      testResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const totalUsers = await prisma.user.count({
    where: { role: { not: "ADMIN" } },
  });

  const totalTests = await prisma.testResult.count();
  const totalQuestions = await prisma.question.count({
    where: { isActive: true },
  });

  return { users, totalUsers, totalTests, totalQuestions };
}

export default async function AdminPage() {
  const { users, totalUsers, totalTests, totalQuestions } =
    await getAdminData();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 p-5 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C3E50]">
            Dashboard Admin
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola dataset, pertanyaan kuisioner, dan model machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total User"
            value={totalUsers.toString()}
            icon={Users}
          />
          <StatCard
            title="Total Hasil Deteksi"
            value={totalTests.toString()}
            icon={Activity}
          />
          <StatCard
            title="Pertanyaan Kuisioner"
            value={totalQuestions.toString()}
            icon={ClipboardList}
          />
        </div>

        <div className="mt-8 bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-xs">
          <h2 className="font-bold text-xl text-[#2C3E50] mb-5 px-1">
            Daftar Pengguna
          </h2>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="pb-3 whitespace-nowrap">User</th>
                  <th className="pb-3 whitespace-nowrap">Email</th>
                  <th className="pb-3 whitespace-nowrap px-2 text-center">Total Tes</th>
                  <th className="pb-3 whitespace-nowrap px-2 text-center">Hasil Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 flex items-center gap-3 whitespace-nowrap min-w-[150px]">
                      {user.image && (
                        <img
                          src={user.image}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          alt=""
                        />
                      )}
                      <span className="font-semibold text-[#2C3E50] truncate max-w-[120px]">
                        {user.displayName || user.name || "No Name"}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="py-4 text-gray-600 px-2 text-center">
                      {user._count.testResults}
                    </td>
                    <td className="py-4 font-medium px-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          user.testResults[0]?.level === "Tinggi"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {user.testResults[0]?.level || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-extrabold text-[#2C3E50] mt-2">
            {value}
          </h3>
        </div>
        <div className="bg-[#EBF5F3] p-3 rounded-2xl">
          <Icon className="text-[#6FA8A1]" />
        </div>
      </div>
    </div>
  );
}
