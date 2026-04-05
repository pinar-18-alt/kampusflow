export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#00A693]/25 border-t-[#00A693]"
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-600">Yükleniyor...</p>
    </div>
  );
}
