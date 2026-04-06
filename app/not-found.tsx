import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-br from-blue-50/80 via-white to-slate-100/80 px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mt-4 text-gray-600">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
