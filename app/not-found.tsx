import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-br from-[#00A693]/10 via-white to-[#005F73]/10 px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A693]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#005F73] md:text-4xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mt-4 text-gray-600">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-flex rounded-xl bg-[#00A693] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#007A6E]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
