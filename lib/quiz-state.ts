// Утилита для управления состоянием квиза между страницами
"use client";

export type QuizFormData = {
  // Страница 1 - Запрос
  lessonType?: "individual" | "mini-group" | "not-sure";
  grade?: string;
  subject?: string;
  subjectOther?: string;
  goals?: string[]; // массив выбранных целей
  difficulties?: string[]; // массив выбранных сложностей
  difficultyOther?: string;
  tutorExperience?: "never" | "before" | "current";
  tutorExperienceComment?: string;
  priceRange?: "budget" | "medium" | "premium" | "all" | "any";

  // Страница 2 - Репетитор
  tutorGender?: "any" | "female" | "male";
  tutorTeachingExperience?: "any" | "beginner" | "3-5" | "5+";
  tutorOgeEgeExpert?: boolean; // Дополнительная галочка для экспертов по ОГЭ/ЕГЭ
  tutorAge?: "any" | "young" | "adult";
  teachingStyle?: string[]; // массив стилей
  scheduleDays?: string[]; // будни до обеда, после школы, вечером, выходные
  frequency?: "1w" | "2w" | "intensive" | "not-sure";
  lessonLanguage?: "russian" | "russian-english" | "other";
  lessonLanguageOther?: string;
  additionalComment?: string;

  // Страница 3 - Запись и оплата
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  notificationsEnabled?: boolean;
  notificationChannels?: ("whatsapp" | "telegram" | "sms")[];
  preferredTime?: string;
  paymentMethod?: "card-rf" | "card-other" | "no-card";
  promoCode?: string;
};

const STORAGE_KEY = "quiz-form-data";

export function getQuizState(): QuizFormData {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveQuizState(data: QuizFormData): void {
  if (typeof window === "undefined") return;
  try {
    const current = getQuizState();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save quiz state:", error);
  }
}

export function clearQuizState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz state:", error);
  }
}
