"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  eventId: string;
  status: string;
};

export function EventRowActions({ eventId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClose() {
    if (
      !window.confirm(
        "Bu etkinliği kapatmak istediğinize emin misiniz? Yeni kayıt alınamayacaktır."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/close`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        toast.error(
          typeof data.message === "string"
            ? data.message
            : "Etkinlik kapatılamadı."
        );
        return;
      }
      toast.success(data.message ?? "Etkinlik kapatıldı");
      router.refresh();
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Bu etkinliği silmek istediğinize emin misiniz?"
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        toast.error(
          typeof data.message === "string"
            ? data.message
            : "Etkinlik silinemedi."
        );
        return;
      }
      toast.success("Etkinlik silindi");
      router.refresh();
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/events/${eventId}`}
        className="font-medium text-[#2563EB] hover:text-[#1E3A8A] hover:underline"
      >
        Detay
      </Link>
      {status === "active" ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleClose()}
          className="rounded-lg border border-amber-600 px-2 py-1 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-50 disabled:opacity-50"
        >
          Kapat
        </button>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void handleDelete()}
        className="rounded-lg border border-red-600 px-2 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
