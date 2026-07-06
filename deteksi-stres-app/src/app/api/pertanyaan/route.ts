import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { QuestionCategory } from "@prisma/client";

export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { orderNumber: "asc" },
  });
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const content = await file.text();
    const records = parse(content, { columns: true, skip_empty_lines: true });

    await prisma.$transaction([
      prisma.question.deleteMany({}),

      prisma.question.createMany({
        data: records.map((r: any) => ({
          question: r.question,
          orderNumber: parseInt(r.orderNumber),
          category: r.category as QuestionCategory,
        })),
      }),
    ]);

    return NextResponse.json({ success: true });
  }

  const { question, category } = await req.json();
  const count = await prisma.question.count();
  const newQuestion = await prisma.question.create({
    data: { question, category, orderNumber: count + 1 },
  });
  return NextResponse.json(newQuestion);
}

export async function PUT(req: Request) {
  try {
    const { id, question, category } = await req.json();

    await prisma.question.update({
      where: { id },
      data: {
        question,
        category: category as QuestionCategory,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengupdate pertanyaan" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 },
      );
    }

    const deleted = await prisma.question.delete({ where: { id } });

    await prisma.question.updateMany({
      where: { orderNumber: { gt: deleted.orderNumber } },
      data: { orderNumber: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { id, newOrder } = await req.json();

  const current = await prisma.question.findUnique({ where: { id } });
  const target = await prisma.question.findFirst({
    where: { orderNumber: newOrder },
  });

  if (!current || !target)
    return NextResponse.json(
      { error: "Item tidak ditemukan" },
      { status: 404 },
    );

  const BUFFER_ORDER = 9999;

  await prisma.$transaction([
    prisma.question.update({
      where: { id: target.id },
      data: { orderNumber: BUFFER_ORDER },
    }),

    prisma.question.update({
      where: { id: current.id },
      data: { orderNumber: newOrder },
    }),

    prisma.question.update({
      where: { id: target.id },
      data: { orderNumber: current.orderNumber },
    }),
  ]);

  return NextResponse.json({ success: true });
}
