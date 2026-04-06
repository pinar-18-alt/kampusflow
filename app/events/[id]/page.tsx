import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { auth } from "@/lib/auth";
import { LogoImageWithFallback } from "@/app/components/LogoImageWithFallback";
import { RegistrationButton } from "./RegistrationButton";
import { getInternalBaseUrl } from "@/lib/internal-url";

export const dynamic = "force-dynamic";

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  community?: string;
  communityLogo?: string;
  quota: number;
  registeredCount: number;
  waitlistCount: number;
  deadline: string;
  status: string;
  registrations: Array<{
    userId: string;
    status: string;
    position: number | null;
  }>;
};

async function fetchEvent(id: string): Promise<ApiEvent | null> {
  const base = getInternalBaseUrl();
  const res = await fetch(`${base}/api/events/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as { event?: ApiEvent };
  return data.event ?? null;
}

function heroStatusBadge(
  status: string,
  registeredCount: number,
  quota: number
) {
  const full = quota > 0 && registeredCount >= quota;
  if (full) {
    return (
      <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Kontenjan Dolu
      </span>
    );
  }
  if (status !== "active") {
    return (
      <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-sm">
        Kapandı
      </span>
    );
  }
  return (
    <span className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
      Aktif
    </span>
  );
}

function quotaPercent(registeredCount: number, quota: number) {
  if (quota <= 0) return 0;
  return Math.min(100, (registeredCount / quota) * 100);
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const event = await fetchEvent(id);
  if (!event) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const myReg = userId
    ? event.registrations.find((r) => r.userId === userId)
    : undefined;

  const initialStatus =
    myReg?.status === "confirmed" || myReg?.status === "waitlist"
      ? myReg.status
      : null;
  const waitlistPosition =
    myReg?.status === "waitlist" && myReg.position != null
      ? myReg.position
      : null;

  const deadlineDate = new Date(event.deadline);
  const deadlineLabel = format(deadlineDate, "d MMMM yyyy, HH:mm", {
    locale: tr,
  });

  const pct = quotaPercent(event.registeredCount, event.quota);
  const community = event.community ?? "UYBİST";
  const communityLogo = event.communityLogo ?? "/uybist-logo.png";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-[#00A693] transition-colors hover:text-[#005F73]"
        >
          ← Etkinliklere Dön
        </Link>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_min(100%,380px)] lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-6">
            <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#00A693] via-[#007A6E] to-[#005F73] p-8 text-white">
              <div className="absolute inset-0 bg-black/10" aria-hidden />
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <LogoImageWithFallback
                    src={communityLogo}
                    alt={community}
                    imgClassName="h-10 w-10 rounded-lg bg-white/20 object-contain p-1"
                    fallbackClassName="h-10 w-10 rounded-lg text-xs"
                  />
                  <div>
                    <p className="text-xs text-teal-100">Düzenleyen</p>
                    <p className="font-semibold text-white">{community}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3">
                      {heroStatusBadge(
                        event.status,
                        event.registeredCount,
                        event.quota
                      )}
                    </div>
                    <h1 className="text-2xl font-bold leading-tight md:text-3xl">
                      {event.title}
                    </h1>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-teal-100 md:text-base">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Açıklama
              </h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-gray-700">
                {event.description}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-gray-50 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#00A693]">
                  {event.quota} kişi
                </p>
                <p className="mt-1 text-xs text-gray-400">Kontenjan</p>
              </div>
              <div className="rounded-2xl border border-gray-50 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#00A693]">
                  {event.registeredCount}
                </p>
                <p className="mt-1 text-xs text-gray-400">Kayıtlı</p>
              </div>
              <div className="rounded-2xl border border-gray-50 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#00A693]">
                  {event.waitlistCount}
                </p>
                <p className="mt-1 text-xs text-gray-400">Bekleme</p>
              </div>
              <div className="rounded-2xl border border-gray-50 bg-white p-4 text-center shadow-sm">
                <p className="break-words text-lg font-bold leading-tight text-[#00A693] md:text-2xl">
                  {deadlineLabel}
                </p>
                <p className="mt-1 text-xs text-gray-400">Son Başvuru</p>
              </div>
            </div>

            <div className="card p-6 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Doluluk
              </h2>
              <div className="mt-3">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>
                    {event.registeredCount} / {event.quota} kayıtlı
                  </span>
                  <span className="font-semibold text-[#00A693]">
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[#00A693] to-[#007A6E] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md">
              <h2 className="text-lg font-bold text-[#005F73]">Kayıt</h2>
              <p className="mt-1 text-sm text-gray-500">
                Etkinliğe katılmak veya kaydını yönetmek için aşağıdaki seçenekleri
                kullanın.
              </p>
              <div className="mt-5">
                <RegistrationButton
                  eventId={event.id}
                  initialStatus={initialStatus}
                  waitlistPosition={waitlistPosition}
                  eventStatus={event.status}
                  deadline={event.deadline}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
