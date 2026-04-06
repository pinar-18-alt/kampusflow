import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { success: false, message: "Etkinlikler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

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

    const DEFAULT_COMMUNITY = "UYBİST";
    const DEFAULT_COMMUNITY_LOGO = "/uybist-logo.png";

    const { title, description, quota, deadline, community, communityLogo } =
      body as Record<string, unknown>;

    const titleStr = typeof title === "string" ? title.trim() : "";
    const descStr = typeof description === "string" ? description.trim() : "";

    if (!titleStr || !descStr) {
      return NextResponse.json(
        { success: false, message: "Başlık ve açıklama zorunludur." },
        { status: 400 }
      );
    }

    let quotaNum: number;
    if (typeof quota === "number" && Number.isInteger(quota)) {
      quotaNum = quota;
    } else if (typeof quota === "string" && /^\d+$/.test(quota.trim())) {
      quotaNum = parseInt(quota.trim(), 10);
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

    if (deadline === undefined || deadline === null) {
      return NextResponse.json(
        { success: false, message: "Son başvuru tarihi zorunludur." },
        { status: 400 }
      );
    }

    const deadlineDate =
      typeof deadline === "string" || deadline instanceof Date
        ? new Date(deadline)
        : null;

    if (!deadlineDate || Number.isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Geçersiz son başvuru tarihi." },
        { status: 400 }
      );
    }

    const now = new Date();
    if (deadlineDate <= now) {
      return NextResponse.json(
        {
          success: false,
          message: "Son başvuru tarihi gelecekte olmalıdır.",
        },
        { status: 400 }
      );
    }

    const communityStr =
      typeof community === "string" && community.trim()
        ? community.trim()
        : DEFAULT_COMMUNITY;
    const communityLogoStr =
      typeof communityLogo === "string" && communityLogo.trim()
        ? communityLogo.trim()
        : DEFAULT_COMMUNITY_LOGO;

    const event = await prisma.event.create({
      data: {
        title: titleStr,
        description: descStr,
        community: communityStr,
        communityLogo: communityLogoStr,
        quota: quotaNum,
        deadline: deadlineDate,
        status: "active",
        registeredCount: 0,
        waitlistCount: 0,
        createdBy: gate.userId,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Etkinlik oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
