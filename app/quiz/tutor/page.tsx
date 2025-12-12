"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/QuizLayout";
import {
  getQuizState,
  saveQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";

const ADDITIONAL_COMMENT_LIMIT = 800;

export default function TutorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});

  useEffect(() => {
    const state = getQuizState();
    const normalizedPrice: QuizFormData["priceRange"] =
      state.priceRange === "all" ? "any" : state.priceRange;

    const experienceMap: Record<
      Exclude<QuizFormData["priceRange"], undefined>,
      QuizFormData["tutorTeachingExperience"]
    > = {
      budget: "beginner",
      medium: "3-5",
      premium: "5+",
      any: "any",
      all: "any",
    };

    const normalized: QuizFormData = {
      ...state,
      priceRange: normalizedPrice,
      tutorGender: state.tutorGender || "any",
      tutorAge: state.tutorAge || "any",
      tutorTeachingExperience: state.tutorTeachingExperience || "any",
    };
    setFormData(normalized);

    // Автоматически устанавливаем опыт преподавания на основе стоимости
    if (normalized.priceRange && !normalized.tutorTeachingExperience) {
      const suggestedExperience = experienceMap[normalized.priceRange];
      if (suggestedExperience) {
        const updated: QuizFormData = {
          ...normalized,
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
      const priceMap: Record<
        Exclude<QuizFormData["tutorTeachingExperience"], undefined>,
        QuizFormData["priceRange"]
      > = {
        beginner: "budget",
        "3-5": "medium",
        "5+": "premium",
        any: "any",
      };

      const suggestedPrice = priceMap[value as keyof typeof priceMap];
      if (suggestedPrice) {
        updated.priceRange = suggestedPrice;
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
    {
      value: "calm",
      label: "Спокойный, поддерживающий",
      description: "мягкая подача, много поддержки, без давления",
    },
    {
      value: "strict",
      label: "Строгий, с чётким контролем",
      description: "чёткие требования и дисциплина, многое задаётся на дом",
    },
    {
      value: "fast",
      label: "Быстрый темп, много практики",
      description: "много задач за урок, минимум лирики",
    },
    {
      value: "explanations",
      label: "Больше объяснений, меньше тестов",
      description: "развёрнутые объяснения, разбор теории на примерах",
    },
    {
      value: "auto",
      label: "Подберите по ребёнку",
      description: "сами подберём стиль по характеру ребёнка",
    },
  ];

  const scheduleOptions = [
    { value: "weekday-morning", label: "Будни до обеда" },
    { value: "weekday-afternoon", label: "Будни после школы" },
    { value: "weekday-evening", label: "Будни вечером" },
    { value: "weekend", label: "Выходные" },
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

  const cardBase = (active: boolean) =>
    `flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
      active
        ? "border-sky-600 bg-sky-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/60"
    }`;

  const blockSurface =
    "rounded-2xl border border-slate-200 bg-white p-5 md:p-6";

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
      const experienceToPrice: Record<string, QuizFormData["priceRange"]> = {
        beginner: "budget",
        "3-5": formData.tutorOgeEgeExpert ? "premium" : "medium",
        "5+": "premium",
        any: "any",
      };
      priceRange =
        experienceToPrice[formData.tutorTeachingExperience] ?? priceRange;
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
      any: "Все варианты",
    };
    return priceRange ? ranges[priceRange] || "—" : "—";
  };

  const getLessonTypeDisplay = () => {
    return "Индивидуальные";
  };

  const gradeNumber = Number((formData.grade || "").match(/\d+/)?.[0]);
  const shouldShowExamExpert =
    (gradeNumber && gradeNumber >= 9) ||
    formData.goals?.some((goal) => goal === "oge" || goal === "ege");

  const goalLabelsMap: Record<string, string> = {
    "stable-grades": "Стабильные оценки",
    understanding: "Понимание темы",
    "less-conflicts": "Меньше конфликтов с домашкой",
    oge: "Подготовка к ОГЭ",
    ege: "Подготовка к ЕГЭ",
    tests: "Контрольные/ДВИ",
    "strong-school": "Поступление в сильную школу",
    university: "Поступление в вуз",
    "general-understanding": "Разобраться в предмете",
  };

  const getGoalsDisplay = () => {
    if (!formData.goals?.length) return "—";
    const labels = formData.goals
      .map((goal) => goalLabelsMap[goal] || goal)
      .filter(Boolean);
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return labels.join(" · ");
    return `${labels[0]} + ещё ${labels.length - 1}`;
  };

  const scheduleMap: Record<string, string> = {
    "weekday-morning": "Будни до обеда",
    "weekday-afternoon": "Будни после школы",
    "weekday-evening": "Будни вечером",
    weekend: "Выходные",
  };

  const getScheduleDisplay = () => {
    if (!formData.scheduleDays?.length) return "—";
    const labels = formData.scheduleDays
      .map((item) => scheduleMap[item] || item)
      .filter(Boolean);
    return labels.length ? labels.join(", ") : "—";
  };

  const frequencyMap: Record<string, string> = {
    "1w": "1 раз в неделю",
    "2w": "2 раза в неделю",
    intensive: "Интенсив перед экзаменом",
    "not-sure": "Нужна рекомендация",
  };

  const getFrequencyDisplay = () =>
    formData.frequency ? frequencyMap[formData.frequency] || "—" : "—";

  return (
    <QuizLayout>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Основная форма */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Заголовок */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Пожелания к репетитору
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Расскажите о пожеланиях к преподавателю и формату занятий. Все
              фильтры необязательны — если не знаете, оставьте “Не важно”.
            </p>
          </div>

          {/* Блок 1: Пожелания по репетитору */}
          <div className={blockSurface}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Пожелания по репетитору
            </h2>

            {/* Пол репетитора */}
            <div className="mb-6">
              <div className="mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Пол репетитора
                </label>
                <p className="text-sm text-slate-500">
                  Выберите один вариант или оставьте “Не важно”.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "any", label: "Не важно" },
                  { value: "female", label: "Женщина" },
                  { value: "male", label: "Мужчина" },
                ].map((option) => {
                  const isChecked = formData.tutorGender === option.value;
                  return (
                    <label key={option.value} className={cardBase(isChecked)}>
                      <input
                        type="radio"
                        name="tutorGender"
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) =>
                          updateField("tutorGender", e.target.value)
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
            </div>

            {/* Опыт преподавания */}
            <div className="mb-6">
              <div className="mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Опыт преподавания
                </label>
                <p className="text-sm text-slate-500">
                  Выберите один вариант или оставьте “Не важно”.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { value: "any", label: "Не важно" },
                  {
                    value: "beginner",
                    label: "Студент/начинающий",
                  },
                  { value: "3-5", label: "Опыт 3–5 лет" },
                  { value: "5+", label: "Опыт 5+ лет" },
                ].map((option) => {
                  const isChecked =
                    formData.tutorTeachingExperience === option.value;
                  return (
                    <label key={option.value} className={cardBase(isChecked)}>
                      <input
                        type="radio"
                        name="tutorTeachingExperience"
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) =>
                          updateField("tutorTeachingExperience", e.target.value)
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

              {/* Дополнительная галочка для экспертов по ОГЭ/ЕГЭ */}
              {shouldShowExamExpert && (
                <div className="mt-4">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={formData.tutorOgeEgeExpert || false}
                      onChange={(e) =>
                        updateField("tutorOgeEgeExpert", e.target.checked)
                      }
                      className="sr-only"
                    />
                    {renderCheckbox(formData.tutorOgeEgeExpert || false)}
                    <span className="text-sm font-medium text-slate-800">
                      Показывать только репетиторов, которые специализируются на
                      ОГЭ/ЕГЭ.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Возраст репетитора */}
            <div>
              <div className="mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Возраст репетитора
                </label>
                <p className="text-sm text-slate-500">
                  Необязательный фильтр: выбирайте, только если это важно.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "any", label: "Не важно" },
                  {
                    value: "young",
                    label: "Ближе по возрасту к ребёнку",
                  },
                  { value: "adult", label: "Взрослый преподаватель" },
                ].map((option) => {
                  const isChecked = formData.tutorAge === option.value;
                  return (
                    <label key={option.value} className={cardBase(isChecked)}>
                      <input
                        type="radio"
                        name="tutorAge"
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) =>
                          updateField("tutorAge", e.target.value)
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
            </div>
          </div>

          {/* Блок 2: Стиль преподавания */}
          <div className={blockSurface}>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Какой стиль преподавания вам ближе?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Можно выбрать несколько вариантов или оставить “Подберите по
              ребёнку”.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {teachingStyles.map((style) => {
                const isChecked =
                  formData.teachingStyle?.includes(style.value) || false;
                const isAuto = style.value === "auto";
                return (
                  <label
                    key={style.value}
                    className={`${cardBase(isChecked)} ${
                      isAuto && isChecked ? "ring-1 ring-sky-200 shadow-md" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const current = formData.teachingStyle || [];
                        let updated: string[];
                        if (isAuto) {
                          updated = e.target.checked ? ["auto"] : [];
                        } else {
                          updated = e.target.checked
                            ? [
                                ...current.filter((v) => v !== "auto"),
                                style.value,
                              ]
                            : current.filter((v) => v !== style.value);
                        }
                        updateField("teachingStyle", updated);
                      }}
                      className="sr-only"
                    />
                    {renderCheckbox(isChecked)}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {style.label}
                      </p>
                      <p className="text-xs text-slate-600">
                        {style.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Блок 3: Формат занятий и расписание */}
          <div className={blockSurface}>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Когда удобнее заниматься?
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Можно выбрать несколько вариантов.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {scheduleOptions.map((option) => {
                const isChecked =
                  formData.scheduleDays?.includes(option.value) || false;
                return (
                  <label key={option.value} className={cardBase(isChecked)}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const current = formData.scheduleDays || [];
                        const updated = e.target.checked
                          ? [...current, option.value]
                          : current.filter((v) => v !== option.value);
                        updateField("scheduleDays", updated);
                      }}
                      className="sr-only"
                    />
                    {renderCheckbox(isChecked)}
                    <span className="text-sm font-semibold text-slate-800">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Как часто планируете заниматься?
              </h3>
              <p className="text-sm text-slate-500 mb-3">Один вариант.</p>
              <div className="space-y-3">
                {[
                  { value: "1w", label: "1 раз в неделю" },
                  { value: "2w", label: "2 раза в неделю" },
                  { value: "intensive", label: "Интенсив перед экзаменом" },
                  {
                    value: "not-sure",
                    label: "Пока не знаю, нужна рекомендация",
                  },
                ].map((option) => {
                  const isChecked = formData.frequency === option.value;
                  return (
                    <label key={option.value} className={cardBase(isChecked)}>
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) =>
                          updateField("frequency", e.target.value)
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
            </div>
          </div>

          {/* Блок 4: Комментарий */}
          <div className={blockSurface}>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Комментарий и дополнительные пожелания
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              Необязательно. До {ADDITIONAL_COMMENT_LIMIT} символов.
            </p>
            <textarea
              value={formData.additionalComment || ""}
              onChange={(e) => {
                const value = e.target.value.slice(0, ADDITIONAL_COMMENT_LIMIT);
                updateField("additionalComment", value);
              }}
              placeholder="Напишите о характере ребёнка, его интересах, особенностях или любых важных деталях (например, СДВГ, частые поездки, соревнования)…"
              rows={4}
              maxLength={ADDITIONAL_COMMENT_LIMIT}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 resize-none"
            />
            <div className="mt-2 text-xs text-slate-500 text-right">
              {(formData.additionalComment || "").length} /{" "}
              {ADDITIONAL_COMMENT_LIMIT}
            </div>
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
              <div>
                <p className="text-slate-500">Цели</p>
                <p className="font-semibold text-slate-900">
                  {getGoalsDisplay()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Когда удобно</p>
                <p className="font-semibold text-slate-900">
                  {getScheduleDisplay()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Частота</p>
                <p className="font-semibold text-slate-900">
                  {getFrequencyDisplay()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
