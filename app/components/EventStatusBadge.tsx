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
    ? "rounded-full border px-2.5 py-0.5 text-xs font-semibold"
    : "rounded-full border px-3 py-1 text-sm font-semibold";

  if (isQuotaFull(registeredCount, quota)) {
    return (
      <span className={`${box} border-red-100 bg-red-50 text-red-700`}>
        Kontenjan Dolu
      </span>
    );
  }
  if (status !== "active") {
    return (
      <span className={`${box} border-slate-200 bg-slate-100 text-slate-700`}>
        Kapandı
      </span>
    );
  }
  return (
    <span className={`${box} border-blue-100 bg-blue-50 text-blue-700`}>
      Aktif
    </span>
  );
}
