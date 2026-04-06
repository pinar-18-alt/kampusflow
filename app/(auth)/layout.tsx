export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#00A693] via-[#007A6E] to-[#005F73] p-12 lg:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uludag-logo.png"
          alt="Uludağ Üniversitesi"
          className="mb-6 h-20 w-20 object-contain"
        />
        <h1 className="text-4xl font-bold text-white">KampüsFlow</h1>
        <p className="mt-1 text-lg text-teal-200">Uludağ Üniversitesi</p>
        <p className="mt-0.5 text-sm text-teal-300">
          İnegöl İşletme Fakültesi
        </p>
        <div className="my-6 h-0.5 w-16 bg-white/30" aria-hidden />
        <ul className="flex max-w-sm flex-col gap-3 text-sm text-teal-100">
          <li className="flex items-center gap-2">
            <span className="text-white" aria-hidden>
              ✓
            </span>
            Etkinlikleri keşfet ve katıl
          </li>
          <li className="flex items-center gap-2">
            <span className="text-white" aria-hidden>
              ✓
            </span>
            Anlık kontenjan takibi
          </li>
          <li className="flex items-center gap-2">
            <span className="text-white" aria-hidden>
              ✓
            </span>
            Otomatik bekleme listesi
          </li>
        </ul>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
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
