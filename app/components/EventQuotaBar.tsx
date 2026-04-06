export function isQuotaFull(registeredCount: number, quota: number) {
  return quota > 0 && registeredCount >= quota;
}

export function quotaPercentValue(registeredCount: number, quota: number) {
  if (quota <= 0) return 0;
  return Math.min(100, (registeredCount / quota) * 100);
}

function barColorClass(registeredCount: number, quota: number) {
  if (isQuotaFull(registeredCount, quota)) return "bg-red-500";
  const p = quotaPercentValue(registeredCount, quota);
  if (p < 70) return "bg-blue-600";
  if (p < 100) return "bg-amber-500";
  return "bg-red-500";
}

type Props = {
  registeredCount: number;
  quota: number;
};

export function EventQuotaBar({ registeredCount, quota }: Props) {
  const full = isQuotaFull(registeredCount, quota);
  const pct = quotaPercentValue(registeredCount, quota);

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-600">
        <span>
          {full ? (
            <span className="font-semibold text-red-600">Kontenjan Dolu</span>
          ) : (
            <>
              {registeredCount} / {quota} kişi
            </>
          )}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColorClass(registeredCount, quota)}`}
          style={{ width: `${full ? 100 : pct}%` }}
        />
      </div>
    </div>
  );
}
