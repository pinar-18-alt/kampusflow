"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function getInitials(name: string | null | undefined, email: string) {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (
        parts[0]![0]! + parts[parts.length - 1]![0]!
      ).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0] ?? email;
  return local.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const loggedIn = status === "authenticated" && session?.user;
  const isAdmin = session?.user?.role === "admin";

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#00A693]";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href={loggedIn ? "/events" : "/login"}
          className="text-xl font-bold text-[#00A693]"
          onClick={() => setOpen(false)}
        >
          KampüsFlow
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {loggedIn ? (
            <>
              <Link href="/events" className={linkClass}>
                Etkinlikler
              </Link>
              <Link href="/profile" className={linkClass}>
                Profilim
              </Link>
              {isAdmin ? (
                <Link href="/admin" className={linkClass}>
                  Admin Panel
                </Link>
              ) : null}
              <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00A693] text-xs font-semibold text-white"
                  aria-hidden
                >
                  {getInitials(
                    session.user?.name,
                    session.user?.email ?? ""
                  )}
                </div>
                <span className="max-w-[160px] truncate text-sm text-gray-700">
                  {session.user?.name ?? session.user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut({ callbackUrl: "/login" })}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-[#00A693] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#007A6E]"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>

      {open ? (
        <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-md lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {loggedIn ? (
              <>
                <div className="mb-2 flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00A693] text-xs font-semibold text-white">
                    {getInitials(
                      session.user?.name,
                      session.user?.email ?? ""
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {session.user?.name ?? "Kullanıcı"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/events"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00A693]"
                  onClick={() => setOpen(false)}
                >
                  Etkinlikler
                </Link>
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00A693]"
                  onClick={() => setOpen(false)}
                >
                  Profilim
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00A693]"
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="mt-1 rounded-lg border border-gray-200 px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    void signOut({ callbackUrl: "/login" });
                  }}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-[#00A693] py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
