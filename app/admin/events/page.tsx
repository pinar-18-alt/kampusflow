import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { prisma } from "@/lib/prisma";
import { EventsHeader } from "./EventsHeader";
import { EventRowActions } from "./EventRowActions";

export const dynamic = "force-dynamic";

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

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#1E3A8A] md:text-3xl">
          Etkinlik Yönetimi
        </h1>
        <EventsHeader />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Etkinlik</th>
              <th className="px-4 py-3">Kontenjan</th>
              <th className="px-4 py-3">Kayıtlı</th>
              <th className="px-4 py-3">Bekleme</th>
              <th className="px-4 py-3">Son Başvuru</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Henüz etkinlik yok
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/80">
                  <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900">
                    <span className="line-clamp-2">{ev.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{ev.quota}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {ev.registeredCount}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {ev.waitlistCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {format(ev.deadline, "dd MMMM yyyy, HH:mm", { locale: tr })}
                  </td>
                  <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                  <td className="px-4 py-3">
                    <EventRowActions eventId={ev.id} status={ev.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
