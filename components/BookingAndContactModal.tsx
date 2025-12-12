"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type BookingSelection = {
  dateISO: string;
  time: string; // HH:mm
  startAtISO?: string;
};

export type ContactInfo = {
  name: string;
  phone: string;
  email?: string;
  reminders?: ("whatsapp" | "telegram" | "sms")[];
};

type BookingAndContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    booking: BookingSelection;
    contacts: ContactInfo;
  }) => void;
  initialBooking?: BookingSelection | null;
  initialContacts?: ContactInfo | null;
  dayCount?: number;
  slotStartHour?: number;
  slotEndHour?: number;
  slotStepMinutes?: number;
  sameDayBufferMinutes?: number;
};

type DayOption = {
  date: Date;
  dateISO: string;
  label: {
    weekday: string;
    day: string;
    month: string;
  };
};

type TimeOption = {
  label: string;
  value: string; // HH:mm
  disabled: boolean;
};

export function BookingAndContactModal({
  isOpen,
  onClose,
  onSubmit,
  initialBooking,
  initialContacts,
  dayCount = 7,
  slotStartHour = 10,
  slotEndHour = 21,
  slotStepMinutes = 30,
  sameDayBufferMinutes = 60,
}: BookingAndContactModalProps) {
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactInfo>({
    name: initialContacts?.name || "",
    phone: initialContacts?.phone || "",
    email: initialContacts?.email || "",
    reminders: initialContacts?.reminders || [],
  });
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setSelectedDate(initialBooking?.dateISO || null);
    setSelectedTime(initialBooking?.time || null);
    setContacts({
      name: initialContacts?.name || "",
      phone: initialContacts?.phone || "",
      email: initialContacts?.email || "",
      reminders: initialContacts?.reminders || [],
    });
  }, [initialBooking, initialContacts, isOpen]);

  const dayOptions = useMemo(() => buildDayOptions(dayCount), [dayCount]);
  const rangeLabel = useMemo(() => {
    if (dayOptions.length < 2) return "";
    const first = dayOptions[0].date;
    const last = dayOptions[dayOptions.length - 1].date;
    const format = new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    return `${format.format(first)} - ${format.format(last)}`;
  }, [dayOptions]);

  const timeOptions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nowMs = Date.now();
    const selectedDateObj = selectedDate && toLocalDate(selectedDate);
    const isToday =
      selectedDateObj && today.getTime() === selectedDateObj.getTime();

    const bufferMs = sameDayBufferMinutes * 60 * 1000;
    const firstAllowedToday = nowMs + bufferMs;

    const options: TimeOption[] = [];
    for (
      let minutes = slotStartHour * 60;
      minutes <= slotEndHour * 60;
      minutes += slotStepMinutes
    ) {
      const hours = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
      const mins = (minutes % 60).toString().padStart(2, "0");
      const value = `${hours}:${mins}`;

      let disabled = false;
      if (isToday && selectedDateObj) {
        const slotDate = new Date(selectedDateObj.getTime());
        slotDate.setHours(Number(hours), Number(mins), 0, 0);
        disabled = slotDate.getTime() < firstAllowedToday;
      }

      options.push({
        label: value,
        value,
        disabled,
      });
    }
    return options;
  }, [
    selectedDate,
    sameDayBufferMinutes,
    slotEndHour,
    slotStartHour,
    slotStepMinutes,
  ]);

  const isBookingValid = Boolean(selectedDate && selectedTime);
  const isContactsValid =
    contacts.name.trim().length > 0 && PHONE_PATTERN.test(contacts.phone || "");

  const handleConfirm = () => {
    if (!isBookingValid || !isContactsValid) return;

    const [hours, minutes] = (selectedTime || "00:00").split(":").map(Number);
    const startDate = toLocalDate(selectedDate!);
    startDate.setHours(hours, minutes, 0, 0);

    onSubmit({
      booking: {
        dateISO: selectedDate!,
        time: selectedTime!,
        startAtISO: startDate.toISOString(),
      },
      contacts,
    });
    onClose();
  };

  const handlePhoneChange = (value: string) => {
    setContacts((prev) => ({ ...prev, phone: formatPhoneNumber(value) }));
  };

  const toggleReminder = (
    channel: "whatsapp" | "telegram" | "sms",
    checked: boolean,
  ) => {
    setContacts((prev) => {
      const current = prev.reminders || [];
      const next = checked
        ? Array.from(new Set([...current, channel]))
        : current.filter((item) => item !== channel);
      return { ...prev, reminders: next };
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-[22px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
        >
          ×
        </button>

        <div className="space-y-8 px-6 pb-8 pt-7 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Вводный урок — 30 минут
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {step === 0 ? "Выберите дату и время" : "Контакты для связи"}
              </h2>
              <p className="text-sm text-slate-500">
                {step === 0
                  ? "Сегодня доступен, слоты каждые 30 минут"
                  : "Нужны для подтверждения бронирования"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <StepDot active={step === 0}>1</StepDot>
              <span className="text-slate-400">→</span>
              <StepDot active={step === 1}>2</StepDot>
            </div>
          </div>

          {step === 0 ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Выберите день
                  </h3>
                  {rangeLabel && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {rangeLabel}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                  {dayOptions.map((day) => {
                    const isActive = day.dateISO === selectedDate;
                    return (
                      <button
                        key={day.dateISO}
                        type="button"
                        onClick={() => setSelectedDate(day.dateISO)}
                        className={`flex flex-col items-center rounded-2xl border p-3 text-center transition ${
                          isActive
                            ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {day.label.weekday}
                        </span>
                        <span className="text-2xl font-extrabold">
                          {day.label.day}
                        </span>
                        <span className="text-xs text-slate-500">
                          {day.label.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      В какое время?
                    </h3>
                    <p className="text-sm text-slate-500">
                      Длительность вводного урока — 30 минут.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Доступно {slotStartHour}:00 – {slotEndHour}:00
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {timeOptions.map((slot) => {
                    const isActive = slot.value === selectedTime;
                    const isDisabled = slot.disabled || !selectedDate;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(slot.value)}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50/70"
                        } ${
                          isDisabled
                            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                            : ""
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {isBookingValid ? (
                  <>
                    <span>
                      Вы выбрали: {formatSelectedDate(selectedDate!)},{" "}
                      {selectedTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                      className="text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-700"
                    >
                      Сбросить
                    </button>
                  </>
                ) : (
                  <span>Выберите дату и время вводного урока</span>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  disabled={!isBookingValid}
                  onClick={() => setStep(1)}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition shadow-md ${
                    !isBookingValid
                      ? "cursor-not-allowed bg-sky-300"
                      : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg"
                  }`}
                >
                  Далее
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Имя родителя или ученика
                  </label>
                  <input
                    type="text"
                    value={contacts.name}
                    onChange={(e) =>
                      setContacts((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Например, Наталья"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Телефон
                  </label>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={contacts.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="+7 (___) ___-__-__"
                    maxLength={18}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  value={contacts.email || ""}
                  onChange={(e) =>
                    setContacts((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Напоминания (опционально)
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "whatsapp", label: "WhatsApp" },
                    { value: "telegram", label: "Telegram" },
                    { value: "sms", label: "SMS" },
                  ].map((option) => {
                    const checked = contacts.reminders?.includes(
                      option.value as "whatsapp" | "telegram" | "sms",
                    );
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
                            toggleReminder(
                              option.value as "whatsapp" | "telegram" | "sms",
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

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Назад к выбору времени
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!isContactsValid}
                    className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition shadow-md ${
                      !isContactsValid
                        ? "cursor-not-allowed bg-sky-300"
                        : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg"
                    }`}
                  >
                    Подтвердить запись
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepDot({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
        active ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}

function buildDayOptions(count: number): DayOption[] {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: Math.max(1, count) }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => parts.find((p) => p.type === type)?.value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateISO = `${year}-${month}-${day}`;
    return {
      date,
      dateISO,
      label: {
        weekday: (getPart("weekday") || "").replace(".", ""),
        day: getPart("day") || "",
        month: (getPart("month") || "").replace(".", ""),
      },
    };
  });
}

function formatSelectedDate(dateISO: string) {
  const date = toLocalDate(dateISO);
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function toLocalDate(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function formatPhoneNumber(value: string) {
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
}
