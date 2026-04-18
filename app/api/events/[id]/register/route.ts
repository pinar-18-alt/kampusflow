import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  sendRegistrationConfirmation,
  sendWaitlistConfirmation,
} from "@/lib/email";

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
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return {
          ok: false as const,
          status: 404,
          body: { success: false, message: "Etkinlik bulunamadı." },
        };
      }

      const now = new Date();
      if (event.deadline < now) {
        if (event.status === "active") {
          await tx.event.update({
            where: { id: eventId },
            data: { status: "closed" },
          });
        }
        return {
          ok: false as const,
          status: 400,
          body: { success: false, message: "Başvuru süresi dolmuştur" },
        };
      }

      if (event.status !== "active") {
        return {
          ok: false as const,
          status: 400,
          body: {
            success: false,
            message: "Bu etkinliğe kayıt alınmıyor.",
          },
        };
      }

      const existing = await tx.registration.findUnique({
        where: {
          eventId_userId: { eventId, userId },
        },
      });
      if (existing) {
        return {
          ok: false as const,
          status: 409,
          body: { success: false, message: "Zaten kayıtlısınız" },
        };
      }

      if (event.registeredCount < event.quota) {
        await tx.registration.create({
          data: {
            eventId,
            userId,
            status: "confirmed",
          },
        });
        await tx.event.update({
          where: { id: eventId },
          data: { registeredCount: { increment: 1 } },
        });
        return {
          ok: true as const,
          body: {
            success: true,
            status: "confirmed" as const,
            message: "Etkinliğe başarıyla kaydoldunuz!",
          },
        };
      }

      const agg = await tx.registration.aggregate({
        where: { eventId, status: "waitlist" },
        _max: { position: true },
      });
      const nextPosition = (agg._max.position ?? 0) + 1;

      await tx.registration.create({
        data: {
          eventId,
          userId,
          status: "waitlist",
          position: nextPosition,
        },
      });
      await tx.event.update({
        where: { id: eventId },
        data: { waitlistCount: { increment: 1 } },
      });

      return {
        ok: true as const,
        body: {
          success: true,
          status: "waitlist" as const,
          position: nextPosition,
          message: `Kontenjan dolu. ${nextPosition}. sıraya bekleme listesine alındınız.`,
        },
      };
    });

    if (!outcome.ok) {
      return NextResponse.json(outcome.body, { status: outcome.status });
    }

    if (outcome.body.success) {
      const [user, event] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        }),
        prisma.event.findUnique({
          where: { id: eventId },
          select: { title: true, deadline: true },
        }),
      ]);

      if (user?.email && event) {
        if (
          "status" in outcome.body &&
          outcome.body.status === "confirmed"
        ) {
          try {
            await sendRegistrationConfirmation(
              user.email,
              user.name ?? "Kullanıcı",
              event.title,
              event.deadline
            );
          } catch (error) {
            console.error("Email gönderilemedi:", error);
          }
        } else if (
          "status" in outcome.body &&
          outcome.body.status === "waitlist" &&
          "position" in outcome.body
        ) {
          try {
            await sendWaitlistConfirmation(
              user.email,
              user.name ?? "Kullanıcı",
              event.title,
              outcome.body.position
            );
          } catch (error) {
            console.error("Email gönderilemedi:", error);
          }
        }
      }
    }

    return NextResponse.json(outcome.body);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Zaten kayıtlısınız" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
