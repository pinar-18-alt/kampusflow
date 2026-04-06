"use client";

import { useState } from "react";
import { CreateEventModal } from "./CreateEventModal";

export function EventsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:shadow-blue-500/20"
      >
        Yeni Etkinlik Oluştur
      </button>
      <CreateEventModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
