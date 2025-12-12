"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CabinetPage() {
  return (
    <Suspense fallback={<CabinetLoading />}>
      <CabinetContent />
    </Suspense>
  );
}

function CabinetLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-slate-400">Загрузка...</div>
    </div>
  );
}

function CabinetContent() {
  const params = useSearchParams();
  const [stored, setStored] = useState<{
    tutor?: string | null;
    subject?: string | null;
    grade?: string | null;
    booking?: { dateISO: string; time: string; startAtISO?: string } | null;
    contacts?: { name: string; phone: string; email?: string } | null;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cabinet-latest");
      if (raw) {
        setStored(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const tutor = stored?.tutor || params.get("tutor") || "Уточняется";
  const subject = stored?.subject || params.get("subject") || "Уточняется";
  const grade = stored?.grade || params.get("grade") || "—";
  const date = stored?.booking?.dateISO || params.get("date");
  const time = stored?.booking?.time || params.get("time");
  const contacts = stored?.contacts;

  const bookingLabel = date || time ? formatBooking(date, time) : "Уточняется";

  const details = [
    { label: "Предмет", value: subject },
    { label: "Класс", value: grade },
    { label: "Репетитор", value: tutor },
    { label: "Время пробного урока", value: bookingLabel },
    { label: "Длительность", value: "30 минут (бесплатно)" },
    {
      label: "Контакт",
      value: contacts?.name || "—",
    },
    {
      label: "Телефон",
      value: contacts?.phone || "—",
    },
    {
      label: "Email",
      value: contacts?.email || "—",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Личный кабинет
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Мы получили вашу заявку на вводный урок
            </h1>
            <p className="text-base text-slate-600">
              В ближайшее время координатор подтвердит время и пришлёт детали.
              Напоминания придут по выбранным каналам.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Статус заявки
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Бронирование пробного урока
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  В обработке
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Мы закрепим время урока и подтвердим преподавателя. Если нужно
                срочно изменить время или предмет — напишите координатору в
                ответ на сообщение.
              </p>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Вы выбрали</p>
                <p className="mt-1">
                  {bookingLabel} · пробный урок 30 минут · преподаватель:{" "}
                  {tutor}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Вернуться на главную
                </Link>
                <a
                  href="mailto:hello@yasno.school"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-cyan-600 hover:shadow-lg"
                >
                  Связаться с координатором
                </a>
              </div>
            </section>

            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Детали</h3>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Пробный 30 мин
                </span>
              </div>
              <dl className="space-y-3 text-sm">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-baseline justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <dt className="text-slate-500">{detail.label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatBooking(date?: string | null, time?: string | null) {
  if (!date && !time) return "Уточняется";
  const formattedDate = date
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        weekday: "short",
      })
        .format(new Date(`${date}T00:00:00`))
        .replace(".", "")
    : "";
  return [formattedDate, time].filter(Boolean).join(" · ");
}
