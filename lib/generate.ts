import { getSkill } from "./catalog";
import { patternsFor } from "./content";
import { generateFromPatterns } from "./content/engine";
import { Rng } from "./rng";
import {
  answerLineCount,
  type Difficulty,
  type GenerateInput,
  type Grade,
  type Skill,
  type Worksheet,
  type WorksheetItem,
  type WorksheetSection,
} from "./types";
import { DIFFICULTY_LABEL } from "./types";

export function defaultTitle(skills: Skill[]): string {
  if (skills.length === 1) return skills[0]?.name ?? "Grammar Practice";
  if (skills.length > 1 && skills.length <= 3) return skills.map((skill) => skill.name).join(", ");
  return "Grammar Practice";
}

export function formatLongDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso.trim();
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return iso.trim();
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function fileSlug(title: string, grade: Grade, kind: "worksheet" | "answer-key"): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `grade-${grade}-${base || "grammar"}-${kind}.pdf`;
}

function distribute(skillCount: number, questions: number): number[] {
  const base = Math.floor(questions / skillCount);
  let remainder = questions % skillCount;
  return Array.from({ length: skillCount }, () => {
    const extra = remainder > 0 ? 1 : 0;
    remainder -= extra;
    return base + extra;
  });
}

export function generateWorksheet(input: GenerateInput): Worksheet {
  if (input.skillIds.length === 0) {
    throw new Error("Select at least one skill.");
  }
  if (input.questionCount < 5 || input.questionCount > 25) {
    throw new Error("Choose between 5 and 25 questions.");
  }
  const rng = new Rng(input.seed >>> 0);
  const skills = input.skillIds.map((id) => getSkill(id));
  const counts = distribute(skills.length, input.questionCount);
  const sections: WorksheetSection[] = [];
  const skipped: string[] = [];
  let number = 1;

  skills.forEach((skill, index) => {
    const count = counts[index] ?? 0;
    if (count === 0) {
      skipped.push(skill.name);
      return;
    }
    const drafts = generateFromPatterns(rng, input.difficulty, count, patternsFor(skill.id));
    const items: WorksheetItem[] = drafts.map((draft) => ({
      number: number++,
      skillId: skill.id,
      skillName: skill.name,
      type: draft.type,
      prompt: draft.prompt,
      stimulus: draft.stimulus,
      choices: draft.choices,
      lines: answerLineCount(draft.type, draft.lines),
      answer: draft.answer,
      explanation: draft.explanation,
    }));
    sections.push({
      skillId: skill.id,
      skillName: skill.name,
      directions: skill.directions,
      items,
    });
  });

  const used = skills.filter((_, index) => (counts[index] ?? 0) > 0);
  const title = input.title.trim() || defaultTitle(used);
  const warning =
    skipped.length > 0
      ? `Only the first ${used.length} skill${used.length === 1 ? "" : "s"} fit into ${input.questionCount} questions. Raise the question count or select fewer skills to include ${skipped.join(", ")}.`
      : undefined;

  return {
    meta: {
      title,
      grade: input.grade,
      difficulty: input.difficulty,
      teacher: input.teacher.trim(),
      className: input.className.trim(),
      date: formatLongDate(input.date),
      seed: input.seed >>> 0,
      includeDirections: input.includeDirections,
      skillNames: used.map((skill) => skill.name),
    },
    warning,
    sections,
  };
}

export function difficultyBlurb(difficulty: Difficulty): string {
  if (difficulty === "developing") return "Shorter sentences and more direct tasks.";
  if (difficulty === "proficient") return "Grade 9–10 depth, with closer distractors.";
  return "Denser sentences, traps, and more revision.";
}

export function worksheetItems(worksheet: Worksheet): WorksheetItem[] {
  return worksheet.sections.flatMap((section) => section.items);
}

export { DIFFICULTY_LABEL };
