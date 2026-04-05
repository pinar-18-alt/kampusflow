import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { EventStatusBadge } from "@/app/components/EventStatusBadge";

export type EventCardEvent = {
  id: string;
  title: string;
  description: string;
  quota: number;
  registeredCount: number;
  waitlistCount?: number;
  deadline: string;
  status: string;
};

function quotaPercent(registeredCount: number, quota: number) {
  if (quota <= 0) return 0;
  return Math.min(100, (registeredCount / quota) * 100);
}

export function EventCard({ event }: { event: EventCardEvent }) {
  const deadline = new Date(event.deadline);
  const now = new Date();
  const daysLeft = differenceInCalendarDays(deadline, now);
  const waitlistCount = event.waitlistCount ?? 0;
  const percent = quotaPercent(event.registeredCount, event.quota);
  const barWidth = Math.min(percent, 100);

  let chipClass =
    "inline-flex rounded-full border px-3 py-1 text-xs font-medium bg-gray-50 text-gray-400 border-transparent";
  if (daysLeft < 0) {
    chipClass =
      "inline-flex rounded-full border px-3 py-1 text-xs font-medium bg-gray-50 text-gray-400 border-transparent";
  } else if (daysLeft <= 3) {
    chipClass =
      "inline-flex rounded-full border px-3 py-1 text-xs font-medium bg-red-50 text-red-500 border-red-100";
  } else if (daysLeft <= 7) {
    chipClass =
      "inline-flex rounded-full border px-3 py-1 text-xs font-medium bg-orange-50 text-orange-500 border-orange-100";
  }

  const chipText =
    daysLeft < 0
      ? "Son başvuru tarihi geçti"
      : `Son başvuru: ${daysLeft} gün kaldı`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="h-1.5 shrink-0 bg-[#00A693]" aria-hidden />
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 line-clamp-1 text-xl font-bold text-gray-800">
          {event.title}
        </h2>
        <p className="mb-4 line-clamp-2 min-h-[40px] text-sm text-gray-500">
          {event.description}
        </p>

        <div className="mb-3">
          <div className="mb-1 h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-[#00A693] transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="mb-3 text-xs text-gray-400">
            {event.registeredCount}/{event.quota} kişi · {waitlistCount} bekleme
          </p>
        </div>

        <div className="mb-1">
          <span className={chipClass}>{chipText}</span>
        </div>

        <div className="mt-auto flex flex-col items-center pt-2">
          <EventStatusBadge
            compact
            status={event.status}
            registeredCount={event.registeredCount}
            quota={event.quota}
          />
          <Link
            href={`/events/${event.id}`}
            className="mt-4 w-full rounded-xl bg-[#00A693] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#007A6E]"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </article>
  );
}
