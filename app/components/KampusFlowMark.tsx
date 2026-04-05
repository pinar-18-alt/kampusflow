/** Auth kartları için mark — metin + ikon */
export function KampusFlowMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00A693] to-[#005F73] shadow-md"
        aria-hidden
      >
        <svg
          viewBox="0 0 32 32"
          className="h-8 w-8 text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 22V10l8-4 8 4v12l-8 4-8-4z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M16 6v20M8 10l8 4 8-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-2xl font-bold tracking-tight text-[#00A693]">
        KampüsFlow
      </span>
      <span className="mt-1 text-center text-xs text-gray-500">
        Uludağ Üniversitesi Etkinlik Platformu
      </span>
    </div>
  );
}
