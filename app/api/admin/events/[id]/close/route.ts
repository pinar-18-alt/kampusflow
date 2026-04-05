import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const id = params.id;
  if (!id) {
    return NextResponse.json(
      { success: false, message: "Geçersiz etkinlik." },
      { status: 400 }
    );
  }

  try {
    await prisma.event.update({
      where: { id },
      data: { status: "closed" },
    });
    return NextResponse.json({
      success: true,
      message: "Etkinlik kapatıldı",
    });
  } catch (e: unknown) {
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadı." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Etkinlik kapatılırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
