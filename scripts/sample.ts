import { mkdir, writeFile } from "node:fs/promises";
import { fileSlug, generateWorksheet } from "../lib/generate";
import { buildPdf } from "../lib/pdf";
import type { GenerateInput } from "../lib/types";

const samples: GenerateInput[] = [
  {
    grade: 7,
    skillIds: ["nouns", "subject-verb-agreement", "fragments", "commas", "confused-words"],
    questionCount: 15,
    difficulty: "developing",
    includeDirections: true,
    title: "Grade 7 Core Grammar",
    teacher: "Ms. Okonkwo",
    className: "English 7",
    date: "2026-09-29",
    seed: 7,
  },
  {
    grade: 10,
    skillIds: ["clauses", "sentence-types", "modifiers", "parallel-structure", "semicolons-colons"],
    questionCount: 15,
    difficulty: "proficient",
    includeDirections: true,
    title: "Grade 10 Sentence Control",
    teacher: "Mr. Alvarez",
    className: "English 10",
    date: "2026-09-29",
    seed: 10,
  },
  {
    grade: 12,
    skillIds: ["verb-mood", "modifiers", "hyphens-dashes", "formal-informal", "commas"],
    questionCount: 15,
    difficulty: "advanced",
    includeDirections: true,
    title: "Grade 12 Editing Practice",
    teacher: "Dr. Chen",
    className: "English 12",
    date: "2026-09-29",
    seed: 12,
  },
];

async function main(): Promise<void> {
  await mkdir("samples", { recursive: true });
  for (const input of samples) {
    const worksheet = generateWorksheet(input);
    for (const kind of ["worksheet", "answer-key"] as const) {
      const bytes = await buildPdf(worksheet, kind);
      const filename = `samples/${fileSlug(worksheet.meta.title, worksheet.meta.grade, kind)}`;
      await writeFile(filename, bytes);
      console.log(`${filename}  (${worksheet.sections.reduce((sum, section) => sum + section.items.length, 0)} items)`);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
