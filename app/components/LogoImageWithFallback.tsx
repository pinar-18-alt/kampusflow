"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Tailwind classes for the <img> (e.g. w-6 h-6 object-contain rounded) */
  imgClassName: string;
  /** Tailwind size/layout classes for the fallback box (should match visual footprint) */
  fallbackClassName: string;
  fallbackText?: string;
};

export function LogoImageWithFallback({
  src,
  alt,
  imgClassName,
  fallbackClassName,
  fallbackText = "UY",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-[#00A693] font-bold text-white ${fallbackClassName}`}
        aria-hidden
      >
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- public path + onError fallback
    <img
      src={src}
      alt={alt}
      className={imgClassName}
      onError={() => setFailed(true)}
    />
  );
}
