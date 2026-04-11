import { Inter, JetBrains_Mono } from "next/font/google";
import { AdminDemoProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-admin-mono-local",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} ${jetBrainsMono.variable}`}>
      <AdminDemoProvider>
        <AdminShell>{children}</AdminShell>
      </AdminDemoProvider>
    </div>
  );
}
