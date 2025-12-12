"use client";

import type { TutorCard as Tutor } from "@/types/tutor";

type TutorWideCardProps = {
  tutor: Tutor;
  badgeLabel?: string;
};

export function TutorWideCard({ tutor, badgeLabel }: TutorWideCardProps) {
  const subjectLabel = getSubjectLabel(tutor.subject);
  const examLabel = getExamLabel(tutor.examFocus);
  const styleLabels = getStyleLabels(tutor.styles);
  const priceFormatted = formatPrice(tutor.price);

  return (
    <article className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_50px_rgba(15,23,42,0.12)] md:p-8 lg:p-10">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 ring-1 ring-sky-100">
          Вводный урок — 30 минут
        </span>
        {badgeLabel && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="flex gap-4">
          <AvatarPlaceholder name={tutor.name} />
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {tutor.name}
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              {subjectLabel} · {tutor.grades.from}–{tutor.grades.to} классы
            </p>
            <p className="text-sm text-slate-700">{tutor.headline}</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
              <FactPill>
                {tutor.experienceYears}{" "}
                {plural(tutor.experienceYears, "год", "года", "лет")} опыта
              </FactPill>
              <FactPill>{tutor.studentsCount}+ учеников</FactPill>
              {examLabel && <FactPill>{examLabel}</FactPill>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {tutor.about}
          </p>
          <p className="text-sm text-slate-500">{tutor.personal}</p>

          {styleLabels.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Стиль занятий
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {styleLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-baseline justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                Стоимость онлайн-урока
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-slate-500 line-through">
                  {priceFormatted} ₽
                </span>
                <span className="text-xl font-extrabold text-emerald-600">
                  Бесплатно
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Вводный урок 30 минут
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-[0_14px_30px_rgba(14,165,233,0.35)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-extrabold">{initials}</span>
      </div>
    </div>
  );
}

const FactPill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200 shadow-sm">
    {children}
  </span>
);

function getSubjectLabel(subject: Tutor["subject"]): string {
  const map: Record<Tutor["subject"], string> = {
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
  return map[subject] || "Предмет";
}

function getExamLabel(examFocus: Tutor["examFocus"]): string | null {
  if (examFocus.includes("ege") && examFocus.includes("oge"))
    return "ОГЭ и ЕГЭ";
  if (examFocus.includes("ege")) return "ЕГЭ";
  if (examFocus.includes("oge")) return "ОГЭ";
  if (examFocus.includes("olymp")) return "Олимпиады";
  if (examFocus.includes("school")) return "Школьная программа";
  return null;
}

function getStyleLabels(styles: Tutor["styles"]): string[] {
  const map: Record<Tutor["styles"][number], string> = {
    calm: "Спокойный",
    strict: "Требовательный",
    fast: "Быстрый темп",
    explain: "Много объяснений",
    supportive: "Поддерживающий",
  };
  return styles.map((style) => map[style]).filter(Boolean);
}

function plural(n: number, one: string, two: string, five: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}
