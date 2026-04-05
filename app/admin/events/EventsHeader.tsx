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
        className="rounded-xl bg-[#00A693] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#007A6E]"
      >
        Yeni Etkinlik Oluştur
      </button>
      <CreateEventModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
