import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AdminGate =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminGate> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Giriş yapmanız gerekiyor." },
        { status: 401 }
      ),
    };
  }
  if (session.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Bu işlem için yönetici yetkisi gereklidir." },
        { status: 403 }
      ),
    };
  }
  return { ok: true, userId: session.user.id };
}
