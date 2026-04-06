import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { prisma } from "@/lib/prisma";
import { EventQuotaBar } from "@/app/components/EventQuotaBar";
import { LogoImageWithFallback } from "@/app/components/LogoImageWithFallback";
import { CloseEventButton } from "./CloseEventButton";

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  if (status === "active") {
    return (
      <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
        Aktif
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
      Kapandı
    </span>
  );
}

export default async function AdminEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              faculty: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) notFound();

  const community = event.community ?? "UYBİST";
  const communityLogo = event.communityLogo ?? "/uybist-logo.png";

  const confirmed = event.registrations.filter((r) => r.status === "confirmed");
  const waitlisted = event.registrations
    .filter((r) => r.status === "waitlist")
    .sort(
      (a, b) =>
        (a.position ?? Number.MAX_SAFE_INTEGER) -
        (b.position ?? Number.MAX_SAFE_INTEGER)
    );

  return (
    <div>
      <Link
        href="/admin/events"
        className="text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1E3A8A] hover:underline"
      >
        ← Etkinlik Yönetimine Dön
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <LogoImageWithFallback
            src={communityLogo}
            alt={community}
            imgClassName="h-10 w-10 rounded-lg object-contain"
            fallbackClassName="h-10 w-10 rounded-lg text-xs"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Topluluk
            </p>
            <p className="text-lg font-bold text-[#1E3A8A]">{community}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {statusBadge(event.status)}
            {event.status === "active" ? (
              <CloseEventButton eventId={event.id} />
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kontenjan
            </p>
            <p className="mt-1 text-lg font-bold text-[#2563EB]">{event.quota}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kayıtlı
            </p>
            <p className="mt-1 text-lg font-bold text-[#2563EB]">
              {event.registeredCount}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bekleme
            </p>
            <p className="mt-1 text-lg font-bold text-[#2563EB]">
              {event.waitlistCount}
            </p>
          </div>
          <div className="col-span-2 rounded-xl bg-slate-50 p-4 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Son Başvuru
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {format(event.deadline, "dd MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Doluluk
          </p>
          <EventQuotaBar
            registeredCount={event.registeredCount}
            quota={event.quota}
          />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-[#1E3A8A]">Açıklama</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">
            {event.description}
          </p>
        </div>
      </article>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-[#1E3A8A]">
              Katılımcı Listesi
            </h2>
            <span className="rounded-full bg-blue-50 px-3 py-0.5 text-sm font-semibold text-[#2563EB]">
              {confirmed.length} katılımcı
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
            <table className="min-w-full select-all text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">Ad Soyad</th>
                  <th className="px-3 py-3">E-posta</th>
                  <th className="px-3 py-3">Fakülte</th>
                  <th className="px-3 py-3">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {confirmed.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Henüz kayıtlı katılımcı yok
                    </td>
                  </tr>
                ) : (
                  confirmed.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3 text-slate-600">{i + 1}</td>
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {r.user.name ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {r.user.email}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {r.user.faculty ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                        {format(r.createdAt, "dd MMM yyyy, HH:mm", {
                          locale: tr,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {confirmed.length > 0 ? (
            <p className="mt-2 text-xs text-gray-500">
              Listeyi kopyalamak için tablo seçilebilir
            </p>
          ) : null}
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-[#1E3A8A]">
              Bekleme Listesi
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-sm font-semibold text-amber-900">
              {waitlisted.length} kişi bekliyor
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-3">Sıra</th>
                  <th className="px-3 py-3">Ad Soyad</th>
                  <th className="px-3 py-3">E-posta</th>
                  <th className="px-3 py-3">Bekleme Başlangıcı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitlisted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Bekleme listesi boş
                    </td>
                  </tr>
                ) : (
                  waitlisted.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {r.position ?? "—"}
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-900">
                        {r.user.name ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {r.user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                        {format(r.createdAt, "dd MMM yyyy, HH:mm", {
                          locale: tr,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
