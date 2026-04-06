export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-blue-200 border-t-[#2563EB]"
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-600">Yükleniyor...</p>
    </div>
  );
}
