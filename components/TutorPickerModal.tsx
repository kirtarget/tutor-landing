"use client";

import type { TutorRecommendation } from "@/lib/tutor-matcher";

type TutorPickerModalProps = {
  isOpen: boolean;
  tutors: TutorRecommendation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function TutorPickerModal({
  isOpen,
  tutors,
  activeId,
  onSelect,
  onClose,
}: TutorPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="relative h-full w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Выбор преподавателя
            </p>
            <h3 className="text-lg font-bold text-slate-900">
              Подобрать другого
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 p-5">
          {tutors.map((tutor) => {
            const isActive = tutor.id === activeId;
            return (
              <button
                key={tutor.id}
                type="button"
                onClick={() => {
                  onSelect(tutor.id);
                  onClose();
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-sky-400 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={tutor.name} />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {tutor.name}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {tutor.headline}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(tutor.price)} ₽
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {tutor.experienceYears}{" "}
                      {plural(tutor.experienceYears, "год", "года", "лет")}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
                  {tutor.examFocus.slice(0, 2).map((focus) => (
                    <span
                      key={`${tutor.id}-${focus}`}
                      className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700"
                    >
                      {getExamBadge(focus)}
                    </span>
                  ))}
                  {isActive && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-100">
                      Выбран
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          {tutors.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Другие варианты недоступны.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
      {initials}
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function plural(n: number, one: string, two: string, five: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
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
