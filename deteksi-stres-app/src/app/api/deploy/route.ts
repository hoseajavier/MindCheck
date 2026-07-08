import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metadata = await prisma.modelMetadata.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    
    return NextResponse.json(metadata || { modelName: "Belum ada model aktif" });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ modelName: "Error Server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch(`${process.env.RAILWAY_API_URL}/upload-model`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok)
    return NextResponse.json({ error: "Gagal ke backend AI" }, { status: 500 });

  const file = formData.get("file") as File;
  const newMetadata = await prisma.modelMetadata.create({
    data: { modelName: file.name, accuracy: 0 },
  });

  return NextResponse.json(newMetadata);
}
