import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const content = await file.text();

  const records = parse(content, {
    columns: false,
    skip_empty_lines: true,
    from_line: 2,
  });

  const data = records.map((r: any) => ({
    snoringRate: parseFloat(r[0]) || 0,
    respirationRate: parseFloat(r[1]) || 0,
    bodyTemperature: parseFloat(r[2]) || 0,
    limbMovement: parseFloat(r[3]) || 0,
    bloodOxygen: parseFloat(r[4]) || 0,
    eyeMovement: parseFloat(r[5]) || 0,
    sleepingHours: parseFloat(r[6]) || 0,
    heartRate: parseFloat(r[7]) || 0,
    stressLevel: parseInt(r[8]) || 0,
  }));

  await prisma.datasetRecord.deleteMany({});
  await prisma.datasetRecord.createMany({ data });

  return NextResponse.json({ success: true, count: data.length });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const sortKey = searchParams.get("sort");
  const sortOrder = searchParams.get("order") || "asc";

  const limit = 25;

  const orderBy = sortKey ? { [sortKey]: sortOrder } : { importedAt: "desc" };

  const [data, total] = await prisma.$transaction([
    prisma.datasetRecord.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderBy as any,
    }),
    prisma.datasetRecord.count(),
  ]);

  return NextResponse.json({
    data,
    totalRecords: total,
    totalPages: Math.ceil(total / limit),
  });
}
