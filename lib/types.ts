export const GRADES = [7, 8, 9, 10, 11, 12] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_BANDS = ["7-8", "9-10", "11-12"] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export const DIFFICULTIES = ["developing", "proficient", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const CATEGORY_IDS = [
  "parts-of-speech",
  "agreement",
  "sentence-structure",
  "punctuation",
  "usage",
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type ItemType =
  | "multiple-choice"
  | "identify"
  | "fill-in"
  | "rewrite"
  | "edit";

/** Written responses get one ruled line. Choice items stay at zero. */
export function answerLineCount(type: ItemType, lines: number): number {
  if (type === "multiple-choice" || lines <= 0) return 0;
  return 1;
}

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  summary: string;
  directions: string;
  gradeBands: GradeBand[];
  keywords: string[];
}

export interface WorksheetItem {
  number: number;
  skillId: string;
  skillName: string;
  type: ItemType;
  prompt: string;
  stimulus?: string;
  choices?: string[];
  lines: number;
  answer: string;
  explanation?: string;
}

export interface WorksheetSection {
  skillId: string;
  skillName: string;
  directions: string;
  items: WorksheetItem[];
}

export interface WorksheetMeta {
  title: string;
  grade: Grade;
  difficulty: Difficulty;
  teacher: string;
  className: string;
  date: string;
  seed: number;
  includeDirections: boolean;
  skillNames: string[];
}

export interface Worksheet {
  meta: WorksheetMeta;
  warning?: string;
  sections: WorksheetSection[];
}

export interface GenerateInput {
  grade: Grade;
  skillIds: string[];
  questionCount: number;
  difficulty: Difficulty;
  includeDirections: boolean;
  title: string;
  teacher: string;
  className: string;
  date: string;
  seed: number;
}

export function gradeBand(grade: Grade): GradeBand {
  if (grade <= 8) return "7-8";
  if (grade <= 10) return "9-10";
  return "11-12";
}

export function defaultDifficulty(grade: Grade): Difficulty {
  if (grade <= 8) return "developing";
  if (grade <= 10) return "proficient";
  return "advanced";
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  developing: "Developing",
  proficient: "Proficient",
  advanced: "Advanced",
};
