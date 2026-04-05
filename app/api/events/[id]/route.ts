import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Geçersiz etkinlik." },
        { status: 400 }
      );
    }

    const event = await prisma.$transaction(async (tx) => {
      const now = new Date();
      await tx.event.updateMany({
        where: {
          id,
          status: "active",
          deadline: { lt: now },
        },
        data: { status: "closed" },
      });
      return tx.event.findUnique({
        where: { id },
        include: {
          registrations: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  faculty: true,
                },
              },
            },
            orderBy: [{ status: "asc" }, { position: "asc" }],
          },
        },
      });
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch {
    return NextResponse.json(
      { success: false, message: "Etkinlik yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
