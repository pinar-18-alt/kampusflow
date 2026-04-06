import { EventCard, type EventCardEvent } from "@/app/components/EventCard";
import { getInternalBaseUrl } from "@/lib/internal-url";

export const dynamic = "force-dynamic";

async function fetchEvents(): Promise<EventCardEvent[]> {
  const base = getInternalBaseUrl();
  const res = await fetch(`${base}/api/events`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { events?: EventCardEvent[] };
  return Array.isArray(data.events) ? data.events : [];
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] px-6 py-16">
        <div
          className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 animate-pulse rounded-full bg-blue-500/10"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-1/4 h-64 w-64 translate-y-1/2 rounded-full bg-blue-400/10"
          aria-hidden
        />
        <div
          className="absolute left-0 top-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white/5"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="text-5xl font-black text-white">Etkinlikler</h1>
          <p className="mt-2 text-blue-200">
            Kampüs etkinliklerini keşfet ve katıl
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-200/60 bg-white py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">
              Henüz etkinlik yok
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="min-h-0">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
