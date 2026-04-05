"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#00A693]";

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
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A693] py-3 font-semibold text-white transition-colors hover:bg-[#007A6E] disabled:cursor-not-allowed disabled:opacity-70"
        >
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
