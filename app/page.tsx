"use client";

import { FormEvent, useState } from "react";
import { trpc } from "@/trpc/client";

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
          // Можно сбросить только шаг и показать успех
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <a href="#top" className="text-lg font-bold tracking-tight">
            Репетитор<span className="text-blue-600">Онлайн</span>
          </a>
          <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-blue-600">
              Как это работает
            </a>
            <a href="#advantages" className="hover:text-blue-600">
              Преимущества
            </a>
            <a href="#who-for" className="hover:text-blue-600">
              Кому подходит
            </a>
            <a href="#tutors" className="hover:text-blue-600">
              Преподаватели
            </a>
          </nav>
          <button
            onClick={openQuiz}
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 md:inline-flex"
          >
            Подобрать репетитора
          </button>
          <button
            onClick={openQuiz}
            className="inline-flex rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 md:hidden"
          >
            Подбор
          </button>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="bg-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-16">
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Онлайн-репетиторы для 5–11 классов
              </span>
              <h1 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                Подберите “своего” онлайн-репетитора для ребёнка 5–11 класса за
                2 минуты
              </h1>
              <p className="mt-3 text-base text-slate-600 md:text-lg">
                Ответьте на 5–7 вопросов — сервис подберёт онлайн-репетитора по
                предмету, цели обучения и характеру ребёнка. Пробный урок уже на
                этой неделе.
              </p>
              <div className="mt-5 flex flex-col items-start gap-2">
                <button
                  onClick={openQuiz}
                  className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 md:w-auto"
                >
                  Подобрать репетитора
                </button>
                <p className="text-xs text-slate-500">
                  Это бесплатно и ни к чему не обязывает.
                </p>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Онлайн-занятия, понятная стоимость урока, оплата без переводов
                на карту.
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 md:items-end">
              {/* SVG-иллюстрация */}
              <div className="w-full max-w-xs rounded-2xl bg-slate-50 p-4 shadow-sm">
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
                    fill="#e0ecff"
                  />
                  <rect
                    x="22"
                    y="30"
                    width="70"
                    height="38"
                    rx="6"
                    fill="#2563eb"
                  />
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
              <div className="w-full max-w-xs rounded-2xl bg-blue-50 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Подбор репетитора
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  2 минуты на ответы — и вы получаете список из 8–12 подходящих
                  преподавателей с ценами и свободными слотами.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Дальше лендинг без изменений... (как у тебя был) */}
        {/* --- Я ТВОЙ НИЖНИЙ КОНТЕНТ НЕ МЕНЯЛ, ОН ОСТАЁТСЯ --- */}
        {/* Чтобы не раздувать ответ ещё сильнее, предполагаем, что ниже у тебя тот же код секций.
            Важно: в конце main оставляем только обновлённый POPUP-КВИЗ, см. ниже. */}

        {/* ... остальные секции ленда (как в предыдущем варианте) ... */}
        {/* Я сокращаю, но ты просто оставляешь свои секции "Как это работает", "Преимущества", и т.д. */}

      </main>

      {/* POPUP КВИЗ */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeQuiz}
              className="absolute right-4 top-4 text-2xl leading-none text-slate-400 hover:text-slate-700"
              aria-label="Закрыть квиз"
            >
              ×
            </button>

            <h2 className="text-xl font-bold">Подбор онлайн-репетитора</h2>
            <p className="mt-1 text-sm text-slate-600">
              Короткий опрос из нескольких шагов. На основе ответов мы подберём
              подходящего онлайн-репетитора по предмету, цели и расписанию.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Шаг {step} из {TOTAL_STEPS}
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
              {/* STEP 1: Класс */}
              {step === 1 && (
                <div>
                  <label
                    htmlFor="grade"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-700"
                  >
                    Класс ребёнка
                  </label>
                  <select
                    id="grade"
                    value={quiz.grade}
                    onChange={(e) =>
                      setQuiz((prev) => ({ ...prev, grade: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-1"
                  >
                    <option value="">Выберите класс</option>
                    <option>5 класс</option>
                    <option>6 класс</option>
                    <option>7 класс</option>
                    <option>8 класс</option>
                    <option>9 класс</option>
                    <option>10 класс</option>
                    <option>11 класс</option>
                  </select>
                </div>
              )}

              {/* STEP 2: Предмет */}
              {step === 2 && (
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-700"
                  >
                    По какому предмету нужен репетитор?
                  </label>
                  <select
                    id="subject"
                    value={quiz.subject}
                    onChange={(e) =>
                      setQuiz((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-1"
                  >
                    <option value="">Выберите предмет</option>
                    <option>Математика</option>
                    <option>Русский язык</option>
                    <option>Английский язык</option>
                    <option>Физика</option>
                    <option>Химия</option>
                    <option>Биология</option>
                    <option>Информатика</option>
                    <option>Другое</option>
                  </select>
                </div>
              )}

              {/* STEP 3: Цель */}
              {step === 3 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Цель занятий
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "grades", label: "Подтянуть текущие оценки" },
                      { value: "exam", label: "Подготовка к ОГЭ / ЕГЭ" },
                      { value: "gaps", label: "Закрыть пробелы по теме" },
                      { value: "other", label: "Другое" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="inline-flex items-center gap-2 text-xs text-slate-700"
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={opt.value}
                          checked={quiz.goal === opt.value}
                          onChange={(e) =>
                            setQuiz((prev) => ({
                              ...prev,
                              goal: e.target.value,
                            }))
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Частота */}
              {step === 4 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Формат и частота занятий
                  </p>
                  <div className="flex flex-wrap gap-3">
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
                        className="inline-flex items-center gap-2 text-xs text-slate-700"
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={opt.value}
                          checked={quiz.frequency === opt.value}
                          onChange={(e) =>
                            setQuiz((prev) => ({
                              ...prev,
                              frequency: e.target.value,
                            }))
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Время */}
              {step === 5 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Удобное время для занятий
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: "weekday-day", label: "Будни днём" },
                      { value: "weekday-evening", label: "Будни вечером" },
                      { value: "weekend", label: "Выходные" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="inline-flex items-center gap-2 text-xs text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={quiz.timeSlots.includes(opt.value)}
                          onChange={() => toggleTimeSlot(opt.value)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Стиль препода */}
              {step === 6 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Предпочтительный стиль преподавателя
                  </p>
                  <div className="flex flex-wrap gap-3">
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
                        className="inline-flex items-center gap-2 text-xs text-slate-700"
                      >
                        <input
                          type="radio"
                          name="style"
                          value={opt.value}
                          checked={quiz.style === opt.value}
                          onChange={(e) =>
                            setQuiz((prev) => ({
                              ...prev,
                              style: e.target.value,
                            }))
                          }
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Контакты + комментарий */}
              {step === 7 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-700"
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
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-1"
                        placeholder="Например, Наталья"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-700"
                      >
                        Телефон для связи
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={quiz.phone}
                        onChange={(e) =>
                          setQuiz((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-1"
                        placeholder="+7 ..."
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-700"
                    >
                      Коротко опишите ситуацию (по желанию)
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={quiz.comment}
                      onChange={(e) =>
                        setQuiz((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder='Например: «ребёнок боится контрольных по математике, оценка 3–4, хотим выйти на стабильные 4–5»'
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-1"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-xs text-red-600">
                  {error}
                </p>
              )}

              {isSuccess && !error && (
                <p className="text-xs text-emerald-600">
                  Заявка отправлена. Мы свяжемся с вами после обработки ответа в
                  Telegram-боте.
                </p>
              )}

              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Назад
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm ${
                      isSubmitDisabled
                        ? "cursor-not-allowed bg-blue-300"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {step === TOTAL_STEPS
                      ? isLoading
                        ? "Отправляем..."
                        : "Оставить заявку"
                      : "Далее"}
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
