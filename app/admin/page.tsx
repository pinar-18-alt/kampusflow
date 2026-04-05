import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-50 bg-white p-5 shadow-sm">
      <p className="text-4xl font-bold text-[#00A693]">{value}</p>
      <p className="mt-1 text-sm text-gray-400">{label}</p>
    </div>
  );
}

function statusBadge(status: string) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Aktif
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
      Kapandı
    </span>
  );
}

export default async function AdminDashboardPage() {
  const [
    totalEvents,
    activeEvents,
    totalUsers,
    totalRegistrations,
    totalWaitlist,
    recentEvents,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "active" } }),
    prisma.user.count({ where: { role: "user" } }),
    prisma.registration.count({ where: { status: "confirmed" } }),
    prisma.registration.count({ where: { status: "waitlist" } }),
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#005F73] md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-gray-600">KampüsFlow yönetim özeti</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Toplam Etkinlik" value={totalEvents} />
        <StatCard label="Aktif Etkinlik" value={activeEvents} />
        <StatCard label="Toplam Üye" value={totalUsers} />
        <StatCard label="Toplam Kayıt" value={totalRegistrations} />
        <StatCard label="Bekleme Listesi" value={totalWaitlist} />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#005F73]">Son Etkinlikler</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Etkinlik Adı</th>
                <th className="px-4 py-3">Kontenjan</th>
                <th className="px-4 py-3">Kayıtlı</th>
                <th className="px-4 py-3">Bekleme</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Henüz etkinlik yok
                  </td>
                </tr>
              ) : (
                recentEvents.map((ev, i) => (
                  <tr
                    key={ev.id}
                    className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {ev.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{ev.quota}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {ev.registeredCount}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {ev.waitlistCount}
                    </td>
                    <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="font-medium text-[#00A693] hover:text-[#005F73] hover:underline"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
