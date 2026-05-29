import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl = process.env.RAILWAY_API_URL;

    if (!backendUrl) {
      return NextResponse.json(
        {
          error:
            "Variabel lingkungan RAILWAY_API_URL belum dikonfigurasi di server Vercel.",
        },
        { status: 500 },
      );
    }

    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error:
            errorData.detail ||
            "Terjadi kesalahan pada model prediksi Random Forest.",
        },
        { status: response.status },
      );
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Eror API Jembatan Predict:", error);
    return NextResponse.json(
      {
        error: "Gagal terhubung ke backend AI Railway.",
        detail: error.message,
      },
      { status: 500 },
    );
  }
}
