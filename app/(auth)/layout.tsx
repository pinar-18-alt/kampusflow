import { KampusFlowMark } from "@/app/components/KampusFlowMark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F5F2] via-white to-[#E0F5F2] px-4 py-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8">
            <KampusFlowMark />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
