import { isQuotaFull } from "@/app/components/EventQuotaBar";

type Props = {
  status: string;
  registeredCount: number;
  quota: number;
  /** Kart görünümü için daha küçük rozet */
  compact?: boolean;
};

export function EventStatusBadge({
  status,
  registeredCount,
  quota,
  compact,
}: Props) {
  const box = compact
    ? "rounded-full px-2.5 py-0.5 text-xs font-semibold"
    : "rounded-full px-3 py-1 text-sm font-semibold";

  if (isQuotaFull(registeredCount, quota)) {
    return (
      <span className={`${box} bg-red-100 text-red-700`}>Kontenjan Dolu</span>
    );
  }
  if (status !== "active") {
    return (
      <span className={`${box} bg-slate-200 text-slate-700`}>Kapandı</span>
    );
  }
  return (
    <span className={`${box} bg-emerald-100 text-emerald-800`}>Aktif</span>
  );
}
