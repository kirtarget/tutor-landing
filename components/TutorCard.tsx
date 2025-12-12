"use client";

import * as React from "react";
import type { TutorCard as TutorCardType } from "@/types/tutor";

type TutorCardProps = {
  tutor: TutorCardType;
  isRecommended?: boolean;
  onChangeClick?: () => void;
  tone?: "raised" | "flat";
  badgeLabel?: string;
  showFreeTrial?: boolean;
  trialDurationMinutes?: number;
};

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  isRecommended = false,
  onChangeClick,
  tone = "raised",
  badgeLabel,
  showFreeTrial = false,
  trialDurationMinutes = 30,
}) => {
  const {
    name,
    subject,
    grades,
    price,
    experienceYears,
    studentsCount,
    examFocus,
    headline,
    about,
    personal,
    styles,
    avatarTheme,
  } = tutor;

  const subjectLabel = getSubjectLabel(subject);
  const examLabel = getExamLabel(examFocus);
  const styleLabels = getStyleLabels(styles);
  const priceFormatted = formatPrice(price);

  const surfaceClass =
    tone === "raised"
      ? "relative overflow-hidden rounded-3xl border border-transparent bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
      : "relative overflow-hidden rounded-3xl border border-slate-200 bg-white";

  return (
    <aside className="w-full">
      <div className={surfaceClass}>
        <TutorPhoto
          name={name}
          subjectLabel={subjectLabel}
          grades={grades}
          theme={avatarTheme}
          showBadge={isRecommended}
          badgeLabel={badgeLabel}
        />

        <div className="space-y-4 px-6 pb-6 pt-4">
          <p className="text-sm font-semibold text-slate-900">{headline}</p>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <Badge>
              {experienceYears} {plural(experienceYears, "год", "года", "лет")}{" "}
              опыта
            </Badge>
            <Badge>{studentsCount}+ учеников</Badge>
            {examLabel && <Badge>{examLabel}</Badge>}
          </div>

          <div className="space-y-1 text-xs text-slate-700">
            <p>{about}</p>
            <p className="text-slate-500">{personal}</p>
          </div>

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

          <div className="flex items-baseline justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                Стоимость онлайн-урока
              </span>
              {showFreeTrial ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-slate-500 line-through">
                    {priceFormatted} ₽
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600">
                    Бесплатно
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold text-slate-900">
                  {priceFormatted} ₽
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {showFreeTrial
                ? `Пробный урок · ${trialDurationMinutes} минут`
                : "30 минут · онлайн"}
            </span>
          </div>
          {showFreeTrial ? (
            <p className="text-[11px] text-slate-600">
              Пробный урок бесплатный и длится {trialDurationMinutes} минут.
              После бронирования координатор свяжется с вами.
            </p>
          ) : (
            <p className="text-[11px] text-slate-500">
              Стоимость пробного урока такая же, как обычного занятия.
            </p>
          )}

          {onChangeClick && (
            <button
              type="button"
              onClick={onChangeClick}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700"
            >
              Посмотреть других репетиторов
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

type TutorPhotoProps = {
  name: string;
  subjectLabel: string;
  grades: TutorCardType["grades"];
  theme: TutorCardType["avatarTheme"];
  showBadge: boolean;
  badgeLabel?: string;
};

const TutorPhoto: React.FC<TutorPhotoProps> = ({
  name,
  subjectLabel,
  grades,
  theme,
  showBadge,
  badgeLabel,
}) => {
  const palette = photoPalette[theme];
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${palette.bg} px-6 pb-6 pt-6 text-white`}
    >
      {showBadge && (
        <span className="absolute left-6 top-6 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {badgeLabel || "Рекомендован"}
        </span>
      )}

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end">
        <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-[26px] bg-white/15 shadow-[0_20px_40px_rgba(15,23,42,0.25)]">
          <svg
            viewBox="0 0 320 320"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`portrait-${theme}`}
                x1="0"
                x2="1"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect width="320" height="320" fill={palette.overlay} />
            <circle cx="230" cy="90" r="50" fill="rgba(255,255,255,0.15)" />
            <circle cx="90" cy="210" r="80" fill="rgba(255,255,255,0.12)" />
            <path
              d="M60 280C90 230 130 205 180 205C230 205 270 230 300 280"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="160" cy="130" r="60" fill="rgba(255,255,255,0.18)" />
            <rect
              x="40"
              y="40"
              width="240"
              height="240"
              rx="120"
              fill={`url(#portrait-${theme})`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <span className="text-5xl font-semibold tracking-tight">
              {initials}
            </span>
            <span className="mt-2 text-xs font-medium uppercase tracking-[0.4em] text-white/70">
              online
            </span>
          </div>
        </div>

        <div className="flex-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Ваш репетитор
          </p>
          <p className="text-2xl font-semibold leading-snug">{name}</p>
          <p className="text-sm text-white/80">
            {subjectLabel} · {grades.from}–{grades.to} классы
          </p>
        </div>
      </div>
    </div>
  );
};

const photoPalette: Record<
  TutorCardType["avatarTheme"],
  { bg: string; overlay: string }
> = {
  blue: { bg: "from-sky-500 via-cyan-500 to-blue-600", overlay: "#0ea5e9" },
  green: {
    bg: "from-emerald-400 via-emerald-500 to-teal-600",
    overlay: "#10b981",
  },
  orange: {
    bg: "from-orange-400 via-amber-500 to-rose-500",
    overlay: "#fb923c",
  },
  purple: {
    bg: "from-fuchsia-500 via-violet-500 to-sky-500",
    overlay: "#a855f7",
  },
};

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-white/60">
    {children}
  </span>
);

function getSubjectLabel(subject: TutorCardType["subject"]): string {
  switch (subject) {
    case "math":
      return "математике";
    case "russian":
      return "русскому языку";
    case "english":
      return "английскому языку";
    case "physics":
      return "физике";
    case "chemistry":
      return "химии";
    case "biology":
      return "биологии";
    case "informatics":
      return "информатике";
    case "history":
      return "истории";
    case "social":
      return "обществознанию";
    default:
      return "предмету";
  }
}

function getExamLabel(examFocus: TutorCardType["examFocus"]): string | null {
  if (examFocus.includes("ege") && examFocus.includes("oge")) {
    return "ОГЭ и ЕГЭ";
  }
  if (examFocus.includes("ege")) return "ЕГЭ";
  if (examFocus.includes("oge")) return "ОГЭ";
  if (examFocus.includes("olymp")) return "олимпиады";
  if (examFocus.includes("school")) return "Школьная программа";
  return null;
}

function getStyleLabels(styles: TutorCardType["styles"]): string[] {
  const map: Record<TutorCardType["styles"][number], string> = {
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
