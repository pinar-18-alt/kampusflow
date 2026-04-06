import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { EventStatusBadge } from "@/app/components/EventStatusBadge";
import { LogoImageWithFallback } from "@/app/components/LogoImageWithFallback";

export type EventCardEvent = {
  id: string;
  title: string;
  description: string;
  community?: string;
  communityLogo?: string;
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
  const community = event.community ?? "UYBİST";
  const communityLogo = event.communityLogo ?? "/uybist-logo.png";

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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="h-1 shrink-0 bg-gradient-to-r from-[#00A693] to-[#005F73]"
        aria-hidden
      />
      <div className="flex items-center gap-2 px-5 pt-4">
        <LogoImageWithFallback
          src={communityLogo}
          alt={community}
          imgClassName="h-5 w-5 object-contain"
          fallbackClassName="h-5 w-5 rounded text-[10px]"
        />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {community}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 line-clamp-1 text-lg font-bold leading-tight text-gray-800">
          {event.title}
        </h2>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {event.description}
        </p>

        <div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#00A693] to-[#007A6E] transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="mb-3 mt-1.5 text-xs text-gray-400">
            {event.registeredCount}/{event.quota} kişi · {waitlistCount} bekleme
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className={chipClass}>{chipText}</span>
          <EventStatusBadge
            compact
            status={event.status}
            registeredCount={event.registeredCount}
            quota={event.quota}
          />
        </div>

        <Link
          href={`/events/${event.id}`}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#00A693] to-[#007A6E] py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#00A693]/25"
        >
          Detayları Gör
        </Link>
      </div>
    </article>
  );
}
