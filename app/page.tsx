"use client";

import { FormEvent, useState } from "react";
import { trpc } from "@/trpc/client";
import { BlobBackground } from "@/components/BlobBackground";

// SVG иконки
const IconUser = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconClipboard = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconCreditCard = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconBook = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconLock = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconChat = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const IconBackpack = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconGraduation = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M4.239 9.5a12.021 12.021 0 003.666 4.5M19.761 9.5a12.021 12.021 0 01-3.666 4.5" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconPerson = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

type QuizState = {
  name: string;
  phone: string;
  grade: string;
  subject: string;
  goal: string;
  frequency: string;
  timeSlots: string[];
  style: string;
  comment: string;
};

const TOTAL_STEPS = 7;

export default function Home() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [quiz, setQuiz] = useState<QuizState>({
    name: "",
    phone: "",
    grade: "",
    subject: "",
    goal: "",
    frequency: "",
    timeSlots: [],
    style: "",
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);

  const submitQuizMutation = trpc.submitQuiz.useMutation();

  const openQuiz = () => {
    setIsQuizOpen(true);
    setError(null);
    setStep(1);
    submitQuizMutation.reset();
  };

  const closeQuiz = () => {
    if (submitQuizMutation.isPending) return;
    setIsQuizOpen(false);
  };

  const toggleTimeSlot = (value: string) => {
    setQuiz((prev) => {
      const exists = prev.timeSlots.includes(value);
      return {
        ...prev,
        timeSlots: exists
          ? prev.timeSlots.filter((v) => v !== value)
          : [...prev.timeSlots, value],
      };
    });
  };

  const handleOptionSelect = (field: "grade" | "subject", value: string) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
    // Автоматически переходим на следующий шаг
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 300);
  };

  const handleRadioSelect = (field: "goal" | "frequency" | "style", value: string) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
    // Автоматически переходим на следующий шаг
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 300);
  };

  const formatPhoneNumber = (value: string) => {
    // Убираем все нецифровые символы
    const numbers = value.replace(/\D/g, "");
    
    // Если начинается с 7 или 8, убираем первую цифру
    let cleanNumbers = numbers;
    if (numbers.startsWith("7") || numbers.startsWith("8")) {
      cleanNumbers = numbers.slice(1);
    }
    
    if (cleanNumbers.length === 0) return "";
    if (cleanNumbers.length <= 3) return `+7 (${cleanNumbers}`;
    if (cleanNumbers.length <= 6) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    if (cleanNumbers.length <= 8) return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
    return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 8)}-${cleanNumbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setQuiz((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Шаговая валидация
    if (step === 1 && !quiz.grade) {
      setError("Пожалуйста, выберите класс ребёнка.");
      return;
    }

    if (step === 2 && !quiz.subject) {
      setError("Пожалуйста, выберите предмет.");
      return;
    }

    if (step === 7) {
      if (!quiz.name.trim()) {
        setError("Пожалуйста, укажите ваше имя.");
        return;
      }
      if (!quiz.phone.trim()) {
        setError("Пожалуйста, укажите номер телефона.");
        return;
      }

      submitQuizMutation.mutate(quiz, {
        onSuccess: () => {
          // При желании можно закрывать модалку:
          // setIsQuizOpen(false);
        },
        onError: (err) => {
          setError(err.message || "Что-то пошло не так. Попробуйте позже.");
        },
      });

      return;
    }

    // Промежуточные шаги — просто двигаемся дальше
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  const isLoading = submitQuizMutation.isPending;
  const isSuccess = submitQuizMutation.isSuccess;
  const isSubmitDisabled = isLoading;

  return (
    <div className="min-h-screen text-slate-900 bg-white relative">
      <BlobBackground />
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm relative z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a href="#top" className="flex items-center gap-2.5 transition-all hover:opacity-80 group">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-110"
            >
              {/* Открытая книга */}
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
              {/* Галочка понимания */}
              <path
                d="M12 16L14.5 18.5L20 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />
              <defs>
                <linearGradient id="bookGradient1" x1="6" y1="6" x2="18" y2="26" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="bookGradient2" x1="14" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600 bg-clip-text text-transparent tracking-tight">
              Понятно
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-sky-500">
              Как это работает
            </a>
            <a href="#advantages" className="transition-colors hover:text-sky-500">
              Преимущества
            </a>
            <a href="#who-for" className="transition-colors hover:text-sky-500">
              Кому подходит
            </a>
            <a href="#tutors" className="transition-colors hover:text-sky-500">
              Преподаватели
            </a>
          </nav>
          <button
            onClick={openQuiz}
            className="hidden rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:scale-105 active:scale-100 md:inline-flex"
          >
            Подобрать репетитора
          </button>
          <button
            onClick={openQuiz}
            className="inline-flex rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-sky-600 hover:to-cyan-600 md:hidden"
          >
            Подбор
          </button>
        </div>
      </header>

      <main id="top" className="relative z-10">
        {/* HERO */}
        <section className="relative">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:gap-10 md:py-24">
            <div className="flex-1 animate-fade-in">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
                Репетиторы для 5–11 классов
              </span>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Подберите "своего" онлайн-репетитора для ребёнка 5–11 класса за{" "}
                <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                  2 минуты
                </span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl">
                Ответьте на 5–7 вопросов — сервис подберёт онлайн-репетитора по
                предмету, цели обучения и характеру ребёнка. Пробный урок уже на
                этой неделе.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <button
                  onClick={openQuiz}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-105 active:scale-100 md:w-auto"
                >
                  Подобрать репетитора
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <p className="text-sm text-slate-500">
                  Это бесплатно и ни к чему не обязывает.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Онлайн-занятия</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Понятная стоимость</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Безопасная оплата</span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 md:items-center md:gap-6">
              {/* SVG-иллюстрация */}
              <div className="w-full max-w-sm rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium animate-slide-up border border-blue-100/50">
                <svg
                  viewBox="0 0 160 110"
                  className="h-auto w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="12"
                    y="20"
                    width="136"
                    height="70"
                    rx="10"
                    fill="#dbeafe"
                  />
                  <rect
                    x="22"
                    y="30"
                    width="70"
                    height="38"
                    rx="6"
                    fill="url(#gradient1)"
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="100"
                    y="30"
                    width="35"
                    height="8"
                    rx="4"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <rect
                    x="100"
                    y="44"
                    width="35"
                    height="8"
                    rx="4"
                    fill="#ffffff"
                    opacity="0.6"
                  />
                  <rect
                    x="100"
                    y="58"
                    width="28"
                    height="8"
                    rx="4"
                    fill="#ffffff"
                    opacity="0.4"
                  />
                  {/* Ребёнок */}
                  <circle cx="40" cy="50" r="10" fill="#f97316" />
                  <rect
                    x="32"
                    y="60"
                    width="16"
                    height="12"
                    rx="4"
                    fill="#fbbf24"
                  />
                  {/* Репетитор */}
                  <circle cx="70" cy="50" r="10" fill="#34d399" />
                  <rect
                    x="62"
                    y="60"
                    width="16"
                    height="12"
                    rx="4"
                    fill="#22c55e"
                  />
                  {/* Нижняя планка ноутбука */}
                  <rect
                    x="40"
                    y="92"
                    width="80"
                    height="8"
                    rx="4"
                    fill="#cbd5f5"
                  />
                </svg>
              </div>
              <div className="w-full max-w-sm rounded-3xl bg-white p-4 md:p-5 shadow-soft transition-all hover:shadow-medium border border-blue-100/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Подбор репетитора
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      2 минуты на ответы — и вы получаете список из 8–12 подходящих
                      преподавателей с ценами и свободными слотами.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section id="how-it-works" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Как работает сервис подбора репетитора
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Простой процесс из 5 шагов
              </p>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 min-w-max md:min-w-0">
              {[
                {
                  title: "Квиз за 2 минуты",
                  text: "Указываете класс, предмет, цель и удобное время — всё онлайн.",
                },
                {
                  title: "Подбор 8–12 репетиторов",
                  text: "Смотрим опыт, стиль объяснения, отзывы и расписание преподавателей.",
                },
                {
                  title: "Выбор преподавателя",
                  text: "Сразу видите цену, описание, отзывы и свободные слоты.",
                },
                {
                  title: "Пробный урок",
                  text: "Проверяете, как ребёнку с репетитором, и оцениваете уровень.",
                },
                {
                  title: "Регулярные занятия",
                  text: "Онлайн-уроки, гибкий график, удобные отмены и оплата только за проведённые занятия.",
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="group flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto"
                >
                  <div className="mb-2 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-sm md:text-base font-bold text-white shadow-md shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">{step.title}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-3 md:line-clamp-none">{step.text}</p>
                </div>
              ))}
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-500 p-5 md:p-6 text-white shadow-large md:flex-row md:items-center md:p-8">
              <div>
                <p className="text-lg font-semibold">
                  Готовы начать подбор? Это займёт пару минут.
                </p>
                <p className="mt-1 text-sm text-blue-100">
                  Бесплатно и без обязательств
                </p>
              </div>
              <button
                onClick={openQuiz}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-100"
              >
                Подобрать репетитора
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА */}
        <section id="advantages" className="py-12 md:py-24 relative">
          {/* Декоративный разделитель */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <span className="inline-block mb-3 md:mb-4 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs md:text-sm font-semibold">
                Почему выбирают нас
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-4xl">
                Преимущества нашего сервиса
              </h2>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-6 min-w-max md:min-w-0">
              {[
                {
                  title: "Преподаватель под характер ребёнка",
                  text: "Спокойный, строгий, быстрый темп, больше практики или объяснений — подбираем формат, в котором ребёнку комфортно.",
                  accent: true,
                  icon: "👤",
                  cta: true,
                },
                {
                  title: "Проверенные репетиторы",
                  text: "Проверяем образование, опыт и качество уроков у каждого преподавателя.",
                  icon: "✓",
                },
                {
                  title: "Точный подбор под цель",
                  text: "Квиз → 8–12 подходящих специалистов вместо хаотичного поиска по объявлениям.",
                  icon: "🎯",
                },
                {
                  title: "Прозрачные профили",
                  text: "Сразу видно цену, опыт, отзывы и доступное расписание, без бесконечных переписок.",
                  icon: "📋",
                },
                {
                  title: "Онлайн-доска и конспекты",
                  text: "Занятия проходят онлайн, после каждого урока остаётся конспект.",
                  icon: "📝",
                },
                {
                  title: "Оплата внутри сервиса",
                  text: "Без переводов на карту и путаницы — все оплаты в одном месте.",
                  icon: "💳",
                },
                {
                  title: "Контроль прогресса",
                  text: "Личный кабинет родителя и еженедельная сводка в WhatsApp.",
                  icon: "📊",
                },
                {
                  title: "Удобные отмены и замена репетитора",
                  text: "Если формат не подошёл — подберём другого, будущие оплаты сохраняются.",
                  icon: "🔄",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`group flex flex-col rounded-3xl p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto ${
                    item.accent
                      ? "border-2 border-blue-300 bg-blue-50/60"
                      : "bg-white"
                  }`}
                >
                  <div className="mb-2 md:mb-3 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shrink-0">
                    {item.icon === "👤" && <IconUser />}
                    {item.icon === "✓" && <IconCheck />}
                    {item.icon === "🎯" && <IconTarget />}
                    {item.icon === "📋" && <IconClipboard />}
                    {item.icon === "📝" && <IconDocument />}
                    {item.icon === "💳" && <IconCreditCard />}
                    {item.icon === "📊" && <IconChart />}
                    {item.icon === "🔄" && <IconRefresh />}
                    {item.icon === "📚" && <IconBook />}
                    {item.icon === "📅" && <IconCalendar />}
                    {item.icon === "🔒" && <IconLock />}
                    {item.icon === "💬" && <IconChat />}
                    {item.icon === "🎒" && <IconBackpack />}
                    {item.icon === "🎓" && <IconGraduation />}
                    {item.icon === "👨‍👩‍👧" && <IconUsers />}
                    {item.icon === "✅" && <IconCheck />}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-3 md:line-clamp-none">{item.text}</p>
                  {item.cta && (
                    <button
                      onClick={openQuiz}
                      className="mt-auto pt-2 md:pt-4 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold text-white shadow-md transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:scale-105 active:scale-100"
                    >
                      Подобрать репетитора
                    </button>
                  )}
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ОТЛИЧИЯ ОТ ОНЛАЙН-ШКОЛ */}
        <section id="vs-schools" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Чем формат занятий с репетитором отличается от онлайн-школ
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Индивидуальный подход против групповых занятий
              </p>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-6 min-w-max md:min-w-0">
              {[
                {
                  title: "Только индивидуальные уроки",
                  text: "Преподаватель работает с одним ребёнком, а не с потоком.",
                  icon: "👤",
                  color: "from-sky-500 to-cyan-500",
                },
                {
                  title: "Программа под ребёнка",
                  text: "Можно менять темп и акценты по ходу года, а не идти по жёсткому курсу.",
                  icon: "📚",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Гибкий график",
                  text: "Вы выбираете удобное время и переносите занятия при необходимости.",
                  icon: "📅",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  title: "Оплата за уроки, а не за пакеты",
                  text: "Никаких подписок и обязательных пакетов на месяц вперёд.",
                  icon: "💳",
                  color: "from-orange-500 to-red-500",
                },
                {
                  title: "Прямой контакт с преподавателем",
                  text: "Все вопросы по учёбе обсуждаются сразу с репетитором, без «прослоек».",
                  icon: "💬",
                  color: "from-indigo-500 to-purple-500",
                },
                {
                  title: "Живой отчёт по прогрессу",
                  text: "Виден реальный материал и темы, а не формальный отчёт раз в месяц.",
                  icon: "📊",
                  color: "from-cyan-500 to-blue-500",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 border border-slate-100 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto"
                >
                  <div className={`mb-2 md:mb-4 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform group-hover:scale-110 shrink-0`}>
                    {item.icon === "👤" && <IconUser />}
                    {item.icon === "📚" && <IconBook />}
                    {item.icon === "📅" && <IconCalendar />}
                    {item.icon === "💳" && <IconCreditCard />}
                    {item.icon === "💬" && <IconChat />}
                    {item.icon === "📊" && <IconChart />}
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-slate-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-3 md:line-clamp-none">{item.text}</p>
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ФОРМАТ И ПРЕДМЕТЫ */}
        <section id="formats" className="py-12 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:gap-10 px-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 md:p-8 shadow-soft border border-blue-100/50">
              <h2 className="text-xl font-extrabold text-slate-900 md:text-3xl">
                Формат онлайн-занятий с репетиторами
              </h2>
              <ul className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-sm md:text-base text-slate-700">
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-sky-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Индивидуальные онлайн-уроки 45–60 минут.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-sky-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Интенсивы перед контрольными и экзаменами.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-sky-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Диагностика и план на 4–8 недель.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-5 md:p-8 shadow-soft border border-blue-100/50">
              <h2 className="text-xl font-extrabold text-slate-900 md:text-3xl">
                Предметы, по которым можно подобрать онлайн-репетитора
              </h2>
              <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
                {[
                  "Математика",
                  "Русский",
                  "Английский",
                  "Физика",
                  "Химия",
                  "Биология",
                  "Информатика",
                  "ОГЭ / ЕГЭ",
                ].map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-sm transition-all hover:shadow-md hover:scale-105"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* КОМУ ПОДХОДИТ */}
        <section id="who-for" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Кому подойдёт сервис подбора репетитора для 5–11 классов
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Для каждого возраста и цели найдётся подходящий формат
              </p>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-6 min-w-max md:min-w-0">
              {[
                {
                  title: "Ученикам 5–8 классов",
                  text: "Нужно подтянуть предмет и снизить стресс с домашкой.",
                  icon: "🎒",
                  color: "from-blue-500 to-indigo-500",
                  badge: "Средняя школа",
                },
                {
                  title: "Девятиклассникам",
                  text: "Подготовка к ОГЭ и закрытие пробелов перед старшей школой.",
                  icon: "📝",
                  color: "from-orange-500 to-amber-500",
                  badge: "ОГЭ",
                },
                {
                  title: "10–11 класс",
                  text: "Подготовка к ЕГЭ под целевые баллы и поступление.",
                  icon: "🎓",
                  color: "from-purple-500 to-pink-500",
                  badge: "ЕГЭ",
                },
                {
                  title: "Родителям, которым важен контроль",
                  text: "Хочется понимать, что происходит на уроках и как идёт прогресс.",
                  icon: "👨‍👩‍👧",
                  color: "from-emerald-500 to-teal-500",
                  badge: "Контроль",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 border border-slate-100 overflow-hidden min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full opacity-50"></div>
                  <div className={`mb-2 md:mb-4 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform group-hover:scale-110 relative z-10 mx-auto md:mx-0 shrink-0`}>
                    {item.icon === "🎒" && <IconBackpack />}
                    {item.icon === "📝" && <IconDocument />}
                    {item.icon === "🎓" && <IconGraduation />}
                    {item.icon === "👨‍👩‍👧" && <IconUsers />}
                  </div>
                  <span className={`inline-block mb-1.5 md:mb-2 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.color} text-white w-fit relative z-10 mx-auto md:mx-0`}>
                    {item.badge}
                  </span>
                  <h3 className="text-sm md:text-lg font-bold text-slate-900 relative z-10 text-center md:text-left line-clamp-2">{item.title}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 relative z-10 text-center md:text-left line-clamp-3 md:line-clamp-none">{item.text}</p>
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ПОЧЕМУ УДОБНО И ВЫГОДНО */}
        <section id="benefits" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Почему заниматься с репетитором удобно и выгодно
              </h2>
            </div>
            <div className="mt-6 md:mt-10 grid gap-6 md:gap-8 md:grid-cols-2">
              <div className="md:col-span-2 flex justify-center mb-4 md:mb-0">
                <button
                  onClick={openQuiz}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-105 active:scale-100"
                >
                  Начать подбор репетитора
                  <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-700">
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Экономия времени — подбор занимает несколько минут.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Быстрый старт — часто можно начать уже в течение 1 дня с подходящим репетитором.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Оплата внутри сервиса — без переводов на карту.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Только нужные уроки — оплачиваются только проведённые занятия.</span>
                </li>
              </ul>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-700">
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Контроль прогресса — личный кабинет + сводка в WhatsApp по онлайн-занятиям.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Конспекты после каждого урока — удобно повторять материал с репетитором.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Замена преподавателя без потерь по будущим урокам.</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <svg className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Пробный урок — можно "проверить химию" без долгих обязательств.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ИСТОРИИ СЕМЕЙ */}
        <section id="stories" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Истории семей, которые нашли репетитора через сервис
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Реальные результаты наших учеников
              </p>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 min-w-max md:min-w-0">
              {/* 1 */}
              <div className="flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 border border-blue-100/50 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto">
                <div className="mb-2 md:mb-4 h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 p-2 md:p-3 shadow-md shrink-0">
                  <svg
                    viewBox="0 0 64 64"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="8"
                      y="10"
                      width="48"
                      height="36"
                      rx="6"
                      fill="#ffffff"
                      opacity="0.2"
                    />
                    <polyline
                      points="14,32 26,24 36,30 50,20"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="14"
                      y1="40"
                      x2="26"
                      y2="40"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">
                  Репетитор по математике, 6 класс
                </h3>
                <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-4 md:line-clamp-none">
                  Было: 3 и слёзы над ДЗ. <br />
                  Стало: стабильные 4–5 после занятий с репетитором по
                  математике.
                </p>
              </div>
              {/* 2 */}
              <div className="flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 border border-blue-100/50 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto">
                <div className="mb-2 md:mb-4 h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 md:p-3 shadow-md shrink-0">
                  <svg
                    viewBox="0 0 64 64"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="10"
                      y="14"
                      width="44"
                      height="30"
                      rx="4"
                      fill="#ffffff"
                      opacity="0.2"
                    />
                    <rect
                      x="14"
                      y="18"
                      width="20"
                      height="4"
                      rx="2"
                      fill="#ffffff"
                    />
                    <rect
                      x="14"
                      y="26"
                      width="26"
                      height="3"
                      rx="1.5"
                      fill="#ffffff"
                      opacity="0.7"
                    />
                    <rect
                      x="14"
                      y="32"
                      width="18"
                      height="3"
                      rx="1.5"
                      fill="#ffffff"
                      opacity="0.5"
                    />
                    <circle cx="44" cy="32" r="6" fill="#ffffff" />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">
                  Репетитор по русскому языку, 9 класс (ОГЭ)
                </h3>
                <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-4 md:line-clamp-none">
                  Было: 17 баллов на диагностике. <br />
                  Стало: 27–29 баллов на пробниках после занятий с репетитором
                  по русскому.
                </p>
              </div>
              {/* 3 */}
              <div className="flex flex-col rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto">
                <div className="mb-2 md:mb-4 h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 md:p-3 shadow-md shrink-0">
                  <svg
                    viewBox="0 0 64 64"
                    className="h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="8"
                      y="12"
                      width="48"
                      height="34"
                      rx="6"
                      fill="#ffffff"
                      opacity="0.2"
                    />
                    <polyline
                      points="14,38 26,30 34,34 50,24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="14"
                      y1="20"
                      x2="24"
                      y2="20"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 line-clamp-2">
                  Профильная математика, 11 класс — репетитор
                </h3>
                <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 line-clamp-4 md:line-clamp-none">
                  Было: 48 баллов. <br />
                  Стало: 70+ после регулярных занятий с репетитором по
                  профильной математике.
                </p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* НАШИ ПРЕПОДАВАТЕЛИ */}
        <section id="tutors" className="py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Наши репетиторы
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Проверенные специалисты с опытом работы
              </p>
            </div>
            <div className="mt-6 md:mt-10 relative -mx-4 md:mx-0">
              {/* Индикатор прокрутки справа на мобильных */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
              <div className="overflow-x-auto px-4 md:px-0 pb-2 md:pb-0">
                <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 min-w-max md:min-w-0">
              {[
                {
                  name: "Мария, математика",
                  meta: "Репетитор по математике, 10 лет опыта, готовит к ОГЭ и ЕГЭ",
                  gradient: "from-sky-500 to-cyan-500",
                },
                {
                  name: "Алексей, русский",
                  meta: "Репетитор по русскому языку, 8 лет опыта, эксперт по сочинениям",
                  gradient: "from-orange-500 to-red-500",
                },
                {
                  name: "Екатерина, английский",
                  meta: "Репетитор по английскому, 7 лет опыта, разговорная практика",
                  gradient: "from-emerald-500 to-teal-600",
                },
              ].map((tutor) => (
                <div
                  key={tutor.name}
                  className="flex flex-col rounded-3xl bg-white p-4 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 min-w-[280px] max-w-[280px] md:min-w-0 md:max-w-none aspect-square md:aspect-auto"
                >
                  <div
                    className={`mb-2 md:mb-4 flex h-12 w-12 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${tutor.gradient} shadow-md text-white mx-auto md:mx-0 shrink-0`}
                  >
                    <IconPerson className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 text-center md:text-left line-clamp-2">{tutor.name}</h3>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm leading-relaxed text-slate-600 text-center md:text-left line-clamp-3 md:line-clamp-none">{tutor.meta}</p>
                </div>
              ))}
                </div>
              </div>
            </div>
            <p className="mt-6 md:mt-8 text-center text-sm text-slate-600">
              На платформе — десятки проверенных онлайн-репетиторов по школьным
              предметам и подготовке к экзаменам.
            </p>
          </div>
        </section>

        {/* БЕЗОПАСНОСТЬ */}
        <section id="safety" className="py-12 md:py-24 bg-gradient-to-b from-white via-sky-50/30 to-sky-100/50">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
                Безопасность и качество
              </h2>
              <p className="mt-2 md:mt-3 text-base md:text-lg text-slate-600">
                Ваша уверенность — наш приоритет
              </p>
            </div>
            <div className="mt-6 md:mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Проверка преподавателей",
                  text: "Документы, опыт и тестовые уроки — перед стартом работы на платформе.",
                  icon: "✅",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  title: "Безопасная оплата",
                  text: "Все платежи проходят внутри сервиса, без личных переводов.",
                  icon: "🔒",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  title: "Материалы и история занятий",
                  text: "Конспекты и пройденные темы с репетитором всегда доступны в личном кабинете.",
                  icon: "📚",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Понятные правила отмены",
                  text: "Если предупредить заранее, урок переносится без потерь.",
                  icon: "🔄",
                  color: "from-orange-500 to-amber-500",
                },
                {
                  title: "Поддержка сервиса",
                  text: "Поможем, если возник вопрос с уроком, оплатой или расписанием.",
                  icon: "💬",
                  color: "from-cyan-500 to-sky-500",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col rounded-3xl bg-white p-5 md:p-6 shadow-soft transition-all hover:shadow-medium hover:-translate-y-1 border border-slate-100"
                >
                  <div className={`mb-3 md:mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform group-hover:scale-110 mx-auto md:mx-0`}>
                    {item.icon === "✅" && <IconCheck />}
                    {item.icon === "🔒" && <IconLock />}
                    {item.icon === "📚" && <IconBook />}
                    {item.icon === "🔄" && <IconRefresh />}
                    {item.icon === "💬" && <IconChat />}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 text-center md:text-left">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 text-center md:text-left">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ДЛЯ РЕПЕТИТОРОВ */}
        <section
          id="for-tutors"
          className="border-t border-slate-200 py-8"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between">
            <p className="text-base font-medium text-slate-700">
              Вы репетитор и хотите вести учеников 5–11 классов по
              школьным предметам и подготовке к ОГЭ и ЕГЭ через платформу?
            </p>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg hover:scale-105 active:scale-100">
              Стать репетитором
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>

        {/* ФИНАЛЬНЫЙ CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/50 via-sky-200/60 to-sky-400 py-12 md:py-24">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">
              Начните подбор репетитора для школьника уже сегодня
            </h2>
            <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-slate-700">
              Ответьте на 5–7 вопросов — мы подберём 8–12 подходящих
              репетиторов по нужным предметам. Пробный урок уже на
              этой неделе.
            </p>
            <button
              onClick={openQuiz}
              className="group mt-6 md:mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-white shadow-xl shadow-sky-500/30 transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-2xl hover:shadow-sky-500/40 hover:scale-105 active:scale-100"
            >
              Подобрать репетитора
              <svg className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            {/* О сервисе */}
            <div>
              <h3 className="text-white font-bold mb-4">О сервисе</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Как это работает</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Отзывы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
              </ul>
            </div>

            {/* Для родителей */}
            <div>
              <h3 className="text-white font-bold mb-4">Для родителей</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Подобрать репетитора</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Предметы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Цены</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Вопросы и ответы</a></li>
              </ul>
            </div>

            {/* Для репетиторов */}
            <div>
              <h3 className="text-white font-bold mb-4">Для репетиторов</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Стать репетитором</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Как начать</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Условия работы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
              </ul>
            </div>

            {/* Контакты и правовая информация */}
            <div>
              <h3 className="text-white font-bold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Оферта</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Понятно. Все права защищены.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Telegram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.17 1.858-.9 6.654-1.27 8.835-.15.89-.443 1.186-.728 1.214-.612.056-1.075-.403-1.667-.79-.924-.61-1.448-.989-2.345-1.584-1.037-.7-.365-1.085.226-1.714.155-.162 2.84-2.604 2.897-2.826.006-.027.011-.125-.047-.185-.058-.06-.144-.04-.207-.024-.088.02-1.494.95-4.216 2.788-.399.27-.76.401-1.085.394-.357-.008-1.043-.201-1.553-.366-.627-.204-1.125-.312-1.082-.658.022-.18.33-.364.908-.552 3.58-1.54 5.97-2.56 7.17-3.06 3.38-1.42 4.08-1.67 4.54-1.68.1 0 .33.024.478.144.12.1.153.234.169.328.016.094.036.308.02.476z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* POPUP КВИЗ */}
      {isQuizOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in"
          onClick={closeQuiz}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-large animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeQuiz}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              aria-label="Закрыть квиз"
            >
              ×
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Подбор онлайн-репетитора</h2>
              <p className="mt-2 text-base text-slate-600">
                Короткий опрос из нескольких шагов. На основе ответов мы подберём
                подходящего онлайн-репетитора по предмету, цели и расписанию.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {step}/{TOTAL_STEPS}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Класс */}
              {step === 1 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Класс ребёнка
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: "5 класс", label: "5 класс" },
                      { value: "6 класс", label: "6 класс" },
                      { value: "7 класс", label: "7 класс" },
                      { value: "8 класс", label: "8 класс" },
                      { value: "9 класс", label: "9 класс" },
                      { value: "10 класс", label: "10 класс" },
                      { value: "11 класс", label: "11 класс" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleOptionSelect("grade", opt.value)}
                        className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                          quiz.grade === opt.value
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Предмет */}
              {step === 2 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    По какому предмету нужен репетитор?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: "Математика", label: "Математика" },
                      { value: "Русский язык", label: "Русский язык" },
                      { value: "Английский язык", label: "Английский язык" },
                      { value: "Физика", label: "Физика" },
                      { value: "Химия", label: "Химия" },
                      { value: "Биология", label: "Биология" },
                      { value: "Информатика", label: "Информатика" },
                      { value: "Другое", label: "Другое" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleOptionSelect("subject", opt.value)}
                        className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                          quiz.subject === opt.value
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Цель */}
              {step === 3 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Цель занятий
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: "grades", label: "Подтянуть текущие оценки" },
                      { value: "exam", label: "Подготовка к ОГЭ / ЕГЭ" },
                      { value: "gaps", label: "Закрыть пробелы по теме" },
                      { value: "other", label: "Другое" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                          quiz.goal === opt.value
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={opt.value}
                          checked={quiz.goal === opt.value}
                          onChange={(e) => handleRadioSelect("goal", e.target.value)}
                          className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Частота */}
              {step === 4 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Формат и частота занятий
                  </p>
                  <div className="grid gap-3">
                    {[
                      { value: "1w", label: "1 раз в неделю" },
                      { value: "2w", label: "2 раза в неделю" },
                      {
                        value: "intensive",
                        label: "Интенсив перед экзаменом",
                      },
                      {
                        value: "not-sure",
                        label: "Пока не знаю, нужна рекомендация",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                          quiz.frequency === opt.value
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={opt.value}
                          checked={quiz.frequency === opt.value}
                          onChange={(e) => handleRadioSelect("frequency", e.target.value)}
                          className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Время */}
              {step === 5 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Удобное время для занятий
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: "weekday-day", label: "Будни днём" },
                      { value: "weekday-evening", label: "Будни вечером" },
                      { value: "weekend", label: "Выходные" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                          quiz.timeSlots.includes(opt.value)
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={quiz.timeSlots.includes(opt.value)}
                          onChange={() => toggleTimeSlot(opt.value)}
                          className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Стиль препода */}
              {step === 6 && (
                <div>
                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Предпочтительный стиль преподавателя
                  </p>
                  <div className="grid gap-3">
                    {[
                      { value: "calm", label: "Спокойный, терпеливый" },
                      { value: "strict", label: "Более строгий, с контролем" },
                      {
                        value: "fast",
                        label: "Быстрый темп, много практики",
                      },
                      {
                        value: "dont-know",
                        label: "Пока не знаю, подберите по ребёнку",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                          quiz.style === opt.value
                            ? "border-sky-500 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="style"
                          value={opt.value}
                          checked={quiz.style === opt.value}
                          onChange={(e) => handleRadioSelect("style", e.target.value)}
                          className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Контакты + комментарий */}
              {step === 7 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-bold text-slate-900"
                      >
                        Ваше имя
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={quiz.name}
                        onChange={(e) =>
                          setQuiz((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                        placeholder="Например, Наталья"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-3 block text-sm font-bold text-slate-900"
                      >
                        Телефон для связи
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={quiz.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => {
                          // Разрешаем только цифры, Backspace, Delete, Tab, Arrow keys
                          if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                        placeholder="+7 (___) ___-__-__"
                        maxLength={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="mb-3 block text-sm font-bold text-slate-900"
                    >
                      Коротко опишите ситуацию (по желанию)
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={quiz.comment}
                      onChange={(e) =>
                        setQuiz((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Например: «ребёнок боится контрольных по математике, оценка 3–4, хотим выйти на стабильные 4–5»"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none"
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {isSuccess && !error && (
                <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4">
                  <p className="text-sm font-medium text-emerald-800">
                    Заявка отправлена. Мы свяжемся с вами после обработки ответа в
                    Telegram-боте.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-slate-200">
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Назад
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg transition-all ${
                      isSubmitDisabled
                        ? "cursor-not-allowed bg-blue-300"
                        : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
                    }`}
                  >
                    {step === TOTAL_STEPS
                      ? isLoading
                        ? "Отправляем..."
                        : "Оставить заявку"
                      : "Далее"}
                    {step < TOTAL_STEPS && (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Контакты нужны только для связи по подбору. Никакого спама.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
