import { Navbar } from "@/app/components/Navbar";

export default function EventsSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
