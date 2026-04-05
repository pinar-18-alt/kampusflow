import { headers } from "next/headers";

/** Sunucu bileşenlerinde dahili API çağrıları için taban URL */
export function getInternalBaseUrl(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${proto}://${host}`;
}
