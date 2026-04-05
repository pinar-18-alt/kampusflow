"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-br from-red-50/80 via-white to-[#00A693]/5 px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#005F73] md:text-3xl">
          Bir hata oluştu
        </h1>
        <p className="mt-4 text-gray-600">
          Üzgünüz, beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.
        </p>
        {process.env.NODE_ENV === "development" && error.message ? (
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-gray-100 p-3 text-left text-xs text-red-800">
            {error.message}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-[#00A693] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#007A6E]"
        >
          Tekrar dene
        </button>
      </div>
    </main>
  );
}
