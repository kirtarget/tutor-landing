"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/QuizLayout";
import {
  getQuizState,
  saveQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";

const EXPERIENCE_COMMENT_LIMIT = 500;

export default function RequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    const state = getQuizState();
    const normalizedPriceRange: QuizFormData["priceRange"] =
      state.priceRange === "all" ? "any" : state.priceRange;

    const normalized: QuizFormData = {
      ...state,
      priceRange: normalizedPriceRange,
      lessonType: state.lessonType || "individual",
    };

    setFormData(normalized);
  }, []);

  const updateField = (field: keyof QuizFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    saveQuizState(updated);
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): Record<string, string> => {
    const nextErrors: Record<string, string> = {};

    if (!formData.grade) {
      nextErrors.grade = "Выберите класс";
    }
    if (!formData.subject) {
      nextErrors.subject = "Выберите предмет";
    }
    if (formData.subject === "Другое" && !formData.subjectOther?.trim()) {
      nextErrors.subjectOther = "Уточните предмет";
    }
    if (!formData.goals || formData.goals.length === 0) {
      nextErrors.goals = "Выберите хотя бы одну цель";
    }
    if (!formData.priceRange) {
      nextErrors.priceRange = "Пожалуйста, выберите вариант стоимости";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleNext = () => {
    setAttempted(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      router.push("/quiz/tutor");
    } else {
      // Скролл к первой ошибке
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const goalsGroups = [
    {
      title: "Учёба сейчас",
      options: [
        {
          value: "stable-grades",
          label: "Стабильные оценки по предмету (4–5)",
        },
        { value: "understanding", label: "Понимание темы, а не зубрёжка" },
        { value: "less-conflicts", label: "Меньше конфликтов из-за домашки" },
      ],
    },
    {
      title: "Экзамены",
      options: [
        { value: "oge", label: "Подготовка к ОГЭ" },
        { value: "ege", label: "Подготовка к ЕГЭ" },
        { value: "tests", label: "Подготовка к контрольным/ДВИ" },
      ],
    },
    {
      title: "Долгосрочная цель",
      options: [
        { value: "strong-school", label: "Поступить в сильную школу/класс" },
        {
          value: "university",
          label: "Поступить в вуз на целевую специальность",
        },
        {
          value: "general-understanding",
          label: "Вообще разобраться в предмете",
        },
      ],
    },
  ];

  const difficulties = [
    {
      value: "teacher-explanations",
      label: "Ребёнок не понимает объяснения учителя",
    },
    { value: "gaps", label: "Пробелы в базе (забыты темы прошлых классов)" },
    { value: "exam-fear", label: "Страх контрольных и экзаменов" },
    { value: "mistakes", label: "Много ошибок в задачах/тестах" },
    { value: "homework-conflicts", label: "Скандалы при выполнении домашки" },
    {
      value: "no-motivation",
      label: "Ребёнок не мотивирован, «просто не хочет»",
    },
    { value: "other", label: "Другое" },
  ];

  const priceRanges = [
    {
      value: "budget" as const,
      title: "Недорогие занятия",
      description: "от ~900–1200 ₽ · студенты и начинающие преподы",
      hint: "Базовые задачи, спокойный темп",
    },
    {
      value: "medium" as const,
      title: "Оптимальный баланс",
      description: "от ~1200–1700 ₽ · опытные преподаватели",
      hint: "Лучшее соотношение цены и результатов",
    },
    {
      value: "premium" as const,
      title: "Максимальный результат",
      description: "от ~1800–2500 ₽ · эксперты по ОГЭ/ЕГЭ",
      hint: "Сложные задачи и высокий темп",
    },
    {
      value: "any" as const,
      title: "Рассмотреть все варианты",
      description: "Покажем подходящих в разных ценовых диапазонах",
      hint: "Рекомендуем, что лучше под задачи",
    },
  ];

  const renderRadio = (checked: boolean) => (
    <span
      aria-hidden
      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
        checked ? "border-sky-600 bg-sky-50" : "border-slate-300 bg-white"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition ${
          checked ? "bg-sky-600" : "bg-transparent"
        }`}
      />
    </span>
  );

  const renderCheckbox = (checked: boolean) => (
    <span
      aria-hidden
      className={`flex h-5 w-5 items-center justify-center rounded-md border-2 text-white transition ${
        checked
          ? "border-sky-600 bg-sky-600"
          : "border-slate-300 bg-white text-transparent"
      }`}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.3}
      >
        <path d="M5 11l3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  const cardBase = (active: boolean, hasError?: boolean) =>
    `flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
      active
        ? "border-sky-600 bg-sky-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/60"
    } ${hasError ? "ring-1 ring-red-200" : ""}`;

  const checkboxCardBase = (active: boolean) =>
    `flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
      active
        ? "border-sky-600 bg-sky-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/60"
    }`;

  const blockSurface = (hasError?: boolean) =>
    `rounded-2xl border p-5 md:p-6 ${
      hasError
        ? "border-red-300 bg-red-50/60 shadow-[0_10px_25px_rgba(248,113,113,0.12)]"
        : "border-slate-200 bg-white"
    }`;

  const isNextDisabled =
    !formData.grade ||
    !formData.subject ||
    (formData.subject === "Другое" && !formData.subjectOther?.trim()) ||
    !formData.goals ||
    formData.goals.length === 0 ||
    !formData.priceRange;

  return (
    <QuizLayout>
      <div className="space-y-8 md:space-y-12">
        {/* Заголовок */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Запрос
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Расскажите о ребёнке, предмете и целях занятий
          </p>
        </div>

        {/* Блок 1: Ребёнок и предмет */}
        <div
          id="grade"
          className={blockSurface(
            Boolean(errors.grade || errors.subject || errors.subjectOther),
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Ребёнок и предмет
              </h2>
              <p className="text-sm text-slate-500">Оба поля обязательны</p>
            </div>
            {(errors.grade || errors.subject || errors.subjectOther) && (
              <p className="text-sm font-medium text-red-600">
                Заполните обязательные поля
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Класс ребёнка *
              </label>
              <select
                id="grade-select"
                value={formData.grade || ""}
                onChange={(e) => updateField("grade", e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">Выберите класс</option>
                {[5, 6, 7, 8, 9, 10, 11].map((grade) => (
                  <option key={grade} value={`${grade} класс`}>
                    {grade} класс
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="mt-2 text-sm text-red-600">{errors.grade}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject-select"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Предмет *
              </label>
              <select
                id="subject-select"
                value={formData.subject || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFormData((prev) => {
                    const updated = { ...prev, subject: newValue };
                    if (newValue !== "Другое") {
                      updated.subjectOther = "";
                    }
                    saveQuizState(updated);
                    return updated;
                  });
                  // Очищаем ошибку для этого поля
                  if (errors.subject) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.subject;
                      return newErrors;
                    });
                  }
                }}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
              >
                <option value="">Выберите предмет</option>
                {[
                  "Математика",
                  "Русский язык",
                  "Английский язык",
                  "Физика",
                  "Химия",
                  "Биология",
                  "Информатика",
                  "История",
                  "Обществознание",
                  "Другое",
                ].map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
              )}

              {formData.subject === "Другое" && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Уточните предмет *
                  </label>
                  <input
                    id="subjectOther"
                    type="text"
                    value={formData.subjectOther || ""}
                    onChange={(e) =>
                      updateField("subjectOther", e.target.value)
                    }
                    placeholder="Например: География"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  />
                  {errors.subjectOther && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.subjectOther}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Блок 3: Что хотите улучшить */}
        <div id="goals" className={blockSurface(Boolean(errors.goals))}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Что хотите улучшить в первую очередь?
              </h2>
              <p className="text-sm text-slate-500">
                Можно выбрать несколько вариантов. Обязательно.
              </p>
            </div>
            {errors.goals && (
              <p className="text-sm font-medium text-red-600">{errors.goals}</p>
            )}
          </div>
          <div className="space-y-6">
            {goalsGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  {group.title}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.options.map((option) => {
                    const isChecked =
                      formData.goals?.includes(option.value) || false;
                    return (
                      <label
                        key={option.value}
                        className={checkboxCardBase(isChecked)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = formData.goals || [];
                            const updated = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v) => v !== option.value);
                            updateField("goals", updated);
                          }}
                          className="sr-only"
                        />
                        {renderCheckbox(isChecked)}
                        <span className="text-sm font-medium text-slate-800">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Блок 4: С чем сейчас сложнее всего */}
        <div className={blockSurface()}>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            С чем сейчас сложнее всего?
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Поможет лучше подобрать формат и темп занятий.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {difficulties.map((difficulty) => {
              const isChecked =
                formData.difficulties?.includes(difficulty.value) || false;
              return (
                <label
                  key={difficulty.value}
                  className={checkboxCardBase(isChecked)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const current = formData.difficulties || [];
                      const updated = e.target.checked
                        ? [...current, difficulty.value]
                        : current.filter((v) => v !== difficulty.value);
                      updateField("difficulties", updated);
                    }}
                    className="sr-only"
                  />
                  {renderCheckbox(isChecked)}
                  <span className="text-sm font-medium text-slate-800">
                    {difficulty.label}
                  </span>
                </label>
              );
            })}
          </div>
          {formData.difficulties?.includes("other") && (
            <div className="mt-4">
              <input
                type="text"
                value={formData.difficultyOther || ""}
                onChange={(e) => updateField("difficultyOther", e.target.value)}
                placeholder="Опишите коротко"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
              />
            </div>
          )}
        </div>

        {/* Блок 5: Опыт с репетиторами */}
        <div className={blockSurface()}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Уже занимались с репетитором?
            </h2>
            <p className="text-sm text-slate-500">Выберите один вариант.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                value: "never",
                label: "Никогда не занимались",
              },
              {
                value: "before",
                label: "Занимались раньше, сейчас не ходим",
              },
              {
                value: "current",
                label: "Сейчас занимаемся, думаем о замене",
              },
            ].map((option) => {
              const isChecked = formData.tutorExperience === option.value;
              return (
                <label key={option.value} className={cardBase(isChecked)}>
                  <input
                    type="radio"
                    name="tutorExperience"
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) =>
                      updateField("tutorExperience", e.target.value)
                    }
                    className="sr-only"
                  />
                  {renderRadio(isChecked)}
                  <span className="text-sm font-semibold text-slate-800">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
          {(formData.tutorExperience === "before" ||
            formData.tutorExperience === "current") && (
            <div className="mt-5 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Расскажите о прежних занятиях (что было удобно/неудобно)
              </label>
              <textarea
                value={formData.tutorExperienceComment || ""}
                onChange={(e) => {
                  const value = e.target.value.slice(
                    0,
                    EXPERIENCE_COMMENT_LIMIT,
                  );
                  updateField("tutorExperienceComment", value);
                }}
                placeholder="Например: ребёнок стеснялся, было слишком быстро, не видел прогресса…"
                rows={4}
                maxLength={EXPERIENCE_COMMENT_LIMIT}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 resize-none"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Необязательно. До {EXPERIENCE_COMMENT_LIMIT} символов.
                </span>
                <span>
                  {(formData.tutorExperienceComment || "").length} /{" "}
                  {EXPERIENCE_COMMENT_LIMIT}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Блок 6: Предпочтения по стоимости */}
        <div
          id="priceRange"
          className={blockSurface(Boolean(errors.priceRange))}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Предпочтения по стоимости занятия
              </h2>
              <p className="text-sm text-slate-500">
                Выберите один вариант (обязательно).
              </p>
            </div>
            {errors.priceRange && (
              <p className="text-sm font-medium text-red-600">
                {errors.priceRange}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {priceRanges.map((range) => {
              const isChecked = formData.priceRange === range.value;
              return (
                <label
                  key={range.value}
                  className={cardBase(
                    isChecked,
                    attempted && Boolean(errors.priceRange),
                  )}
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={isChecked}
                    onChange={(e) => updateField("priceRange", e.target.value)}
                    className="sr-only"
                  />
                  {renderRadio(isChecked)}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {range.title}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {range.description}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {range.hint}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-slate-200">
          <button
            type="button"
            aria-disabled={isNextDisabled}
            onClick={handleNext}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all ${
              isNextDisabled
                ? "cursor-not-allowed bg-slate-300 opacity-70"
                : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
            }`}
          >
            Далее
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
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Ответы помогут предложить подходящих репетиторов. Изменить их можно
            на следующем шаге.
          </p>
        </div>
      </div>
    </QuizLayout>
  );
}
