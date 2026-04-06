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
      <span className="shrink-0 rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
        Onaylı
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
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
    <div className="flex cursor-pointer flex-col gap-2 p-4 transition-colors hover:rounded-2xl hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        {header}
        <p className="font-semibold text-[#0F172A]">{reg.event.title}</p>
        <p className="mt-0.5 text-sm text-slate-500">
          Son başvuru: {formatDeadline(reg.event.deadline)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {statusBadge(reg)}
        <Link
          href={`/events/${reg.event.id}`}
          className="text-sm font-semibold text-[#2563EB] hover:text-[#1E3A8A]"
        >
          Etkinliğe Git →
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
      <span className="mb-3 text-4xl" aria-hidden>
        {icon}
      </span>
      <p className="text-sm font-medium text-slate-600">{message}</p>
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
    <section className="mb-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-semibold text-[#0F172A]">
        {title}{" "}
        <span className="ml-2 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
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
              className="border-b border-slate-50 last:border-b-0"
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
    <main className="min-h-screen bg-[#F8FAFF] px-4 py-8 md:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] p-8 text-white">
          <div
            className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/5"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:text-left">
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
              <p className="mt-1 text-blue-200">{user.email}</p>
              {user.faculty ? (
                <p className="mt-2 text-sm font-medium text-blue-100">
                  {user.faculty}
                </p>
              ) : null}
              <div className="mt-4">
                {isAdmin ? (
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                    Yönetici
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-blue-100">
                    Öğrenci
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-[#1E3A8A]">Etkinliklerim</h2>
        <p className="mb-6 text-sm text-slate-500">
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
