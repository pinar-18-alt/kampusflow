import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type RegistrationWithEvent = Prisma.RegistrationGetPayload<{
  include: { event: true };
}>;

function getInitials(name: string | null | undefined, email: string) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (
        parts[0]![0]! + parts[parts.length - 1]![0]!
      ).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0] ?? email;
  return local.slice(0, 2).toUpperCase();
}

function formatDeadline(d: Date) {
  return format(d, "dd MMMM yyyy", { locale: tr });
}

function statusBadge(reg: RegistrationWithEvent) {
  if (reg.status === "waitlist") {
    return (
      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
        Bekleme
      </span>
    );
  }
  if (reg.status === "confirmed") {
    return (
      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Onaylı
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
      {reg.status}
    </span>
  );
}

function RegistrationRow({
  reg,
  header,
}: {
  reg: RegistrationWithEvent;
  header?: ReactNode;
}) {
  return (
    <div className="flex cursor-pointer flex-col gap-2 p-4 transition-colors hover:rounded-2xl hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        {header}
        <p className="font-semibold text-gray-900">{reg.event.title}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          Son başvuru: {formatDeadline(reg.event.deadline)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {statusBadge(reg)}
        <Link
          href={`/events/${reg.event.id}`}
          className="text-sm font-semibold text-[#00A693] hover:text-[#005F73]"
        >
          Etkinliğe Git →
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-12 text-center">
      <span className="mb-3 text-4xl" aria-hidden>
        {icon}
      </span>
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
}

function Section({
  title,
  count,
  items,
  renderItem,
  emptyLabel,
  emptyIcon,
}: {
  title: string;
  count: number;
  items: RegistrationWithEvent[];
  renderItem: (reg: RegistrationWithEvent) => ReactNode;
  emptyLabel: string;
  emptyIcon: string;
}) {
  return (
    <section className="card mb-4 p-6 shadow-sm">
      <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
        {title}{" "}
        <span className="ml-2 inline-flex rounded-full bg-[#E0F5F2] px-2 py-0.5 text-xs font-semibold text-[#00A693]">
          {count}
        </span>
      </h2>
      {items.length === 0 ? (
        <EmptyState icon={emptyIcon} message={emptyLabel} />
      ) : (
        <ul>
          {items.map((reg) => (
            <li
              key={reg.id}
              className="border-b border-gray-50 last:border-b-0"
            >
              {renderItem(reg)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, registrations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, faculty: true, role: true },
    }),
    prisma.registration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const now = new Date();

  const attended = registrations.filter(
    (r) => r.status === "confirmed" && r.event.deadline > now
  );

  const waitlist = registrations.filter(
    (r) => r.status === "waitlist" && r.event.deadline >= now
  );

  const past = registrations.filter((r) => r.event.deadline < now);

  const initials = getInitials(user.name, user.email);
  const isAdmin = user.role === "admin";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-[#00A693] to-[#005F73] p-8 text-white">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:text-left">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white ring-4 ring-white/30 backdrop-blur-sm"
              aria-hidden
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">
                {user.name ?? "İsimsiz kullanıcı"}
              </h1>
              <p className="mt-1 text-teal-100">{user.email}</p>
              {user.faculty ? (
                <p className="mt-2 text-sm font-medium text-teal-200">
                  {user.faculty}
                </p>
              ) : null}
              <div className="mt-4">
                {isAdmin ? (
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                    Yönetici
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-teal-100">
                    Öğrenci
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-[#005F73]">Etkinliklerim</h2>
        <p className="mb-6 text-sm text-gray-500">
          Kayıtlı olduğunuz ve beklediğiniz etkinlikler
        </p>

        <Section
          title="Katıldıklarım"
          count={attended.length}
          items={attended}
          emptyLabel="Henüz kayıtlı olduğunuz bir etkinlik yok"
          emptyIcon="✅"
          renderItem={(reg) => <RegistrationRow reg={reg} />}
        />

        <Section
          title="Bekleme Listesi"
          count={waitlist.length}
          items={waitlist}
          emptyLabel="Bekleme listesinde olduğunuz etkinlik yok"
          emptyIcon="⏳"
          renderItem={(reg) => (
            <RegistrationRow
              reg={reg}
              header={
                reg.position != null ? (
                  <p className="mb-1 text-xs font-medium text-amber-800">
                    {reg.position}. sırada bekliyorsunuz
                  </p>
                ) : null
              }
            />
          )}
        />

        <Section
          title="Geçmiş Etkinlikler"
          count={past.length}
          items={past}
          emptyLabel="Geçmiş etkinlik kaydınız bulunmuyor"
          emptyIcon="📅"
          renderItem={(reg) => <RegistrationRow reg={reg} />}
        />
      </div>
    </main>
  );
}
