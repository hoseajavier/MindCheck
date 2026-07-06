import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
