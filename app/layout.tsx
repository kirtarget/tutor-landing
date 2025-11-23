import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title:
    "Онлайн-репетиторы для школьников 5–11 классов | Подбор репетитора по предметам",
  description:
    "Сервис подбора онлайн-репетиторов для школьников 5–11 классов. Найдите репетитора по математике, русскому, английскому и другим предметам для ОГЭ и ЕГЭ. Пробный урок, прозрачные цены, контроль прогресса и удобный личный кабинет родителя.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
