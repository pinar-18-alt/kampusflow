import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  faculty: true,
  role: true,
} as const;

export async function GET(
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
    const row = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: { select: USER_SELECT },
          },
          orderBy: [{ status: "asc" }, { position: "asc" }],
        },
      },
    });

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadı." },
        { status: 404 }
      );
    }

    const { registrations, ...event } = row;
    return NextResponse.json({ event, registrations });
  } catch {
    return NextResponse.json(
      { success: false, message: "Etkinlik yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
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
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    const b = body as Record<string, unknown>;
    const data: {
      title?: string;
      description?: string;
      quota?: number;
      deadline?: Date;
      status?: string;
    } = {};

    if ("title" in b) {
      const t = typeof b.title === "string" ? b.title.trim() : "";
      if (!t) {
        return NextResponse.json(
          { success: false, message: "Başlık boş olamaz." },
          { status: 400 }
        );
      }
      data.title = t;
    }

    if ("description" in b) {
      const d = typeof b.description === "string" ? b.description.trim() : "";
      if (!d) {
        return NextResponse.json(
          { success: false, message: "Açıklama boş olamaz." },
          { status: 400 }
        );
      }
      data.description = d;
    }

    if ("quota" in b) {
      const q = b.quota;
      let quotaNum: number;
      if (typeof q === "number" && Number.isInteger(q)) {
        quotaNum = q;
      } else if (typeof q === "string" && /^\d+$/.test(q.trim())) {
        quotaNum = parseInt(q.trim(), 10);
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Kontenjan pozitif bir tam sayı olmalıdır.",
          },
          { status: 400 }
        );
      }
      if (quotaNum <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Kontenjan pozitif bir tam sayı olmalıdır.",
          },
          { status: 400 }
        );
      }
      data.quota = quotaNum;
    }

    if ("deadline" in b) {
      const dl = b.deadline;
      const deadlineDate =
        typeof dl === "string" || dl instanceof Date ? new Date(dl) : null;
      if (!deadlineDate || Number.isNaN(deadlineDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Geçersiz son başvuru tarihi." },
          { status: 400 }
        );
      }
      data.deadline = deadlineDate;
    }

    if ("status" in b) {
      const s = typeof b.status === "string" ? b.status.trim() : "";
      if (!s) {
        return NextResponse.json(
          { success: false, message: "Durum boş olamaz." },
          { status: 400 }
        );
      }
      data.status = s;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "Güncellenecek alan belirtilmedi." },
        { status: 400 }
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data,
    });

    return NextResponse.json({ event: updated });
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
      { success: false, message: "Etkinlik güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    await prisma.$transaction(async (tx) => {
      const exists = await tx.event.findUnique({ where: { id }, select: { id: true } });
      if (!exists) {
        throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
      }
      await tx.registration.deleteMany({ where: { eventId: id } });
      await tx.event.delete({ where: { id } });
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "Etkinlik bulunamadı." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Etkinlik silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
