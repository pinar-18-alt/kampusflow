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
    <main className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00A693] via-[#008F82] to-[#005F73] px-6 py-12">
        <div
          className="absolute right-0 top-0 h-64 w-64 -translate-y-32 translate-x-32 rounded-full bg-white/5"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 rounded-full bg-white/5"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white">Etkinlikler</h1>
          <p className="mt-2 text-teal-100">
            Kampüs etkinliklerini keşfet ve katıl
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#00A693]/30 bg-white py-16 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-700">
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
