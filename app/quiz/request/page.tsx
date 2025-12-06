"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/QuizLayout";
import {
  getQuizState,
  saveQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";

export default function RequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(getQuizState());
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

    if (!formData.lessonType) {
      nextErrors.lessonType = "Выберите вид занятий";
    }
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
      nextErrors.priceRange = "Выберите диапазон стоимости";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleNext = () => {
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
      value: "budget",
      title: "Недорогие занятия",
      description: "Подойдут начинающие репетиторы и студенты старших курсов.",
      price: "от 900–1200 ₽ за онлайн-урок",
    },
    {
      value: "medium",
      title: "Средний уровень",
      description: "Опытные преподаватели с хорошими отзывами.",
      price: "от 1200–1700 ₽ за онлайн-урок",
    },
    {
      value: "premium",
      title: "Максимальный результат",
      description: "Эксперты по ОГЭ/ЕГЭ, сильный опыт и результаты учеников.",
      price: "от 1800–2500 ₽ за онлайн-урок",
    },
  ];

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

        {/* Блок 1: Тип занятий */}
        <div id="lessonType">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Вид занятий</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "individual", label: "Индивидуальные" },
              { value: "mini-group", label: "Мини-группа 2–3 человека" },
              { value: "not-sure", label: "Пока не знаю, подберите вариант" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                  formData.lessonType === option.value
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="lessonType"
                  value={option.value}
                  checked={formData.lessonType === option.value}
                  onChange={(e) => updateField("lessonType", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-slate-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.lessonType && (
            <p className="mt-2 text-sm text-red-600">{errors.lessonType}</p>
          )}
        </div>

        {/* Блок 2: Ребёнок и предмет */}
        <div id="grade">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Ребёнок и предмет
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Класс ребёнка
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
                Предмет
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
                    Уточните предмет
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
        <div id="goals">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Что хотите улучшить в первую очередь?
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Можно выбрать несколько вариантов.
          </p>
          <div className="space-y-6">
            {goalsGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  {group.title}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                        formData.goals?.includes(option.value)
                          ? "border-sky-500 bg-sky-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          formData.goals?.includes(option.value) || false
                        }
                        onChange={(e) => {
                          const current = formData.goals || [];
                          const updated = e.target.checked
                            ? [...current, option.value]
                            : current.filter((v) => v !== option.value);
                          updateField("goals", updated);
                        }}
                        className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.goals && (
            <p className="mt-2 text-sm text-red-600">{errors.goals}</p>
          )}
        </div>

        {/* Блок 4: С чем сейчас сложнее всего */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            С чем сейчас сложнее всего?
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Поможет лучше подобрать формат и темп занятий.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {difficulties.map((difficulty) => (
              <label
                key={difficulty.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  formData.difficulties?.includes(difficulty.value)
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    formData.difficulties?.includes(difficulty.value) || false
                  }
                  onChange={(e) => {
                    const current = formData.difficulties || [];
                    const updated = e.target.checked
                      ? [...current, difficulty.value]
                      : current.filter((v) => v !== difficulty.value);
                    updateField("difficulties", updated);
                  }}
                  className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {difficulty.label}
                </span>
              </label>
            ))}
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
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            С кем уже занимались?
          </h2>
          <div className="space-y-3">
            {[
              {
                value: "never",
                label: "Никогда не занимались с репетиторами",
              },
              {
                value: "before",
                label: "Занимались раньше, сейчас не ходим",
              },
              {
                value: "current",
                label: "Сейчас занимаемся, но думаем о замене",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  formData.tutorExperience === option.value
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="tutorExperience"
                  value={option.value}
                  checked={formData.tutorExperience === option.value}
                  onChange={(e) =>
                    updateField("tutorExperience", e.target.value)
                  }
                  className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {(formData.tutorExperience === "before" ||
            formData.tutorExperience === "current") && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Что понравилось / не понравилось?
              </label>
              <textarea
                value={formData.tutorExperienceComment || ""}
                onChange={(e) =>
                  updateField("tutorExperienceComment", e.target.value)
                }
                placeholder="Например: ребёнок стеснялся, было слишком быстро, не видели прогресса…"
                rows={3}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 resize-none"
              />
            </div>
          )}
        </div>

        {/* Блок 6: Предпочтения по стоимости */}
        <div id="priceRange">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Предпочтения по стоимости занятия
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Диапазоны помогут подобрать подходящих преподавателей.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className={`flex cursor-pointer flex-col rounded-xl border-2 p-5 transition-all ${
                  formData.priceRange === range.value
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={formData.priceRange === range.value}
                  onChange={(e) => updateField("priceRange", e.target.value)}
                  className="sr-only"
                />
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {range.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {range.description}
                </p>
                <p className="text-sm font-semibold text-sky-600 mt-auto">
                  {range.price}
                </p>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-sky-300">
              <input
                type="checkbox"
                checked={formData.priceRange === "all"}
                onChange={(e) =>
                  updateField(
                    "priceRange",
                    e.target.checked ? "all" : undefined,
                  )
                }
                className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Рассмотрите все варианты
              </span>
            </label>
          </div>
          {errors.priceRange && (
            <p className="mt-2 text-sm text-red-600">{errors.priceRange}</p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={handleNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
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
