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
      <body className={inter.className}>
        <header className="site-header">
          <div className="container header-inner">
            <a href="#top" className="logo">
              Репетитор<span>Онлайн</span>
            </a>
            <nav className="nav">
              <a href="#how-it-works" className="nav-link">
                Как это работает
              </a>
              <a href="#advantages" className="nav-link">
                Преимущества
              </a>
              <a href="#who-for" className="nav-link">
                Кому подходит
              </a>
              <a href="#tutors" className="nav-link">
                Преподаватели
              </a>
            </nav>
            <a href="/quiz" className="button button-primary header-cta">
              Подобрать репетитора
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
