import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const input = await request.json();

    const featureMap = [
      { key: "snoringRate", label: "SNORING_RATE" },
      { key: "respirationRate", label: "RESPIRATION_RATE" },
      { key: "bodyTemperature", label: "BODY_TEMPERATURE" },
      { key: "limbMovement", label: "LIMB_MOVEMENT" },
      { key: "bloodOxygen", label: "BLOOD_OXYGEN" },
      { key: "eyeMovement", label: "EYE_MOVEMENT" },
      { key: "sleepingHours", label: "SLEEPING_HOURS" },
      { key: "heartRate", label: "HEART_RATE" },
    ];

    const normalizedData: any = {};

    for (const f of featureMap) {
      const stats = await (prisma.datasetRecord as any).aggregate({
        _min: { [f.key]: true },
        _max: { [f.key]: true },
      });

      const min = stats._min[f.key] || 0;
      const max = stats._max[f.key] || 100;
      const range = max - min === 0 ? 1 : max - min;

      const val = input[f.label] || 0;

      const snakeKey = f.key.replace(/([A-Z])/g, "_$1").toLowerCase();

      if (["blood_oxygen", "sleeping_hours"].includes(snakeKey)) {
        normalizedData[snakeKey] = max - (val / 4) * range;
      } else {
        normalizedData[snakeKey] = min + (val / 4) * range;
      }
    }

    console.log("SENDING TO RAILWAY:", normalizedData);

    const response = await fetch(`${process.env.RAILWAY_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedData),
    });

    if (!response.ok) throw new Error("Gagal terhubung ke Railway");

    const result = await response.json();
    console.log("RESPONSE FROM RAILWAY:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PREDICT API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
