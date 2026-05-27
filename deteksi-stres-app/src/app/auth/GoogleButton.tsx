"use client"

import Image from "next/image"

interface GoogleButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function GoogleButton({ isLoading, onClick }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg transition font-medium
        ${isLoading 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
          : "bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
        }`}
    >
      {isLoading ? (
        <svg
          className="w-5 h-5 text-gray-500 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <Image
          src="/logoGoogle.png"
          alt="Google"
          width={20}
          height={20}
        />
      )}

      <span>
        {isLoading ? "Menghubungkan..." : "Masuk dengan Google"}
      </span>
    </button>
  )
}