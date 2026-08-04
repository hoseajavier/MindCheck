import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await prisma.testResult.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 },
      );
    }

    const decryptedResult = {
      ...result,
      answers: JSON.parse(decrypt(result.answers)),
    };

    return NextResponse.json(decryptedResult);
  } catch (error) {
    console.error("GET Result ID Error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}