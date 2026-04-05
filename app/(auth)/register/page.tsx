"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FACULTIES = [
  "Mühendislik",
  "Tıp",
  "Eczacılık",
  "Hukuk",
  "İktisadi İdari Bilimler",
  "Eğitim",
  "Fen Edebiyat",
  "Ziraat",
  "Veteriner",
  "Güzel Sanatlar",
  "İlahiyat",
] as const;

const ULUDAG_SUFFIX = "@uludag.edu.tr";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#00A693]";

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
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Kayıt Ol
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="faculty"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
            <option value="">Fakülte seçiniz</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="passwordAgain"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
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
              Kaydediliyor…
            </>
          ) : (
            "Kayıt Ol"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Zaten hesabın var mı?{" "}
        <Link
          href="/login"
          className="font-medium text-[#00A693] underline-offset-2 hover:text-[#005F73] hover:underline"
        >
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
