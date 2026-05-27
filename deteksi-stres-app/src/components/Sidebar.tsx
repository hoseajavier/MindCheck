"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  History,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const MenuItem = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: any;
    label: string;
    path: string;
  }) => (
    <div
      onClick={() => {
        router.push(path);
        setIsOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive(path)
          ? "bg-[#7CE1D0] text-black font-bold shadow-xs"
          : "hover:bg-[#7CE1D0]/40 text-gray-700 hover:text-black font-medium"
      }`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <>
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2.5 bg-[#EBF5F3] text-gray-700 rounded-xl shadow-md border border-gray-200/50 focus:outline-hidden cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30
          w-66 h-screen bg-[#EBF5F3] text-black flex flex-col justify-between p-4 border-r border-gray-200/30
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          <div className="flex items-center justify-start gap-2 mb-8 mt-2 px-1">
            {isOpen && (
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-gray-700 hover:bg-[#7CE1D0]/30 rounded-xl transition focus:outline-hidden cursor-pointer shrink-0"
                aria-label="Tutup Menu"
              >
                <X size={24} />
              </button>
            )}

            <div className="w-full flex items-center justify-start md:justify-center px-1 py-2">
              <Image
                src="/mindcheck1.png"
                alt="logo"
                width={280}
                height={80}
                className="h-auto w-auto max-w-full object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <MenuItem
              icon={LayoutDashboard}
              label="Dashboard"
              path="/dashboard"
            />
            <MenuItem
              icon={ClipboardList}
              label="Mulai Kuisioner"
              path="/kuisioner"
            />
            <MenuItem
              icon={History}
              label="Riwayat Kuisioner"
              path="/riwayat"
            />
            <MenuItem icon={BookOpen} label="Artikel" path="/artikel" />
            <MenuItem icon={User} label="Profil Saya" path="/profil" />
          </div>
        </div>

        <div className="border-t border-gray-300/50 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition font-bold text-sm cursor-pointer"
          >
            <LogOut size={20} className="shrink-0" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </div>
    </>
  );
}
