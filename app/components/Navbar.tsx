"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function desktopNavLinkClass(active: boolean) {
  const base =
    "relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#00A693] after:transition-all after:duration-200";
  if (active) {
    return `${base} text-[#00A693] after:w-full`;
  }
  return `${base} text-gray-500 after:w-0 hover:text-[#00A693] hover:after:w-full`;
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const loggedIn = status === "authenticated" && session?.user;
  const isAdmin = session?.user?.role === "admin";

  const eventsActive =
    pathname === "/events" || pathname.startsWith("/events/");
  const profileActive = pathname.startsWith("/profile");
  const adminActive = pathname.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href={loggedIn ? "/events" : "/login"}
          className="flex items-center gap-2 text-lg font-bold text-[#00A693]"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uludag-logo.png"
            alt="Uludağ Üniversitesi"
            className="h-8 w-8 object-contain"
          />
          <span>KampüsFlow</span>
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
              <Link
                href="/events"
                className={desktopNavLinkClass(eventsActive)}
              >
                Etkinlikler
              </Link>
              <Link
                href="/profile"
                className={desktopNavLinkClass(profileActive)}
              >
                Profilim
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={desktopNavLinkClass(adminActive)}
                >
                  Admin Panel
                </Link>
              ) : null}
              <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00A693] to-[#005F73] text-sm font-bold text-white ring-2 ring-[#00A693]/20"
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
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm text-gray-400 transition-colors hover:text-red-400"
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary inline-block text-sm no-underline"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>

      {open ? (
        <div className="border-t border-gray-100 bg-white/95 px-4 py-3 shadow-md backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {loggedIn ? (
              <>
                <div className="mb-2 flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#00A693] to-[#005F73] text-sm font-bold text-white ring-2 ring-[#00A693]/20">
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
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    eventsActive
                      ? "text-[#00A693]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#00A693]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Etkinlikler
                </Link>
                <Link
                  href="/profile"
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    profileActive
                      ? "text-[#00A693]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#00A693]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Profilim
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                      adminActive
                        ? "text-[#00A693]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#00A693]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="mt-1 px-3 py-2.5 text-left text-sm text-gray-400 transition-colors hover:text-red-400"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary block w-full py-3 text-center text-sm no-underline"
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
