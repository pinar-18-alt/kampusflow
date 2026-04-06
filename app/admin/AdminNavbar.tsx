"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function AdminNavbar() {
  const pathname = usePathname();

  const dashActive = pathname === "/admin";
  const eventsActive = pathname.startsWith("/admin/events");

  const linkClass = (active: boolean) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition-all ${
      active
        ? "bg-white/20 text-white"
        : "text-teal-100 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="bg-gradient-to-r from-[#005F73] to-[#00A693] text-white shadow-md">
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
          <Link href="/admin" className={linkClass(dashActive)}>
            Dashboard
          </Link>
          <Link href="/admin/events" className={linkClass(eventsActive)}>
            Etkinlikler
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl border border-white/30 bg-transparent px-3 py-2 text-sm font-medium text-teal-100 transition-all hover:bg-white/10 hover:text-white"
          >
            Çıkış Yap
          </button>
        </div>
      </nav>
    </header>
  );
}
