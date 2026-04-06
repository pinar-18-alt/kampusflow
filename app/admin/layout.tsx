import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminNavbar } from "./AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNavbar />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
