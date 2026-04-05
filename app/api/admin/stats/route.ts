import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const [
      totalEvents,
      activeEvents,
      totalUsers,
      totalRegistrations,
      totalWaitlist,
    ] = await prisma.$transaction([
      prisma.event.count(),
      prisma.event.count({ where: { status: "active" } }),
      prisma.user.count({ where: { role: "user" } }),
      prisma.registration.count({ where: { status: "confirmed" } }),
      prisma.registration.count({ where: { status: "waitlist" } }),
    ]);

    return NextResponse.json({
      totalEvents,
      activeEvents,
      totalUsers,
      totalRegistrations,
      totalWaitlist,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "İstatistikler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
