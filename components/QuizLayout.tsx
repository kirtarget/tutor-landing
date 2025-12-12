"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface QuizLayoutProps {
  children: React.ReactNode;
}

const steps = [
  { id: "request", label: "Запрос", path: "/quiz/request" },
  { id: "tutor", label: "Репетитор", path: "/quiz/tutor" },
  { id: "checkout", label: "Запись", path: "/quiz/checkout" },
];

export function QuizLayout({ children }: QuizLayoutProps) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="min-h-screen bg-white">
      {/* Хедер */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-all hover:opacity-80 group"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-110"
            >
              <path
                d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V24C18 25.1046 17.1046 26 16 26H8C6.89543 26 6 25.1046 6 24V8Z"
                fill="url(#bookGradient1)"
                className="transition-all group-hover:opacity-90"
              />
              <path
                d="M14 8C14 6.89543 14.8954 6 16 6H24C25.1046 6 26 6.89543 26 8V24C26 25.1046 25.1046 26 24 26H16C14.8954 26 14 25.1046 14 24V8Z"
                fill="url(#bookGradient2)"
                className="transition-all group-hover:opacity-90"
              />
              <path
                d="M12 16L14.5 18.5L20 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
              <defs>
                <linearGradient
                  id="bookGradient1"
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="26"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient
                  id="bookGradient2"
                  x1="14"
                  y1="6"
                  x2="26"
                  y2="26"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 bg-clip-text text-transparent tracking-tight">
              Понятно
            </span>
          </Link>

          {/* Навигация по шагам - десктоп */}
          <nav className="hidden items-center gap-4 text-sm text-slate-700 md:flex">
            {steps.map((step, index) => {
              const isActive = pathname === step.path;
              const isCompleted = index < currentStepIndex;
              const isClickable = index <= currentStepIndex || isCompleted;

              return (
                <Link
                  key={step.id}
                  href={isClickable ? step.path : "#"}
                  onClick={(e) => {
                    if (!isClickable) {
                      e.preventDefault();
                    }
                  }}
                  className={`transition-colors ${
                    isActive
                      ? "font-semibold text-sky-600"
                      : isCompleted
                        ? "text-slate-600 hover:text-sky-500"
                        : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {step.label}
                </Link>
              );
            })}
          </nav>

          {/* Навигация по шагам - мобильная */}
          <nav className="flex items-center gap-3 text-xs text-slate-700 overflow-x-auto md:hidden scrollbar-hide">
            {steps.map((step, index) => {
              const isActive = pathname === step.path;
              const isCompleted = index < currentStepIndex;
              const isClickable = index <= currentStepIndex || isCompleted;

              return (
                <Link
                  key={step.id}
                  href={isClickable ? step.path : "#"}
                  onClick={(e) => {
                    if (!isClickable) {
                      e.preventDefault();
                    }
                  }}
                  className={`whitespace-nowrap transition-colors ${
                    isActive
                      ? "font-semibold text-sky-600"
                      : isCompleted
                        ? "text-slate-600"
                        : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {step.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-sky-500 transition-colors"
          >
            Войти
          </Link>
        </div>

        {/* Прогресс-бар */}
        <div className="h-1 bg-slate-100 relative">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* Контент */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">{children}</main>
    </div>
  );
}
