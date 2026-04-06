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

  const chipClass =
    daysLeft < 0
      ? "inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500"
      : "inline-flex rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600";

  const chipText =
    daysLeft < 0
      ? "Son başvuru tarihi geçti"
      : `Son başvuru: ${daysLeft} gün kaldı`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/10">
      <div
        className="h-1 shrink-0 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]"
        aria-hidden
      />
      <div className="flex items-center gap-2 px-5 pt-4">
        <LogoImageWithFallback
          src={communityLogo}
          alt={community}
          imgClassName="h-5 w-5 object-contain"
          fallbackClassName="h-5 w-5 rounded text-[10px]"
        />
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
          {community}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 line-clamp-1 text-lg font-bold leading-tight text-slate-800">
          {event.title}
        </h2>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {event.description}
        </p>

        <div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="mb-3 mt-1.5 text-xs text-slate-400">
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
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
        >
          Detayları Gör
        </Link>
      </div>
    </article>
  );
}
