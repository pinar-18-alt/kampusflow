"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogoImageWithFallback } from "@/app/components/LogoImageWithFallback";

const COMMUNITY_OPTIONS = [
  { name: "UYBİST", logo: "/uybist-logo.png" },
  { name: "Diğer Topluluk", logo: "/uludag-logo.png" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

function toDatetimeLocalValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

export function CreateEventModal({ open, onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quota, setQuota] = useState("50");
  const [deadlineLocal, setDeadlineLocal] = useState("");
  const [communityName, setCommunityName] = useState<string>(
    COMMUNITY_OPTIONS[0].name
  );
  const [loading, setLoading] = useState(false);

  const selectedCommunity =
    COMMUNITY_OPTIONS.find((o) => o.name === communityName) ??
    COMMUNITY_OPTIONS[0];

  useEffect(() => {
    if (open) {
      const base = new Date();
      base.setDate(base.getDate() + 7);
      base.setMinutes(0, 0, 0);
      setDeadlineLocal(toDatetimeLocalValue(base));
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setQuota("50");
      setCommunityName(COMMUNITY_OPTIONS[0].name);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const deadline = new Date(deadlineLocal);
      if (Number.isNaN(deadline.getTime())) {
        toast.error("Geçerli bir tarih seçin.");
        setLoading(false);
        return;
      }
      const quotaNum = parseInt(quota, 10);
      if (!Number.isFinite(quotaNum) || quotaNum < 1) {
        toast.error("Kontenjan en az 1 olmalıdır.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          quota: quotaNum,
          deadline: deadline.toISOString(),
          community: selectedCommunity.name,
          communityLogo: selectedCommunity.logo,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        event?: unknown;
      };

      if (!res.ok) {
        toast.error(
          typeof data.message === "string"
            ? data.message
            : "Etkinlik oluşturulamadı."
        );
        return;
      }

      toast.success("Etkinlik oluşturuldu!");
      onClose();
      router.refresh();
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-event-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl shadow-blue-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="create-event-title"
          className="text-xl font-bold text-[#1E3A8A]"
        >
          Yeni Etkinlik
        </h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="evt-community"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Topluluk
            </label>
            <div className="flex items-center gap-3">
              <LogoImageWithFallback
                src={selectedCommunity.logo}
                alt={selectedCommunity.name}
                imgClassName="h-8 w-8 shrink-0 rounded object-contain"
                fallbackClassName="h-8 w-8 rounded-lg text-xs"
              />
              <select
                id="evt-community"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 p-3 text-slate-900 outline-none transition-colors focus:border-[#2563EB]"
              >
                {COMMUNITY_OPTIONS.map((o) => (
                  <option key={o.name} value={o.name}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="evt-title"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Etkinlik Adı
            </label>
            <input
              id="evt-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 p-3 text-slate-900 outline-none transition-colors focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label
              htmlFor="evt-desc"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Açıklama
            </label>
            <textarea
              id="evt-desc"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-xl border-2 border-slate-200 p-3 text-slate-900 outline-none transition-colors focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label
              htmlFor="evt-quota"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Kontenjan
            </label>
            <input
              id="evt-quota"
              type="number"
              min={1}
              required
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 p-3 text-slate-900 outline-none transition-colors focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label
              htmlFor="evt-deadline"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Son Başvuru Tarihi
            </label>
            <input
              id="evt-deadline"
              type="datetime-local"
              required
              value={deadlineLocal}
              onChange={(e) => setDeadlineLocal(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 p-3 text-slate-900 outline-none transition-colors focus:border-[#2563EB]"
            />
          </div>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border-2 border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:shadow-blue-500/20 disabled:opacity-60"
            >
              {loading ? "Oluşturuluyor…" : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
