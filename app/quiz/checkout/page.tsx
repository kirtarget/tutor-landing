"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingAndContactModal } from "@/components/BookingAndContactModal";
import { FAQ } from "@/components/FAQ";
import { QuizLayout } from "@/components/QuizLayout";
import { TutorPickerModal } from "@/components/TutorPickerModal";
import { TutorWideCard } from "@/components/TutorWideCard";
import {
  clearQuizState,
  getQuizState,
  saveQuizState,
  type QuizFormData,
} from "@/lib/quiz-state";
import {
  mapQuizToAnswers,
  matchTutors,
  type TutorRecommendation,
} from "@/lib/tutor-matcher";
import { trpc } from "@/trpc/client";

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuizFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTutorPicker, setShowTutorPicker] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [recommendations, setRecommendations] = useState<TutorRecommendation[]>(
    [],
  );
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
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
      selectedTutorId: state.selectedTutorId,
    };
    persistedStateRef.current = normalized;
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
      persistedStateRef.current = merged;
      setFormData(merged);
      saveQuizState(merged);
    }
  }, [formData.grade, formData.subject]);

  useEffect(() => {
    const mergedState: QuizFormData = {
      ...persistedStateRef.current,
      ...formData,
    };

    const answers = mapQuizToAnswers(mergedState);
    const matched = matchTutors(answers, 10);
    setRecommendations(matched);
    setSelectedTutorId((current) => {
      const persisted = mergedState.selectedTutorId;
      const candidate = persisted || current;
      if (candidate && matched.some((tutor) => tutor.id === candidate)) {
        return candidate;
      }
      return matched[0]?.id ?? null;
    });
  }, [formData]);

  useEffect(() => {
    if (recommendations.length <= 1) {
      setShowTutorPicker(false);
    }
  }, [recommendations]);

  const updateField = (field: keyof QuizFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    persistedStateRef.current = updated;
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

  const selectedTutor = useMemo(
    () => recommendations.find((tutor) => tutor.id === selectedTutorId) ?? null,
    [recommendations, selectedTutorId],
  );

  const handleTutorSelect = (id: string) => {
    setSelectedTutorId(id);
    updateField("selectedTutorId", id);
    setShowTutorPicker(false);
  };

  const handleBookingSubmit = ({
    booking,
    contacts,
  }: {
    booking: { dateISO: string; time: string; startAtISO?: string };
    contacts: {
      name: string;
      phone: string;
      email?: string;
      reminders?: ("whatsapp" | "telegram" | "sms")[];
    };
  }) => {
    updateField("booking", booking);
    updateField("parentName", contacts.name);
    updateField("parentPhone", contacts.phone);
    updateField("parentEmail", contacts.email || "");
    updateField("notificationChannels", contacts.reminders || []);
    submit(booking, contacts);
  };

  const buildPayload = (
    booking: { dateISO: string; time: string; startAtISO?: string },
    contacts: {
      name: string;
      phone: string;
      email?: string;
      reminders?: ("whatsapp" | "telegram" | "sms")[];
    },
  ) => {
    const subjectValue =
      (formData.subject || persistedStateRef.current.subject) === "Другое"
        ? formData.subjectOther || persistedStateRef.current.subjectOther || ""
        : formData.subject || persistedStateRef.current.subject || "";

    return {
      name: contacts.name,
      phone: contacts.phone,
      email: contacts.email,
      grade: formData.grade || persistedStateRef.current.grade || "",
      subject: subjectValue,
      goal: formData.goals?.join(", ") || "",
      frequency: formData.frequency || "",
      timeSlots: formData.scheduleDays || [],
      style: formData.teachingStyle?.join(", ") || "",
      comment: formData.additionalComment || "",
      notifications: contacts.reminders || [],
      bookingDate: booking.dateISO,
      bookingTime: booking.time,
      bookingStartAt: booking.startAtISO || "",
      selectedTutorId: selectedTutor?.id,
      tutorName: selectedTutor?.name,
      tutorPrice: selectedTutor?.price,
      tutorSubject: selectedTutor?.subject,
    };
  };

  const persistCabinetData = (
    booking: { dateISO: string; time: string; startAtISO?: string },
    contacts: { name: string; phone: string; email?: string },
  ) => {
    try {
      const data = {
        tutor: selectedTutor?.name,
        subject:
          formData.subject ||
          persistedStateRef.current.subject ||
          formData.subjectOther ||
          persistedStateRef.current.subjectOther,
        grade: formData.grade || persistedStateRef.current.grade,
        booking,
        contacts,
      };
      localStorage.setItem("cabinet-latest", JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to persist cabinet data", e);
    }
  };

  const submit = (
    booking: { dateISO: string; time: string; startAtISO?: string },
    contacts: {
      name: string;
      phone: string;
      email?: string;
      reminders?: string[];
    },
  ) => {
    const payload = buildPayload(booking, contacts);
    submitQuizMutation.mutate(payload, {
      onSuccess: () => {
        clearQuizState();
        persistCabinetData(booking, contacts);
        const params = new URLSearchParams();
        params.set("date", booking.dateISO);
        params.set("time", booking.time);
        if (selectedTutor?.name) params.set("tutor", selectedTutor.name);
        if (formData.subject || persistedStateRef.current.subject) {
          params.set("subject", getSubjectDisplay());
        }
        if (formData.grade || persistedStateRef.current.grade) {
          params.set("grade", getGradeDisplay());
        }
        router.push(
          `/cabinet${params.toString() ? `?${params.toString()}` : ""}`,
        );
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

  const heroText = selectedTutor
    ? `Мы зарезервировали ${selectedTutor.name}. Нажмите «Записаться на вводный урок» и выберите время.`
    : "Выберите преподавателя и запишитесь на бесплатный вводный урок на 30 минут.";

  const canSwitchTutor = recommendations.length > 1;
  const topTutors = recommendations.slice(0, 8);

  return (
    <QuizLayout>
      <TutorPickerModal
        isOpen={showTutorPicker}
        tutors={topTutors}
        activeId={selectedTutorId}
        onSelect={handleTutorSelect}
        onClose={() => setShowTutorPicker(false)}
      />

      <BookingAndContactModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookingSubmit}
        initialBooking={formData.booking}
        initialContacts={{
          name: formData.parentName || "",
          phone: formData.parentPhone || "",
          email: formData.parentEmail || "",
          reminders: formData.notificationChannels || [],
        }}
        dayCount={7}
        slotStartHour={10}
        slotEndHour={21}
        slotStepMinutes={30}
        sameDayBufferMinutes={60}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 py-6 md:py-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Шаг 3 · Запись
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Вводный урок с преподавателем
          </h1>
          <p className="text-base text-slate-600">{heroText}</p>
        </header>

        {selectedTutor ? (
          <TutorWideCard
            tutor={selectedTutor}
            badgeLabel="рекомендован сервисом"
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Заполните предыдущие шаги, чтобы мы подобрали преподавателя.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowTutorPicker(true)}
            disabled={!canSwitchTutor}
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              canSwitchTutor
                ? "border-slate-300 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700"
                : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            }`}
          >
            Подобрать другого
          </button>
          <button
            type="button"
            onClick={() => setShowBookingModal(true)}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl hover:scale-105 active:scale-100"
          >
            Записаться на вводный урок
          </button>
        </div>

        {errors.submit && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <FAQ />
      </div>
    </QuizLayout>
  );
}
