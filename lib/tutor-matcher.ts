import { tutors } from "@/data/tutors";
import type { TutorCard } from "@/types/tutor";
import type { QuizFormData } from "./quiz-state";

export type QuizAnswers = {
  grade?: number;
  subject?: TutorCard["subject"];
  subjectLabel?: string;
  goals?: string[];
  difficulties?: string[];
  pricePreference?: "low" | "mid" | "high";
  tutorGender?: "any" | "male" | "female";
  tutorExperience?: "any" | "junior" | "middle" | "senior";
  stylePreferences?: TutorCard["styles"];
};

export type TutorRecommendation = TutorCard & { score: number };

const subjectMap: Record<string, TutorCard["subject"]> = {
  Математика: "math",
  "Русский язык": "russian",
  "Английский язык": "english",
  Физика: "physics",
  Химия: "chemistry",
  Биология: "biology",
  Информатика: "informatics",
  История: "history",
  Обществознание: "social",
};

const styleMap: Record<string, TutorCard["styles"][number]> = {
  calm: "calm",
  strict: "strict",
  fast: "fast",
  explanations: "explain",
  explain: "explain",
  supportive: "supportive",
};

const experienceRank: Record<
  Exclude<QuizAnswers["tutorExperience"], undefined>,
  number
> = {
  any: 0,
  junior: 1,
  middle: 2,
  senior: 3,
};

export function mapQuizToAnswers(formData: QuizFormData): QuizAnswers {
  const subjectLabel =
    formData.subject === "Другое"
      ? formData.subjectOther?.trim()
      : formData.subject?.trim();

  return {
    grade: extractGrade(formData.grade),
    subject: normalizeSubject(formData.subject, formData.subjectOther),
    subjectLabel: subjectLabel || undefined,
    goals: formData.goals || [],
    difficulties: formData.difficulties || [],
    pricePreference: mapPricePreference(formData.priceRange),
    tutorGender:
      formData.tutorGender && formData.tutorGender !== "any"
        ? formData.tutorGender
        : undefined,
    tutorExperience: mapExperience(formData.tutorTeachingExperience),
    stylePreferences: mapStyles(formData.teachingStyle),
  };
}

export function matchTutors(
  answers: QuizAnswers,
  limit = 8,
): TutorRecommendation[] {
  const filtered = applyFilters(tutors, answers);

  return filtered
    .map((tutor) => ({
      ...tutor,
      score: computeScore(tutor, answers),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.price !== b.price) return a.price - b.price;
      return b.experienceYears - a.experienceYears;
    })
    .slice(0, limit);
}

function applyFilters(
  allTutors: TutorCard[],
  answers: QuizAnswers,
): TutorCard[] {
  let result = allTutors;
  const hasSubjectPreference = Boolean(answers.subjectLabel);

  if (answers.subject) {
    const bySubject = allTutors.filter(
      (tutor) => tutor.subject === answers.subject,
    );
    if (bySubject.length) {
      result = bySubject;
    }
  } else if (hasSubjectPreference) {
    return [];
  }

  if (answers.grade) {
    const byGrade = result.filter(
      (tutor) =>
        answers.grade! >= tutor.grades.from &&
        answers.grade! <= tutor.grades.to,
    );
    if (byGrade.length) {
      result = byGrade;
    }
  }

  return result;
}

function computeScore(tutor: TutorCard, answers: QuizAnswers): number {
  let score = 0;

  if (
    answers.pricePreference &&
    tutor.priceSegment === answers.pricePreference
  ) {
    score += 2;
  }

  const wantsEge = answers.goals?.includes("ege");
  const wantsOge = answers.goals?.includes("oge");

  if (wantsEge && tutor.examFocus.includes("ege")) {
    score += 2;
  }
  if (wantsOge && tutor.examFocus.includes("oge")) {
    score += 2;
  }

  if (answers.stylePreferences?.some((style) => tutor.styles.includes(style))) {
    score += 1;
  }

  if (answers.tutorGender && answers.tutorGender === tutor.gender) {
    score += 1;
  }

  if (answers.tutorExperience && answers.tutorExperience !== "any") {
    const desiredRank = experienceRank[answers.tutorExperience];
    const tutorRank = experienceRank[getTutorLevel(tutor)];
    if (tutorRank >= desiredRank) {
      score += 1;
    }
  }

  return score;
}

function getTutorLevel(
  tutor: TutorCard,
): Exclude<QuizAnswers["tutorExperience"], undefined> {
  if (tutor.experienceYears >= 8) return "senior";
  if (tutor.experienceYears >= 5) return "middle";
  return "junior";
}

function mapPricePreference(
  priceRange?: QuizFormData["priceRange"],
): QuizAnswers["pricePreference"] | undefined {
  switch (priceRange) {
    case "budget":
      return "low";
    case "medium":
      return "mid";
    case "premium":
      return "high";
    default:
      return undefined;
  }
}

function mapExperience(
  experience?: QuizFormData["tutorTeachingExperience"],
): QuizAnswers["tutorExperience"] | undefined {
  switch (experience) {
    case "beginner":
      return "junior";
    case "3-5":
      return "middle";
    case "5+":
      return "senior";
    case "any":
      return "any";
    default:
      return undefined;
  }
}

function mapStyles(values?: string[]): QuizAnswers["stylePreferences"] {
  if (!values || values.length === 0) return undefined;

  const mapped = values
    .filter((value) => value !== "auto")
    .map((value) => styleMap[value])
    .filter((value): value is TutorCard["styles"][number] => Boolean(value));

  return mapped.length ? Array.from(new Set(mapped)) : undefined;
}

function normalizeSubject(
  subject?: string,
  customSubject?: string,
): TutorCard["subject"] | undefined {
  if (!subject) return undefined;

  const rawCandidate =
    subject === "Другое" ? customSubject?.trim() : subject.trim();
  if (!rawCandidate) return undefined;

  const normalizedCandidate = rawCandidate.toLowerCase();

  for (const [label, slug] of Object.entries(subjectMap)) {
    if (label.toLowerCase() === normalizedCandidate) {
      return slug;
    }
  }

  const slugMatch = Object.values(subjectMap).find(
    (value) => value === normalizedCandidate,
  );
  if (slugMatch) {
    return slugMatch;
  }

  return undefined;
}

function extractGrade(raw?: string): number | undefined {
  if (!raw) return undefined;
  const match = raw.match(/\d+/);
  if (!match) return undefined;
  const grade = Number(match[0]);
  return Number.isNaN(grade) ? undefined : grade;
}
