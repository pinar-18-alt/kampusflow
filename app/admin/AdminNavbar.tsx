"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const linkBase =
  "rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white";

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#005F73] text-white shadow-md">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3"
        aria-label="Yönetim gezinmesi"
      >
        <Link
          href="/admin"
          className="text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          KampüsFlow Admin
        </Link>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            href="/admin"
            className={`${linkBase} ${pathname === "/admin" ? "bg-white/15" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className={`${linkBase} ${pathname.startsWith("/admin/events") ? "bg-white/15" : ""}`}
          >
            Etkinlikler
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/login" })}
            className={`${linkBase} border border-white/30 bg-transparent`}
          >
            Çıkış Yap
          </button>
        </div>
      </nav>
    </header>
  );
}
