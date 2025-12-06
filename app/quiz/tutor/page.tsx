"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/QuizLayout";
import {
  getQuizState,
  saveQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";

export default function TutorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});

  useEffect(() => {
    const state = getQuizState();
    setFormData(state);

    // Автоматически устанавливаем опыт преподавания на основе стоимости
    if (state.priceRange && !state.tutorTeachingExperience) {
      const experienceMap: Record<string, string> = {
        budget: "beginner",
        medium: "3-5",
        premium: "5+",
        all: "any",
      };

      const suggestedExperience = experienceMap[state.priceRange];
      if (suggestedExperience) {
        const updated = {
          ...state,
          tutorTeachingExperience: suggestedExperience,
        };
        setFormData(updated);
        saveQuizState(updated);
      }
    }
  }, []);

  const updateField = (field: keyof QuizFormData, value: any) => {
    const updated = { ...formData, [field]: value };

    // При изменении опыта преподавания обновляем стоимость
    if (field === "tutorTeachingExperience") {
      const priceMap: Record<string, string> = {
        beginner: "budget",
        "3-5": "medium",
        "5+": "premium",
        any: "all",
      };

      const suggestedPrice = priceMap[value];
      if (suggestedPrice) {
        updated.priceRange = suggestedPrice as any;
      }

      // Если выбран не "3-5" и не "5+", сбрасываем галочку экспертов
      if (value !== "3-5" && value !== "5+") {
        updated.tutorOgeEgeExpert = false;
      }
    }

    // При изменении галочки экспертов обновляем стоимость
    if (field === "tutorOgeEgeExpert") {
      if (formData.tutorTeachingExperience === "3-5") {
        updated.priceRange = value ? "premium" : "medium";
      } else if (formData.tutorTeachingExperience === "5+") {
        // Для 5+ стоимость остаётся премиальной независимо от галочки
        updated.priceRange = "premium";
      }
    }

    setFormData(updated);
    saveQuizState(updated);
  };

  const handleBack = () => {
    router.push("/quiz/request");
  };

  const handleNext = () => {
    router.push("/quiz/checkout");
  };

  const teachingStyles = [
    { value: "calm", label: "Спокойный, поддерживающий" },
    { value: "strict", label: "Строгий, с жёстким контролем" },
    { value: "fast", label: "Быстрый темп, много практики" },
    { value: "explanations", label: "Больше объяснений, меньше тестов" },
    { value: "auto", label: "Подберите по ребёнку" },
  ];

  const scheduleOptions = [
    { value: "weekday-morning", label: "Будни до обеда" },
    { value: "weekday-afternoon", label: "Будни после школы" },
    { value: "weekday-evening", label: "Будни вечером" },
    { value: "weekend", label: "Выходные" },
  ];

  // Получаем данные для резюме
  const getSubjectDisplay = () => {
    if (formData.subject === "Другое" && formData.subjectOther) {
      return formData.subjectOther;
    }
    return formData.subject || "—";
  };

  const getPriceRangeDisplay = () => {
    // Если опыт преподавания выбран, используем его для определения стоимости
    let priceRange = formData.priceRange;

    if (formData.tutorTeachingExperience && !priceRange) {
      const experienceToPrice: Record<string, string> = {
        beginner: "budget",
        "3-5": formData.tutorOgeEgeExpert ? "premium" : "medium",
        "5+": "premium",
        any: "all",
      };
      priceRange =
        experienceToPrice[formData.tutorTeachingExperience] || priceRange;
    } else if (formData.tutorTeachingExperience === "3-5" && priceRange) {
      // Обновляем стоимость на основе галочки экспертов
      if (formData.tutorOgeEgeExpert && priceRange !== "premium") {
        priceRange = "premium";
      } else if (!formData.tutorOgeEgeExpert && priceRange === "premium") {
        priceRange = "medium";
      }
    } else if (formData.tutorTeachingExperience === "5+") {
      priceRange = "premium";
    }

    const ranges: Record<string, string> = {
      budget: "Недорогие (900–1200 ₽)",
      medium: "Средний (1200–1700 ₽)",
      premium: "Премиум (1800–2500 ₽)",
      all: "Все варианты",
    };
    return priceRange ? ranges[priceRange] || "—" : "—";
  };

  const getLessonTypeDisplay = () => {
    const types: Record<string, string> = {
      individual: "Индивидуальные",
      "mini-group": "Мини-группа 2–3 человека",
      "not-sure": "Подберём вариант",
    };
    return formData.lessonType ? types[formData.lessonType] || "—" : "—";
  };

  return (
    <QuizLayout>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Основная форма */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Заголовок */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Репетитор
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Расскажите о пожеланиях к преподавателю и формату занятий
            </p>
          </div>

          {/* Блок 1: Пожелания по репетитору */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Пожелания по репетитору
            </h2>

            {/* Пол репетитора */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Пол репетитора
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "any", label: "Не важно" },
                  { value: "female", label: "Женщина" },
                  { value: "male", label: "Мужчина" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                      formData.tutorGender === option.value
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tutorGender"
                      value={option.value}
                      checked={formData.tutorGender === option.value}
                      onChange={(e) =>
                        updateField("tutorGender", e.target.value)
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Опыт преподавания */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Опыт преподавания
              </label>
              <div className="space-y-3">
                {[
                  { value: "any", label: "Не важно" },
                  {
                    value: "beginner",
                    label: "Студент/начинающий преподаватель",
                  },
                  { value: "3-5", label: "Опыт 3–5 лет" },
                  { value: "5+", label: "Опыт 5+ лет" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      formData.tutorTeachingExperience === option.value
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tutorTeachingExperience"
                      value={option.value}
                      checked={
                        formData.tutorTeachingExperience === option.value
                      }
                      onChange={(e) =>
                        updateField("tutorTeachingExperience", e.target.value)
                      }
                      className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Дополнительная галочка для экспертов по ОГЭ/ЕГЭ */}
              {["3-5", "5+"].includes(
                formData.tutorTeachingExperience || "",
              ) && (
                <div className="mt-4">
                  <label className="flex cursor-pointer items-center gap-3 p-2">
                    <input
                      type="checkbox"
                      checked={formData.tutorOgeEgeExpert || false}
                      onChange={(e) =>
                        updateField("tutorOgeEgeExpert", e.target.checked)
                      }
                      className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Только эксперты по ОГЭ/ЕГЭ
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Возраст репетитора */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Возраст репетитора
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "any", label: "Не важно" },
                  {
                    value: "young",
                    label: "Ближе по возрасту к ребёнку",
                  },
                  { value: "adult", label: "Взрослый преподаватель" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                      formData.tutorAge === option.value
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tutorAge"
                      value={option.value}
                      checked={formData.tutorAge === option.value}
                      onChange={(e) => updateField("tutorAge", e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Блок 2: Стиль преподавания */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Какой стиль преподавания вам ближе?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Можно выбрать несколько вариантов или оставить «Подберите по
              ребёнку».
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {teachingStyles.map((style) => (
                <label
                  key={style.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    formData.teachingStyle?.includes(style.value)
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.teachingStyle?.includes(style.value) || false
                    }
                    onChange={(e) => {
                      const current = formData.teachingStyle || [];
                      let updated: string[];
                      if (style.value === "auto") {
                        // Если выбрали "Подберите по ребёнку", очищаем остальные
                        updated = e.target.checked ? ["auto"] : [];
                      } else {
                        // Если выбрали другой стиль, убираем "auto"
                        updated = e.target.checked
                          ? [
                              ...current.filter((v) => v !== "auto"),
                              style.value,
                            ]
                          : current.filter((v) => v !== style.value);
                      }
                      updateField("teachingStyle", updated);
                    }}
                    className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {style.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Блок 3: Формат занятий и расписание */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Когда удобнее заниматься?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {scheduleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 p-4 text-center transition-all ${
                    formData.scheduleDays?.includes(option.value)
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.scheduleDays?.includes(option.value) || false
                    }
                    onChange={(e) => {
                      const current = formData.scheduleDays || [];
                      const updated = e.target.checked
                        ? [...current, option.value]
                        : current.filter((v) => v !== option.value);
                      updateField("scheduleDays", updated);
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Сколько раз в неделю планируете заниматься?
              </h3>
              <div className="space-y-3">
                {[
                  { value: "1w", label: "1 раз в неделю" },
                  { value: "2w", label: "2 раза в неделю" },
                  { value: "intensive", label: "Интенсив перед экзаменом" },
                  {
                    value: "not-sure",
                    label: "Пока не знаю, нужна рекомендация",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      formData.frequency === option.value
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={formData.frequency === option.value}
                      onChange={(e) => updateField("frequency", e.target.value)}
                      className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Блок 4: Комментарий */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Комментарий и дополнительные пожелания
            </h2>
            <textarea
              value={formData.additionalComment || ""}
              onChange={(e) => updateField("additionalComment", e.target.value)}
              placeholder="Например: ребёнок стесняется новых людей, нужно мягкое общение; важна подготовка именно к профильному экзамену..."
              rows={4}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 resize-none"
            />
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-slate-200 flex gap-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400"
            >
              Назад
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
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
          </div>
          <p className="text-xs text-slate-500">
            На следующем шаге вы выберете время и подтвердите бронирование
            пробного урока.
          </p>
        </div>

        {/* Резюме запроса (правый сайдбар) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-slate-50 border-2 border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Ваш запрос</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Класс</p>
                <p className="font-semibold text-slate-900">
                  {formData.grade || "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Предмет</p>
                <p className="font-semibold text-slate-900">
                  {getSubjectDisplay()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Вид занятий</p>
                <p className="font-semibold text-slate-900">
                  {getLessonTypeDisplay()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Стоимость</p>
                <p className="font-semibold text-slate-900">
                  {getPriceRangeDisplay()}
                </p>
              </div>
              {formData.goals && formData.goals.length > 0 && (
                <div>
                  <p className="text-slate-500">Цели</p>
                  <p className="font-semibold text-slate-900">
                    {formData.goals.length} выбрано
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
