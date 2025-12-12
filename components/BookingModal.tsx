"use client";

import { useEffect, useMemo, useState } from "react";

export type BookingSelection = {
  dateISO: string;
  time: string; // HH:mm
  startAtISO?: string;
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selection: BookingSelection) => void;
  initialSelection?: BookingSelection | null;
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

export function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelection,
  dayCount = 7,
  slotStartHour = 10,
  slotEndHour = 21,
  slotStepMinutes = 30,
  sameDayBufferMinutes = 60,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
    setSelectedDate(initialSelection?.dateISO || null);
    setSelectedTime(initialSelection?.time || null);
  }, [initialSelection, isOpen]);

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
    const nowMs = today.getTime();
    const selectedDateObj =
      selectedDate && new Date(`${selectedDate}T00:00:00`);
    const isToday =
      selectedDateObj &&
      today.toDateString() === selectedDateObj.toDateString();

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
        const slotDate = new Date(selectedDateObj);
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

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = new Date(`${selectedDate}T00:00:00`);
    startDate.setHours(hours, minutes, 0, 0);

    onConfirm({
      dateISO: selectedDate,
      time: selectedTime,
      startAtISO: startDate.toISOString(),
    });
    onClose();
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
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Выберите время
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Выберите день
              </h2>
              {rangeLabel && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {rangeLabel}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Сначала выберите дату, затем время. Пробный урок — 30 минут.
            </p>
          </div>

          <div className="space-y-4">
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
                  Длительность пробного урока — 30 минут.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Доступны слоты с {slotStartHour}:00 до {slotEndHour}:00
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

          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-700">
              {selectedDate && selectedTime ? (
                <>
                  Вы выбрали:{" "}
                  <strong>
                    {formatSelectedDate(selectedDate)}, {selectedTime}
                  </strong>
                </>
              ) : (
                "Выберите дату и время пробного урока"
              )}
            </div>
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
                disabled={!selectedDate || !selectedTime}
                className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition shadow-md ${
                  !selectedDate || !selectedTime
                    ? "cursor-not-allowed bg-sky-300"
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg"
                }`}
              >
                Подтвердить время
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    return {
      date,
      dateISO: date.toISOString().slice(0, 10),
      label: {
        weekday: (getPart("weekday") || "").replace(".", ""),
        day: getPart("day") || "",
        month: (getPart("month") || "").replace(".", ""),
      },
    };
  });
}

function formatSelectedDate(dateISO: string) {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "")
    .replace(".", "");
}
