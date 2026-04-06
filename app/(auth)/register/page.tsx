"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FACULTIES = ["İnegöl İşletme Fakültesi"] as const;

const ULUDAG_SUFFIX = "@uludag.edu.tr";

const inputClass =
  "w-full rounded-2xl border-2 border-slate-100 bg-gray-50 px-4 py-3.5 text-[#0F172A] outline-none transition-all duration-200 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-[#475569]";

const submitClass =
  "flex w-full transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#2563EB] hover:to-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    if (!nameTrim || !emailTrim || !faculty || !password || !passwordAgain) {
      setError("Tüm alanlar zorunludur.");
      return;
    }
    const emailLower = emailTrim.toLowerCase();
    if (!emailLower.endsWith(ULUDAG_SUFFIX)) {
      setError("E-posta adresi @uludag.edu.tr ile bitmelidir.");
      return;
    }
    if (password !== passwordAgain) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrim,
          email: emailLower,
          password,
          faculty,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !data.success) {
        setError(
          typeof data.message === "string"
            ? data.message
            : "Kayıt sırasında bir hata oluştu."
        );
        return;
      }
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      router.push("/login");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-semibold text-[#0F172A]">
        Kayıt Ol
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Ad Soyad
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            E-posta (@uludag.edu.tr)
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
          <label htmlFor="faculty" className={labelClass}>
            Fakülte
          </label>
          <select
            id="faculty"
            name="faculty"
            required
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className={inputClass}
          >
            <option value="">Fakültenizi seçin</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="passwordAgain" className={labelClass}>
            Şifre Tekrar
          </label>
          <input
            id="passwordAgain"
            name="passwordAgain"
            type="password"
            autoComplete="new-password"
            required
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
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
              Kaydediliyor…
            </>
          ) : (
            "Kayıt Ol"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#475569]">
        Zaten hesabın var mı?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2563EB] underline-offset-2 hover:text-[#1E3A8A] hover:underline"
        >
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
