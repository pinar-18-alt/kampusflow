export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] lg:flex">
        <div
          className="absolute -right-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/10"
          aria-hidden
        />
        <div
          className="absolute bottom-10 -left-10 h-64 w-64 animate-pulse rounded-full bg-blue-400/10 delay-1000"
          aria-hidden
        />

        <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 pb-40 pt-12 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uludag-logo.png"
            alt="Uludağ Üniversitesi"
            className="mb-6 h-20 w-20 object-contain"
          />
          <h1 className="text-5xl font-black tracking-tight text-white">
            KampüsFlow
          </h1>
          <p className="mt-1 text-lg text-blue-200">Uludağ Üniversitesi</p>
          <p className="mt-0.5 text-sm text-blue-200/90">
            İnegöl İşletme Fakültesi
          </p>
          <div className="my-6 h-0.5 w-16 bg-white/30" aria-hidden />
          <ul className="flex max-w-sm flex-col gap-3 text-sm text-blue-200">
            <li className="flex items-center gap-2">
              <span aria-hidden>→</span>
              Etkinlikleri keşfet ve katıl
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>→</span>
              Anlık kontenjan takibi
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>→</span>
              Otomatik bekleme listesi
            </li>
          </ul>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
            <div className="text-xl font-bold text-white">4</div>
            <div className="text-xs text-blue-200">Etkinlik</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
            <div className="text-xl font-bold text-white">3</div>
            <div className="text-xs text-blue-200">Üye</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
            <div className="text-xl font-bold text-white">∞</div>
            <div className="text-xs text-blue-200">İmkan</div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#F8FAFF] p-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl shadow-blue-900/10">
          <div className="mb-6 flex justify-center lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uludag-logo.png"
              alt="Uludağ Üniversitesi"
              className="h-14 w-14 object-contain"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
