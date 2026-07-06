import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch("http://127.0.0.1:8000/upload-model", {
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
