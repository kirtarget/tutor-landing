// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/trpc/Provider";

export const metadata: Metadata = {
  title: "Понятно — Подбор репетиторов для 5–11 классов",
  description:
    "Подбор репетитора для школьников 5–11 классов: математика, русский, английский и другие предметы. Пробный урок уже на этой неделе.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen text-slate-900">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
