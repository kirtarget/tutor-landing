export type TutorCard = {
  id: string;
  name: string;
  subject:
    | "math"
    | "russian"
    | "english"
    | "physics"
    | "chemistry"
    | "biology"
    | "informatics"
    | "history"
    | "social";
  grades: { from: number; to: number };
  price: number;
  priceSegment: "low" | "mid" | "high";
  experienceYears: number;
  studentsCount: number;
  examFocus: ("oge" | "ege" | "school" | "olymp")[];
  headline: string;
  about: string;
  personal: string;
  styles: ("calm" | "strict" | "fast" | "explain" | "supportive")[];
  gender: "male" | "female";
  avatarTheme: "blue" | "green" | "orange" | "purple";
};

