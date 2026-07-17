"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthLoadingPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    }

    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">

      <div className="flex flex-col items-center text-center">

        <div className="animate-pulse">
          <Image
            src="/mindcheck1.png"
            alt="MindCheck"
            width={170}
            height={170}
            priority
          />
        </div>

        <Loader2
          size={46}
          className="animate-spin text-[#6FA8A1] mt-8 mb-6"
        />

        <h1 className="text-3xl font-bold text-[#2C3E50]">
          Sedang Masuk...
        </h1>

        <p className="text-gray-500 mt-3 max-w-sm leading-relaxed">
          Mohon tunggu sebentar.
          <br />
          Kami sedang mempersiapkan dashboard Anda.
        </p>

      </div>

    </div>
  );
}