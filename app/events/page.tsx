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
    <main className="mx-auto max-w-7xl">
      <div className="mb-8 bg-gradient-to-r from-[#00A693] to-[#005F73] p-8 text-white">
        <h1 className="text-3xl font-bold">Etkinlikler</h1>
        <p className="mt-1 text-teal-100">
          Kampüs etkinliklerini keşfet ve katıl
        </p>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#00A693]/30 bg-gray-50 py-16 text-center">
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
