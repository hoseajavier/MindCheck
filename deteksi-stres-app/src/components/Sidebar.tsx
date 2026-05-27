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
  
  // State untuk mengontrol sidebar di layar mobile
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
        isActive(path)
          ? "bg-[#7CE1D0] text-black font-semibold shadow-xs"
          : "hover:bg-[#7CE1D0]/60 text-gray-700 hover:text-black"
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <>
      {/* TRIGGER BUTTON: Hanya muncul di layar mobile/tablet (md kebawah) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2.5 bg-[#EBF5F3] text-black rounded-xl shadow-md border border-gray-200/50 focus:outline-hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* OVERLAY BACKGROUND: Menggelapkan layar utama saat sidebar mobile terbuka */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      {/* CONTAINER UTAMA SIDEBAR */}
      <div
        className={`fixed md:sticky top-0 left-0 z-40
          w-64 h-screen bg-[#EBF5F3] text-black flex flex-col justify-between p-4 border-r border-gray-200/30
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP */}
        <div>
          {/* Logo dengan tombol close tambahan khusus layar kecil */}
          <div className="flex items-center justify-between md:justify-center mb-8 mt-12 md:mt-2 px-2">
            <div className="w-40 md:w-48 mx-auto">
              <Image
                src="/mindcheck1.png"
                alt="logo"
                width={200}
                height={60}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>

          {/* MENU ITEMS */}
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
            <MenuItem
              icon={BookOpen}
              label="Artikel"
              path="/artikel"
            />
            <MenuItem
              icon={User}
              label="Profil Saya"
              path="/profil"
            />
          </div>
        </div>

        {/* BOTTOM (LOGOUT) */}
        <div className="border-t border-gray-300/50 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition font-medium"
          >
            <LogOut size={20} />
            <span className="text-sm">Keluar Aplikasi</span>
          </button>
        </div>
      </div>
    </>
  );
}