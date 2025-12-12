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
  const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const persistedStateRef = useRef<QuizFormData>(getQuizState());

  const submitQuizMutation = trpc.submitQuiz.useMutation();

  useEffect(() => {
    const state = getQuizState();
    const normalized: QuizFormData = {
      ...state,
      priceRange: state.priceRange === "all" ? "any" : state.priceRange,
      notificationChannels:
        state.notificationChannels ||
        (state.notificationsEnabled ? ["whatsapp"] : []),
    };
    setFormData(normalized);
  }, []);

  useEffect(() => {
    const stored = persistedStateRef.current;
    if (
      (!formData.grade || !formData.subject) &&
      (stored.grade || stored.subject)
    ) {
      const merged: QuizFormData = {
        ...formData,
        grade: formData.grade || stored.grade,
        subject: formData.subject || stored.subject,
        subjectOther:
          formData.subjectOther ||
          (formData.subject === "Другое"
            ? formData.subjectOther
            : stored.subjectOther),
      };
      setFormData(merged);
      saveQuizState(merged);
    }
  }, [formData.grade, formData.subject]);

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

  const buildPreferredTimeOptions = () => {
    const options: { value: string; label: string }[] = [];
    const days = formData.scheduleDays || [];
    const hasMorning = days.includes("weekday-morning");
    const hasAfternoon = days.includes("weekday-afternoon");
    const hasEvening = days.includes("weekday-evening");
    const hasWeekend = days.includes("weekend");

    if (hasMorning) {
      options.push({
        value: "weekday-morning",
        label: "Ближайший будний день до обеда",
      });
    }
    if (hasAfternoon) {
      options.push({
        value: "weekday-afternoon",
        label: "Ближайший будний день 16:00–19:00",
      });
    }
    if (hasEvening) {
      options.push({
        value: "weekday-evening",
        label: "Ближайший будний вечер",
      });
    }
    if (hasWeekend) {
      options.push(
        { value: "weekend-morning", label: "Ближайшие выходные утром" },
        { value: "weekend-day", label: "Ближайшие выходные днём" },
      );
    }
    if (hasMorning || hasAfternoon || hasEvening || hasWeekend) {
      options.push({
        value: "next-week",
        label: "Следующая неделя в выбранное время",
      });
    }

    options.push({
      value: "discuss",
      label: "Обсудить время с координатором",
    });

    const deduped = options.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value),
    );

    return deduped.length
      ? deduped
      : [
          { value: "weekday-evening", label: "Ближайший будний вечер" },
          { value: "weekend-day", label: "Ближайшие выходные днём" },
          { value: "discuss", label: "Обсудить время с координатором" },
        ];
  };

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

  const toggleNotificationChannel = (
    channel: "whatsapp" | "telegram" | "sms",
    checked: boolean,
  ) => {
    const current = formData.notificationChannels || [];
    const next = checked
      ? Array.from(new Set([...current, channel]))
      : current.filter((item) => item !== channel);
    updateField("notificationChannels", next);
  };

  const preferredTimeOptions = useMemo(
    () => buildPreferredTimeOptions(),
    [formData.scheduleDays],
  );

  useEffect(() => {
    if (!preferredTimeOptions.length) return;
    const hasCurrent = preferredTimeOptions.some(
      (option) => option.value === formData.preferredTime,
    );
    if (hasCurrent) return;
    const fallback =
      preferredTimeOptions.find(
        (option) => option.value === "weekday-evening",
      ) || preferredTimeOptions[0];
    if (fallback) {
      updateField("preferredTime", fallback.value);
    }
  }, [preferredTimeOptions, formData.preferredTime]);

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

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.parentName?.trim()) {
      nextErrors.parentName = "Укажите имя";
    }
    if (
      !formData.parentPhone?.trim() ||
      !PHONE_PATTERN.test(formData.parentPhone)
    ) {
      nextErrors.parentPhone = "Введите номер в формате +7 (999) 123-45-67";
    }
    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Выберите способ оплаты";
    }
    if (
      formData.parentEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)
    ) {
      nextErrors.parentEmail = "Введите корректный e-mail";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const quizData = {
      name: formData.parentName || "",
      phone: formData.parentPhone || "",
      grade: formData.grade || persistedStateRef.current.grade || "",
      subject:
        (formData.subject || persistedStateRef.current.subject) === "Другое"
          ? formData.subjectOther ||
            persistedStateRef.current.subjectOther ||
            ""
          : formData.subject || persistedStateRef.current.subject || "",
      goal: formData.goals?.join(", ") || "",
      frequency: formData.frequency || "",
      timeSlots: formData.scheduleDays || [],
      preferredTime: formData.preferredTime || "",
      style: formData.teachingStyle?.join(", ") || "",
      comment: formData.additionalComment || "",
      notifications: formData.notificationChannels || [],
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
    const subjectCandidate =
      formData.subject || persistedStateRef.current.subject || "";
    const subjectOtherCandidate =
      formData.subjectOther || persistedStateRef.current.subjectOther || "";

    if (subjectCandidate === "Другое" && subjectOtherCandidate) {
      return subjectOtherCandidate;
    }
    return subjectCandidate || "—";
  };

  const getGradeDisplay = () =>
    formData.grade || persistedStateRef.current.grade || "Класс не выбран";

  const getLessonTypeDisplay = () => {
    return "Индивидуальные";
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

  const priceDisplayMap: Record<string, string> = {
    budget: "Недорогие (900–1200 ₽)",
    medium: "Оптимальный баланс (1200–1700 ₽)",
    premium: "Максимальный результат (1800–2500 ₽)",
    any: "Рассмотреть все варианты",
  };

  const getPriceRangeDisplay = () => {
    if (formData.priceRange && priceDisplayMap[formData.priceRange]) {
      return priceDisplayMap[formData.priceRange];
    }
    return fallbackPrice ? `~${fallbackPrice}` : "—";
  };

  const heroText = selectedTutor
    ? `Мы зарезервировали ${selectedTutor.name}. При желании можно посмотреть других преподавателей перед оплатой.`
    : "Подтвердите заявку, и мы предложим репетитора по вашим ответам — оплатить урок можно после выбора.";

  const isLoading = submitQuizMutation.isPending;
  const isSuccess = submitQuizMutation.isSuccess;
  const isSubmitDisabled =
    isLoading ||
    isSuccess ||
    !formData.parentName?.trim() ||
    !PHONE_PATTERN.test(formData.parentPhone || "") ||
    !formData.paymentMethod;
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
                      {getGradeDisplay()}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      {getLessonTypeDisplay()}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                      Онлайн-формат
                    </span>
                  </div>
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
                      <option value="">Выберите удобное время</option>
                      {preferredTimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
                        Имя родителя или ученика
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Если ребёнку больше 16, можно указать его имя.
                      </p>
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
                        Номер телефона
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Формат: +7 (999) 123-45-67
                      </p>
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
                      E-mail для чеков (необязательно)
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
                    {errors.parentEmail && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.parentEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Получать напоминания о занятиях
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "whatsapp", label: "WhatsApp" },
                        { value: "telegram", label: "Telegram" },
                        { value: "sms", label: "SMS" },
                      ].map((option) => {
                        const checked =
                          formData.notificationChannels?.includes(
                            option.value as "whatsapp" | "telegram" | "sms",
                          ) || false;
                        return (
                          <label
                            key={option.value}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                              checked
                                ? "border-sky-500 bg-sky-50 text-slate-900"
                                : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                toggleNotificationChannel(
                                  option.value as
                                    | "whatsapp"
                                    | "telegram"
                                    | "sms",
                                  e.target.checked,
                                )
                              }
                              className="sr-only"
                            />
                            <span
                              aria-hidden
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border text-white ${
                                checked
                                  ? "border-sky-600 bg-sky-600"
                                  : "border-slate-300 bg-white text-transparent"
                              }`}
                            >
                              <svg
                                viewBox="0 0 20 20"
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.3}
                              >
                                <path
                                  d="M5 11l3 3 7-8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Ваш репетитор
                  </h3>
                  {selectedTutor && (
                    <span className="text-xs font-semibold text-slate-500">
                      рекомендован сервисом
                    </span>
                  )}
                </div>
                {selectedTutor ? (
                  <TutorCard
                    tutor={selectedTutor}
                    isRecommended
                    tone="flat"
                    badgeLabel="рекомендован сервисом"
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
                    ? `Мы зарезервируем ${selectedTutor.name} сразу после оплаты.`
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

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`w-full rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all ${
                  isSubmitDisabled
                    ? "cursor-not-allowed bg-slate-400 opacity-80"
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                }`}
              >
                {isLoading
                  ? "Отправляем…"
                  : isSuccess
                    ? "Заявка отправлена"
                    : "Подтвердить запись и перейти к оплате"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Вы сможете бесплатно перенести или отменить пробный урок, если
                предупредите минимум за 12 часов.
              </p>
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
    any: { min: 900, max: 2500 },
  } as const;

  const normalized: keyof typeof prices =
    range === "budget" ||
    range === "medium" ||
    range === "premium" ||
    range === "any"
      ? range
      : "medium";

  const current = prices[normalized];
  return `${current.min}–${current.max} ₽`;
}
