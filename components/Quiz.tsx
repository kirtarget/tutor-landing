"use client";

import { FormEvent, useState, useRef } from "react";
import { trpc } from "@/trpc/client";

// Типы для вопросов
type QuestionType = "select" | "radio" | "checkbox" | "text" | "textarea";

interface QuestionOption {
  value: string;
  label: string;
}

interface QuizQuestion {
  id: number;
  field: keyof QuizState;
  type: QuestionType;
  title: string;
  options?: QuestionOption[];
  placeholder?: string;
  gridCols?: "1" | "2" | "3";
  required?: boolean;
}

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

// Объект с вопросами и ответами - все вопросы в одном месте для удобного редактирования
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    field: "grade",
    type: "select",
    title: "Класс ребёнка",
    options: [
      { value: "5 класс", label: "5 класс" },
      { value: "6 класс", label: "6 класс" },
      { value: "7 класс", label: "7 класс" },
      { value: "8 класс", label: "8 класс" },
      { value: "9 класс", label: "9 класс" },
      { value: "10 класс", label: "10 класс" },
      { value: "11 класс", label: "11 класс" },
    ],
    gridCols: "2",
    required: true,
  },
  {
    id: 2,
    field: "subject",
    type: "select",
    title: "По какому предмету нужен репетитор?",
    options: [
      { value: "Математика", label: "Математика" },
      { value: "Русский язык", label: "Русский язык" },
      { value: "Английский язык", label: "Английский язык" },
      { value: "Физика", label: "Физика" },
      { value: "Химия", label: "Химия" },
      { value: "Биология", label: "Биология" },
      { value: "Информатика", label: "Информатика" },
      { value: "Другое", label: "Другое" },
    ],
    gridCols: "2",
    required: true,
  },
  {
    id: 3,
    field: "goal",
    type: "radio",
    title: "Цель занятий",
    options: [
      { value: "grades", label: "Подтянуть текущие оценки" },
      { value: "exam", label: "Подготовка к ОГЭ / ЕГЭ" },
      { value: "gaps", label: "Закрыть пробелы по теме" },
      { value: "other", label: "Другое" },
    ],
    gridCols: "2",
    required: true,
  },
  {
    id: 4,
    field: "frequency",
    type: "radio",
    title: "Формат и частота занятий",
    options: [
      { value: "1w", label: "1 раз в неделю" },
      { value: "2w", label: "2 раза в неделю" },
      { value: "intensive", label: "Интенсив перед экзаменом" },
      { value: "not-sure", label: "Пока не знаю, нужна рекомендация" },
    ],
    gridCols: "1",
    required: true,
  },
  {
    id: 5,
    field: "timeSlots",
    type: "checkbox",
    title: "Удобное время для занятий",
    options: [
      { value: "weekday-day", label: "Будни днём" },
      { value: "weekday-evening", label: "Будни вечером" },
      { value: "weekend", label: "Выходные" },
    ],
    gridCols: "3",
    required: true,
  },
  {
    id: 6,
    field: "style",
    type: "radio",
    title: "Предпочтительный стиль преподавателя",
    options: [
      { value: "calm", label: "Спокойный, терпеливый" },
      { value: "strict", label: "Более строгий, с контролем" },
      { value: "fast", label: "Быстрый темп, много практики" },
      { value: "dont-know", label: "Пока не знаю, подберите по ребёнку" },
    ],
    gridCols: "1",
    required: true,
  },
  // Последний шаг (7) содержит name, phone и comment одновременно
  {
    id: 7,
    field: "name",
    type: "text",
    title: "Ваше имя",
    placeholder: "Например, Наталья",
    required: true,
  },
  {
    id: 8,
    field: "phone",
    type: "text",
    title: "Телефон для связи",
    placeholder: "+7 (___) ___-__-__",
    required: true,
  },
  {
    id: 9,
    field: "comment",
    type: "textarea",
    title: "Коротко опишите ситуацию (по желанию)",
    placeholder:
      "Например: «ребёнок боится контрольных по математике, оценка 3–4, хотим выйти на стабильные 4–5»",
    required: false,
  },
];

