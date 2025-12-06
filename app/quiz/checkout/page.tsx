"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuizLayout } from "@/components/QuizLayout";
import { FAQ } from "@/components/FAQ";
import { TutorCard } from "@/components/TutorCard";
import {
  getQuizState,
  saveQuizState,
  clearQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";
import {
  matchTutors,
  mapQuizToAnswers,
  type TutorRecommendation,
} from "@/lib/tutor-matcher";
import { trpc } from "@/trpc/client";

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [showTutorList, setShowTutorList] = useState(false);
  const [recommendations, setRecommendations] = useState<TutorRecommendation[]>(
    [],
  );
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const submitQuizMutation = trpc.submitQuiz.useMutation();

  useEffect(() => {
    setFormData(getQuizState());
  }, []);

  useEffect(() => {
    const answers = mapQuizToAnswers(formData);
    const matched = matchTutors(answers, 10);
    setRecommendations(matched);
    setSelectedTutorId((current) => {
      if (current && matched.some((tutor) => tutor.id === current)) {
        return current;
      }
      return matched[0]?.id ?? null;
    });
  }, [formData]);

  useEffect(() => {
    if (recommendations.length <= 1) {
      setShowTutorList(false);
    }
  }, [recommendations]);

  const updateField = (field: keyof QuizFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    saveQuizState(updated);
    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    let cleanNumbers = numbers;
    if (numbers.startsWith("7") || numbers.startsWith("8")) {
      cleanNumbers = numbers.slice(1);
    }
    if (cleanNumbers.length === 0) return "";
    if (cleanNumbers.length <= 3) return `+7 (${cleanNumbers}`;
    if (cleanNumbers.length <= 6)
      return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    if (cleanNumbers.length <= 8)
      return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6)}`;
    return `+7 (${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 8)}-${cleanNumbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    updateField("parentPhone", formatted);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const isGradeFilled = Boolean(formData.grade?.trim());
  const subjectValue =
    formData.subject === "Другое"
      ? formData.subjectOther?.trim()
      : formData.subject?.trim();
  const isSubjectFilled = Boolean(subjectValue);
  const hasRequiredQuizData = isGradeFilled && isSubjectFilled;

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!isGradeFilled) {
      nextErrors.grade = "Выберите класс на шаге «Запрос»";
    }
    if (!isSubjectFilled) {
      nextErrors.subject =
        formData.subject === "Другое"
          ? "Укажите предмет в поле «Другое» на шаге «Запрос»"
          : "Выберите предмет на шаге «Запрос»";
    }

    if (!formData.parentName?.trim()) {
      nextErrors.parentName = "Укажите имя";
    }
    if (
      !formData.parentPhone?.trim() ||
      formData.parentPhone.replace(/\D/g, "").length < 10
    ) {
      nextErrors.parentPhone = "Укажите корректный номер телефона";
    }
    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Выберите способ оплаты";
    }

    if (!hasRequiredQuizData) {
      nextErrors.prerequisite =
        "Заполните обязательные вопросы на предыдущих шагах, чтобы продолжить.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const quizData = {
      name: formData.parentName || "",
      phone: formData.parentPhone || "",
      grade: formData.grade || "",
      subject:
        formData.subject === "Другое"
          ? formData.subjectOther || ""
          : formData.subject || "",
      goal: formData.goals?.join(", ") || "",
      frequency: formData.frequency || "",
      timeSlots: formData.scheduleDays || [],
      style: formData.teachingStyle?.join(", ") || "",
      comment: formData.additionalComment || "",
    };

    submitQuizMutation.mutate(quizData, {
      onSuccess: () => {
        clearQuizState();
        setTimeout(() => {
          router.push("/?success=true");
        }, 2000);
      },
      onError: (error) => {
        setErrors({ submit: error.message || "Ошибка при отправке заявки" });
      },
    });
  };

  const getSubjectDisplay = () => {
    if (formData.subject === "Другое" && formData.subjectOther) {
      return formData.subjectOther;
    }
    return formData.subject || "—";
  };

  const getLessonTypeDisplay = () => {
    const types: Record<string, string> = {
      individual: "Индивидуальные",
      "mini-group": "Мини-группа 2–3 человека",
      "not-sure": "Подберём вариант",
    };
    return formData.lessonType ? types[formData.lessonType] || "—" : "—";
  };

  const selectedTutor = useMemo(
    () => recommendations.find((tutor) => tutor.id === selectedTutorId) ?? null,
    [recommendations, selectedTutorId],
  );

  const fallbackPrice = getFallbackPriceRange(formData.priceRange);
  const lessonPrice = selectedTutor
    ? `${formatCurrency(selectedTutor.price)} ₽`
    : fallbackPrice;
  const priceContext = selectedTutor
    ? `Стоимость пробного урока у ${selectedTutor.name}`
    : "Стоимость уточним после выбора репетитора";

  const heroText = selectedTutor
    ? `Мы зарезервировали ${selectedTutor.name}. При желании можно посмотреть других преподавателей перед оплатой.`
    : "Подтвердите заявку, и мы предложим репетитора по вашим ответам — оплатить урок можно после выбора.";

  const isLoading = submitQuizMutation.isPending;
  const isSuccess = submitQuizMutation.isSuccess;
  const isSubmitDisabled = isLoading || isSuccess || !hasRequiredQuizData;
  const isNoCardPayment = formData.paymentMethod === "no-card";
  const primaryCtaLabel = (() => {
    if (isLoading) return "Отправляем…";
    if (isSuccess) return "Заявка отправлена";
    if (!hasRequiredQuizData) return "Заполните предыдущие шаги";
    return isNoCardPayment ? "Оставить заявку" : "Привязать карту и записаться";
  })();
  const canSwitchTutor = recommendations.length > 1;
  const topTutors = recommendations.slice(0, 6);

  const handleTutorSelect = (id: string) => {
    setSelectedTutorId(id);
    setShowTutorList(false);
  };

  return (
    <QuizLayout>
      <div className="space-y-8 md:space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Шаг 3 · Запись и оплата
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Запись на пробный урок
          </h1>
          <p className="text-base text-slate-600">{heroText}</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
              <div className="space-y-10">
                <section className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-500">
                      Детали запроса
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Пробный урок по {getSubjectDisplay()}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      {formData.grade || "Класс не выбран"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      {getLessonTypeDisplay()}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      Онлайн-формат
                    </span>
                  </div>
                  {(!hasRequiredQuizData || errors.grade || errors.subject) && (
                    <p className="text-sm text-red-600">
                      {[errors.grade, errors.subject].filter(Boolean).length > 0
                        ? [errors.grade, errors.subject]
                            .filter(Boolean)
                            .join(" ")
                        : "Заполните класс и предмет на предыдущих шагах, чтобы продолжить."}
                    </p>
                  )}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Удобное время для пробного урока
                    </label>
                    <select
                      value={formData.preferredTime || ""}
                      onChange={(e) =>
                        updateField("preferredTime", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                    >
                      <option value="">Выберите время</option>
                      <option value="weekday-evening">
                        Ближайший будний вечер
                      </option>
                      <option value="weekend">Ближайшие выходные</option>
                      <option value="discuss">
                        Обсудить время с координатором
                      </option>
                    </select>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Контакты
                    </p>
                    <h3 className="text-xl font-bold text-slate-900">
                      Как с вами связаться?
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Имя родителя
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        value={formData.parentName || ""}
                        onChange={(e) =>
                          updateField("parentName", e.target.value)
                        }
                        placeholder="Например, Наталья"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                      />
                      {errors.parentName && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.parentName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Телефон
                      </label>
                      <input
                        id="parentPhone"
                        ref={phoneInputRef}
                        type="tel"
                        value={formData.parentPhone || ""}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="+7 (___) ___-__-__"
                        maxLength={18}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                      />
                      {errors.parentPhone && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.parentPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      E-mail (опционально)
                    </label>
                    <input
                      type="email"
                      value={formData.parentEmail || ""}
                      onChange={(e) =>
                        updateField("parentEmail", e.target.value)
                      }
                      placeholder="email@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.notificationsEnabled || false}
                      onChange={(e) =>
                        updateField("notificationsEnabled", e.target.checked)
                      }
                      className="h-4 w-4 text-sky-500 focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">
                      Получать напоминания о занятиях в WhatsApp/Telegram
                    </span>
                  </label>
                </section>
              </div>

              <div className="space-y-4">
                {selectedTutor ? (
                  <TutorCard
                    tutor={selectedTutor}
                    isRecommended
                    tone="flat"
                    onChangeClick={
                      canSwitchTutor
                        ? () => setShowTutorList((prev) => !prev)
                        : undefined
                    }
                  />
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
                    Заполните предыдущие шаги, чтобы мы подобрали преподавателя.
                  </div>
                )}

                {showTutorList && canSwitchTutor && (
                  <TutorListPanel
                    tutors={topTutors}
                    activeId={selectedTutorId}
                    onSelect={handleTutorSelect}
                    onClose={() => setShowTutorList(false)}
                  />
                )}
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-500">Оплата</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Подтвердите урок и оплатите
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedTutor
                    ? "Точные дату и время первого урока вы сможете выбрать на следующем шаге."
                    : "После оплаты координатор подберёт преподавателя по вашим ответам."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Способ оплаты
                </label>
                <select
                  value={formData.paymentMethod || ""}
                  onChange={(e) => updateField("paymentMethod", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                >
                  <option value="">Выберите способ оплаты</option>
                  <option value="card-rf">Карта РФ или МИР</option>
                  <option value="card-other">Другая карта</option>
                  <option value="no-card">
                    Без привязки карты (обсудить с координатором)
                  </option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Пробный урок · 50 минут
                    </p>
                    <p className="text-xs text-slate-500">{priceContext}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {lessonPrice}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Промокод</span>
                  {!showPromoCode ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoCode(true)}
                      className="text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700"
                    >
                      Добавить
                    </button>
                  ) : (
                    <input
                      type="text"
                      value={formData.promoCode || ""}
                      onChange={(e) => updateField("promoCode", e.target.value)}
                      placeholder="Введите промокод"
                      className="w-40 rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm outline-none focus:border-sky-500"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Итого к оплате
                    </p>
                    <p className="text-xs text-slate-500">{priceContext}</p>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">
                    {lessonPrice}
                  </p>
                </div>
              </div>

              {errors.submit && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errors.submit}
                </div>
              )}

              {isSuccess && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                </div>
              )}

              {(!hasRequiredQuizData || errors.prerequisite) && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {errors.prerequisite ||
                    "Заполните класс и предмет на предыдущих шагах, чтобы продолжить."}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all ${
                  isSubmitDisabled
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                }`}
              >
                {primaryCtaLabel}
              </button>

              <p className="text-center text-xs text-slate-500">
                Соглашаясь, вы принимаете условия оказания услуг, правила отмены
                занятий и обработку персональных данных.
              </p>
            </div>
          </section>
        </div>

        <FAQ />
      </div>
    </QuizLayout>
  );
}

type TutorListPanelProps = {
  tutors: TutorRecommendation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function TutorListPanel({
  tutors,
  activeId,
  onSelect,
  onClose,
}: TutorListPanelProps) {
  if (tutors.length <= 1) return null;

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Другие репетиторы
          </p>
          <p className="text-xs text-slate-500">
            Топ-{tutors.length} по вашим ответам
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-700"
        >
          Свернуть
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {tutors.map((tutor) => {
          const isActive = tutor.id === activeId;
          return (
            <button
              key={tutor.id}
              type="button"
              onClick={() => onSelect(tutor.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                isActive
                  ? "border-sky-400 bg-white shadow-sm"
                  : "border-transparent bg-white/70 hover:border-sky-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {tutor.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {getSubjectTitle(tutor.subject)} · {tutor.grades.from}–
                    {tutor.grades.to} классы
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(tutor.price)} ₽
                  </p>
                  <p className="text-[11px] text-slate-500">50 мин</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">{tutor.headline}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  {tutor.experienceYears} {pluralYears(tutor.experienceYears)}
                </span>
                {tutor.examFocus.slice(0, 2).map((focus) => (
                  <span
                    key={`${tutor.id}-${focus}`}
                    className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700"
                  >
                    {getExamBadge(focus)}
                  </span>
                ))}
                {isActive && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-sky-600 ring-1 ring-sky-200">
                    Выбран
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function getSubjectTitle(subject?: string) {
  const map: Record<string, string> = {
    math: "Математика",
    russian: "Русский язык",
    english: "Английский язык",
    physics: "Физика",
    chemistry: "Химия",
    biology: "Биология",
    informatics: "Информатика",
    history: "История",
    social: "Обществознание",
  };
  return (subject && map[subject]) || "Предмет";
}

function plural(n: number, one: string, two: string, five: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
}

function pluralYears(n: number) {
  return plural(n, "год", "года", "лет");
}

function getExamBadge(focus: TutorRecommendation["examFocus"][number]) {
  switch (focus) {
    case "ege":
      return "ЕГЭ";
    case "oge":
      return "ОГЭ";
    case "olymp":
      return "Олимпиады";
    case "school":
    default:
      return "Школа";
  }
}

function getFallbackPriceRange(range?: QuizFormData["priceRange"]) {
  const prices = {
    budget: { min: 900, max: 1200 },
    medium: { min: 1200, max: 1700 },
    premium: { min: 1800, max: 2500 },
  } as const;

  const normalized: keyof typeof prices =
    range === "budget" || range === "medium" || range === "premium"
      ? range
      : "medium";

  const current = prices[normalized];
  return `${current.min}–${current.max} ₽`;
}
