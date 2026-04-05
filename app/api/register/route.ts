import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ULUDAG_SUFFIX = "@uludag.edu.tr";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    const { name, email, password, faculty } = body as Record<string, unknown>;

    const nameStr = typeof name === "string" ? name.trim() : "";
    const emailStr = typeof email === "string" ? email.trim() : "";
    const passwordStr = typeof password === "string" ? password : "";
    const facultyStr = typeof faculty === "string" ? faculty.trim() : "";

    if (!nameStr || !emailStr || !passwordStr || !facultyStr) {
      return NextResponse.json(
        { success: false, message: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const emailLower = emailStr.toLowerCase();
    if (!emailLower.endsWith(ULUDAG_SUFFIX)) {
      return NextResponse.json(
        {
          success: false,
          message: "E-posta adresi @uludag.edu.tr uzantılı olmalıdır.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta adresi zaten kayıtlı." },
        { status: 409 }
      );
    }

    const hashed = await hash(passwordStr, 10);
    await prisma.user.create({
      data: {
        name: nameStr,
        email: emailLower,
        password: hashed,
        faculty: facultyStr,
        role: "user",
      },
    });

    return NextResponse.json({ success: true, message: "Kayıt başarılı" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