// Количество шагов (последний шаг содержит 3 поля: name, phone, comment)
// Первые 6 вопросов - отдельные шаги, последний шаг (7) содержит name, phone и comment
const TOTAL_STEPS = 7;

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Quiz({ isOpen, onClose }: QuizProps) {
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
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const submitQuizMutation = trpc.submitQuiz.useMutation();

  const isLoading = submitQuizMutation.isPending;
  const isSuccess = submitQuizMutation.isSuccess;

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    // Если нет цифр, возвращаем пустую строку
    if (numbers.length === 0) return "";

    // Убираем первую цифру, если это 7 или 8 (код страны)
    let cleanNumbers = numbers;
    if (numbers.startsWith("7") || numbers.startsWith("8")) {
      cleanNumbers = numbers.slice(1);
    }

    // Если после удаления кода страны ничего не осталось, возвращаем пустую строку
    if (cleanNumbers.length === 0) return "";

    // Форматируем в зависимости от длины
    if (cleanNumbers.length <= 3) return `+7 (${cleanNumbers}`;
    if (cleanNumbers.length <= 6)
      return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    if (cleanNumbers.length <= 8)
      return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
    return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 8)}-${cleanNumbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    setQuiz((prev) => ({ ...prev, phone: formatted }));
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    // Разрешаем только цифры, Backspace, Delete, Tab, Arrow keys
    if (
      !/[0-9]/.test(e.key) &&
      ![
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    // Если пользователь вводит 8 или 7 в начале поля (когда оно пустое или курсор в начале)
    if (
      (e.key === "8" || e.key === "7") &&
      (currentValue === "" || cursorPosition === 0)
    ) {
      e.preventDefault();
      const newValue = formatPhoneNumber(e.key);
      setQuiz((prev) => ({ ...prev, phone: newValue }));
      // Устанавливаем курсор после "+7 ("
      requestAnimationFrame(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.setSelectionRange(
            newValue.length,
            newValue.length,
          );
          phoneInputRef.current.focus();
        }
      });
    }
  };

  const handleOptionSelect = (field: "grade" | "subject", value: string) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 300);
  };

  const handleRadioSelect = (
    field: "goal" | "frequency" | "style",
    value: string,
  ) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 300);
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

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    // Валидация
    if (!quiz.name.trim()) {
      setError("Пожалуйста, укажите ваше имя");
      return;
    }
    if (!quiz.phone.trim() || quiz.phone.replace(/\D/g, "").length < 11) {
      setError("Пожалуйста, укажите корректный номер телефона");
      return;
    }

    submitQuizMutation.mutate(quiz, {
      onSuccess: () => {
        setTimeout(() => {
          onClose();
          setStep(1);
          setQuiz({
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
          submitQuizMutation.reset();
        }, 2000);
      },
      onError: (err) => {
        setError(err.message || "Произошла ошибка при отправке заявки");
      },
    });
  };

  const isSubmitDisabled = () => {
    if (isLastStep) {
      if (!quiz.name.trim()) return true;
      if (!quiz.phone.trim() || quiz.phone.replace(/\D/g, "").length < 11)
        return true;
      return false;
    }

    const currentQuestion = QUIZ_QUESTIONS[step - 1];
    if (!currentQuestion) return false;

    if (currentQuestion.field === "timeSlots") {
      return quiz.timeSlots.length === 0;
    }

    return !quiz[currentQuestion.field];
  };

  const renderQuestion = (question: QuizQuestion) => {
    const value = quiz[question.field];
    const isSelected = (optValue: string) => {
      if (question.type === "checkbox") {
        return (value as string[]).includes(optValue);
      }
      return value === optValue;
    };

    switch (question.type) {
      case "select":
        return (
          <div
            className={`grid gap-3 ${question.gridCols === "2" ? "sm:grid-cols-2" : question.gridCols === "3" ? "sm:grid-cols-3" : ""}`}
          >
            {question.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  handleOptionSelect(
                    question.field as "grade" | "subject",
                    opt.value,
                  )
                }
                className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                  isSelected(opt.value)
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                <span className="text-sm font-medium text-slate-700">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        );

      case "radio":
        return (
          <div
            className={`grid gap-3 ${question.gridCols === "2" ? "sm:grid-cols-2" : ""}`}
          >
            {question.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  isSelected(opt.value)
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name={question.field}
                  value={opt.value}
                  checked={isSelected(opt.value)}
                  onChange={(e) =>
                    handleRadioSelect(
                      question.field as "goal" | "frequency" | "style",
                      e.target.value,
                    )
                  }
                  className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div
            className={`grid gap-3 ${question.gridCols === "3" ? "sm:grid-cols-3" : ""}`}
          >
            {question.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                  isSelected(opt.value)
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected(opt.value)}
                  onChange={() => toggleTimeSlot(opt.value)}
                  className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "text":
        if (question.field === "phone") {
          return (
            <input
              ref={phoneInputRef}
              type="tel"
              value={value as string}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
              placeholder={question.placeholder}
              maxLength={18}
            />
          );
        }
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, [question.field]: e.target.value }))
            }
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
            placeholder={question.placeholder}
          />
        );

      case "textarea":
        return (
          <textarea
            rows={4}
            value={value as string}
            onChange={(e) =>
              setQuiz((prev) => ({
                ...prev,
                [question.field]: e.target.value,
              }))
            }
            placeholder={question.placeholder}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none"
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const isLastStep = step === TOTAL_STEPS;
  // На последнем шаге показываем name, phone и comment, на остальных - соответствующий вопрос
  const currentQuestion = isLastStep ? null : QUIZ_QUESTIONS[step - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-large animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          aria-label="Закрыть квиз"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Подбор репетитора
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Короткий опрос из нескольких шагов. На основе ответов мы подберём
            подходящего репетитора по предмету, цели и расписанию.
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
          {isLastStep ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-3 block text-sm font-bold text-slate-900"
                  >
                    {QUIZ_QUESTIONS.find((q) => q.field === "name")?.title}
                  </label>
                  {renderQuestion(
                    QUIZ_QUESTIONS.find((q) => q.field === "name")!,
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-3 block text-sm font-bold text-slate-900"
                  >
                    {QUIZ_QUESTIONS.find((q) => q.field === "phone")?.title}
                  </label>
                  {renderQuestion(
                    QUIZ_QUESTIONS.find((q) => q.field === "phone")!,
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="mb-3 block text-sm font-bold text-slate-900"
                >
                  {QUIZ_QUESTIONS.find((q) => q.field === "comment")?.title}
                </label>
                {renderQuestion(
                  QUIZ_QUESTIONS.find((q) => q.field === "comment")!,
                )}
              </div>
            </>
          ) : currentQuestion ? (
            <div>
              <p className="mb-4 text-sm font-bold text-slate-900">
                {currentQuestion.title}
              </p>
              {renderQuestion(currentQuestion)}
            </div>
          ) : null}

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
                disabled={isSubmitDisabled()}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg transition-all ${
                  isSubmitDisabled()
                    ? "cursor-not-allowed bg-blue-300"
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
                }`}
              >
                {isLastStep
                  ? isLoading
                    ? "Отправляем..."
                    : "Оставить заявку"
                  : "Далее"}
                {!isLastStep && (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
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
  );
}
