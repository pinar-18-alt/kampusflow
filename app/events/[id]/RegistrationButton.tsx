"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type RegStatus = "confirmed" | "waitlist" | null;

type Props = {
  eventId: string;
  initialStatus: RegStatus;
  waitlistPosition: number | null;
  eventStatus: string;
  deadline: string;
};

export function RegistrationButton({
  eventId,
  initialStatus,
  waitlistPosition,
  eventStatus,
  deadline,
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [regStatus, setRegStatus] = useState<RegStatus>(initialStatus);
  const [position, setPosition] = useState<number | null>(waitlistPosition);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRegStatus(initialStatus);
    setPosition(waitlistPosition);
  }, [initialStatus, waitlistPosition]);

  const deadlinePassed = new Date(deadline).getTime() < Date.now();
  const registrationsClosed =
    eventStatus !== "active" || deadlinePassed;

  const loggedIn = status === "authenticated" && !!session?.user;

  async function handleRegister() {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        status?: string;
        position?: number;
      };
      if (!res.ok || !data.success) {
        toast.error(data.message ?? "İşlem başarısız.");
        return;
      }
      toast.success(data.message ?? "Tamamlandı.");
      if (data.status === "waitlist" && typeof data.position === "number") {
        setRegStatus("waitlist");
        setPosition(data.position);
      } else if (data.status === "confirmed") {
        setRegStatus("confirmed");
        setPosition(null);
      }
      router.refresh();
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        toast.error(data.message ?? "İşlem başarısız.");
        return;
      }
      toast.success(data.message ?? "Tamamlandı.");
      setRegStatus(null);
      setPosition(null);
      router.refresh();
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  function Spinner({ className }: { className?: string }) {
    return (
      <span
        className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${className ?? "border-white"}`}
        aria-hidden
      />
    );
  }

  if (registrationsClosed) {
    return (
      <span className="inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
        Kayıtlar Kapandı
      </span>
    );
  }

  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primaryDark"
      >
        Katılmak için giriş yapın
      </Link>
    );
  }

  if (regStatus === "confirmed") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
          Kaydım Var ✓
        </span>
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleCancel()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-500 px-5 py-3 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:opacity-60"
        >
          {loading ? <Spinner className="border-red-600" /> : null}
          İptal Et
        </button>
      </div>
    );
  }

  if (regStatus === "waitlist") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
          Bekleme Listesinde
          {position != null ? ` (${position}. sıra)` : ""}
        </span>
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleCancel()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {loading ? <Spinner className="border-slate-600" /> : null}
          Listeden Çık
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleRegister()}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primaryDark disabled:opacity-60"
    >
      {loading ? <Spinner /> : null}
      Katıl
    </button>
  );
}
