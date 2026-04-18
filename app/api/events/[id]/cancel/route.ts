import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWaitlistPromoted } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Giriş yapmanız gerekiyor." },
        { status: 401 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Geçersiz etkinlik." },
        { status: 400 }
      );
    }

    const outcome = await prisma.$transaction(async (tx) => {
      const registration = await tx.registration.findUnique({
        where: {
          eventId_userId: { eventId, userId },
        },
      });

      if (!registration) {
        return {
          ok: false as const,
          status: 404,
          body: { success: false, message: "Bu etkinlik için kaydınız bulunamadı." },
        };
      }

      if (registration.status === "confirmed") {
        await tx.registration.delete({ where: { id: registration.id } });
        await tx.event.update({
          where: { id: eventId },
          data: { registeredCount: { decrement: 1 } },
        });

        const firstWaitlist = await tx.registration.findFirst({
          where: { eventId, status: "waitlist" },
          orderBy: { position: "asc" },
        });

        if (firstWaitlist) {
          await tx.registration.update({
            where: { id: firstWaitlist.id },
            data: { status: "confirmed", position: null },
          });
          await tx.event.update({
            where: { id: eventId },
            data: {
              waitlistCount: { decrement: 1 },
              registeredCount: { increment: 1 },
            },
          });
          return {
            ok: true as const,
            body: {
              success: true,
              message:
                "Kaydınız iptal edildi. Bekleme listesindeki kişi otomatik alındı.",
            },
            promotedUserId: firstWaitlist.userId,
          };
        }

        return {
          ok: true as const,
          body: {
            success: true,
            message: "Kaydınız iptal edildi.",
          },
        };
      }

      if (registration.status === "waitlist") {
        const removedPosition = registration.position;

        await tx.registration.delete({ where: { id: registration.id } });
        await tx.event.update({
          where: { id: eventId },
          data: { waitlistCount: { decrement: 1 } },
        });

        if (removedPosition != null) {
          await tx.registration.updateMany({
            where: {
              eventId,
              status: "waitlist",
              position: { gt: removedPosition },
            },
            data: { position: { decrement: 1 } },
          });
        }

        return {
          ok: true as const,
          body: {
            success: true,
            message: "Bekleme listesinden çıkarıldınız.",
          },
        };
      }

      return {
        ok: false as const,
        status: 400,
        body: { success: false, message: "Geçersiz kayıt durumu." },
      };
    });

    if (!outcome.ok) {
      return NextResponse.json(outcome.body, { status: outcome.status });
    }

    if (
      outcome.ok &&
      "promotedUserId" in outcome &&
      typeof outcome.promotedUserId === "string"
    ) {
      const [promotedUser, event] = await Promise.all([
        prisma.user.findUnique({
          where: { id: outcome.promotedUserId },
          select: { email: true, name: true },
        }),
        prisma.event.findUnique({
          where: { id: eventId },
          select: { title: true },
        }),
      ]);
      if (promotedUser?.email && event) {
        try {
          await sendWaitlistPromoted(
            promotedUser.email,
            promotedUser.name ?? "Kullanıcı",
            event.title
          );
        } catch (error) {
          console.error("Email gönderilemedi:", error);
        }
      }
    }

    return NextResponse.json(outcome.body);
  } catch {
    return NextResponse.json(
      { success: false, message: "İptal işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
