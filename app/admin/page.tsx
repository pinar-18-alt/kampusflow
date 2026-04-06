import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:shadow-blue-900/5">
      <p className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] bg-clip-text text-4xl font-bold text-transparent">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function statusBadge(status: string) {
  if (status === "active") {
    return (
      <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
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
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-[#1E3A8A] md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-slate-600">KampüsFlow yönetim özeti</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Toplam Etkinlik" value={totalEvents} />
        <StatCard label="Aktif Etkinlik" value={activeEvents} />
        <StatCard label="Toplam Üye" value={totalUsers} />
        <StatCard label="Toplam Kayıt" value={totalRegistrations} />
        <StatCard label="Bekleme Listesi" value={totalWaitlist} />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-[#1E3A8A]">Son Etkinlikler</h2>
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
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
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Henüz etkinlik yok
                  </td>
                </tr>
              ) : (
                recentEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    className="transition-colors hover:bg-blue-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-[#0F172A]">
                      {ev.title}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{ev.quota}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {ev.registeredCount}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {ev.waitlistCount}
                    </td>
                    <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="font-medium text-[#2563EB] hover:text-[#1E3A8A] hover:underline"
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
