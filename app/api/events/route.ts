import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.event.updateMany({
        where: {
          status: "active",
          deadline: { lt: now },
        },
        data: { status: "closed" },
      });
      return tx.event.findMany({
        orderBy: { createdAt: "desc" },
      });
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { success: false, message: "Etkinlikler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
