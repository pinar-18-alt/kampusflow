"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

const inputClass =
  "w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3.5 text-gray-800 outline-none transition-all duration-200 focus:border-[#00A693] focus:bg-white focus:ring-4 focus:ring-[#00A693]/10";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const submitClass =
  "flex w-full transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00A693] to-[#007A6E] py-3.5 font-semibold text-white shadow-lg shadow-[#00A693]/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#007A6E] hover:to-[#005F73] hover:shadow-xl hover:shadow-[#00A693]/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("E-posta veya şifre hatalı");
        return;
      }
      if (result?.ok) {
        router.refresh();
        const session = await getSession();
        const role = session?.user?.role;
        router.push(role === "admin" ? "/admin" : "/events");
      }
    } catch {
      setError("E-posta veya şifre hatalı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Giriş Yap
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="ornek@uludag.edu.tr"
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={loading} className={submitClass}>
          {loading ? (
            <>
              <span
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
              Giriş yapılıyor…
            </>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Hesabın yok mu?{" "}
        <Link
          href="/register"
          className="font-medium text-[#00A693] underline-offset-2 hover:text-[#005F73] hover:underline"
        >
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}
