"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  eventId: string;
};

export function CloseEventButton({ eventId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClose() {
    if (
      !window.confirm(
        "Etkinliği kapatmak istediğinize emin misiniz? Yeni kayıtlar alınamayacak."
      )
    ) {
      return;
    }
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleClose()}
      className="rounded-xl border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Kapatılıyor…" : "Etkinliği Kapat"}
    </button>
  );
}
