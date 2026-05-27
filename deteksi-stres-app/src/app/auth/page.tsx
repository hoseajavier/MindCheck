"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import GoogleButton from "@/app/auth/GoogleButton";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Gagal masuk dengan Google:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8F5F2] px-4 sm:px-6 relative overflow-hidden">
      {/* ELEMEN DEKORATIF LATAR BELAKANG (BIAR LAYAR BESAR TIDAK KOSONG) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#6FA8A1]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#85C1C9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* LOGO */}
      <div className="z-10 transform hover:scale-102 transition-transform duration-300">
        <Image
          src="/mindcheck1.png"
          alt="MindCheck Logo"
          width={250}
          height={200}
          className="w-37.5 sm:w-45 md:w-55 h-auto object-contain"
          priority
        />
      </div>

      {/* CARD LOGIN UTAMA */}
      <div
        className="bg-white/80 backdrop-blur-md w-full max-w-md sm:max-w-lg 
                      rounded-4xl sm:rounded-[40px] 
                      p-6 sm:p-10 md:p-9 
                      shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60
                      text-center z-10 flex flex-col space-y-6 sm:space-y-8"
      >
        {/* TITLES & SUBTITLES */}
        <div className="space-y-3">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl 
                         font-extrabold text-[#2C3E50] tracking-tight
                         leading-tight"
          >
            Selamat Datang di <br />
            <span className="text-[#6FA8A1] bg-linear-to-r from-[#6FA8A1] to-[#4A7c75] bg-clip-text">
              MindCheck
            </span>
          </h1>

          <p
            className="text-xs sm:text-sm md:text-base 
                        text-gray-500 font-medium
                        px-2 sm:px-6 leading-relaxed"
          >
            Mari kenali tingkat stres Anda dengan mudah dan mulailah perjalanan
            menuju ketenangan pikiran yang lebih baik.
          </p>
        </div>

        {/* INTERACTION AREA: BUTTON */}
        <div className="space-y-4">
          <div className="w-full flex justify-center">
            <GoogleButton isLoading={isLoading} onClick={handleGoogleLogin} />
          </div>

          {/* FOOTER DISCLAIMER */}
          <p
            className="text-[11px] sm:text-xs 
                        text-gray-400 font-medium 
                        px-4 sm:px-8 leading-relaxed pt-2"
          >
            Dengan melanjutkan proses log in, Anda secara otomatis menyetujui
            Ketentuan Layanan serta Kebijakan Privasi aplikasi kami.
          </p>
        </div>
      </div>
    </div>
  );
}
