import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PDFDocument } from "pdf-lib";
import { SKILLS } from "./catalog";
import { patternsFor } from "./content";
import { generateFromPatterns } from "./content/engine";
import { fileSlug, generateWorksheet, worksheetItems } from "./generate";
import { buildPdf } from "./pdf";
import { Rng } from "./rng";
import { DIFFICULTIES, type Difficulty, type GenerateInput } from "./types";

const PLACEHOLDER = /\{[a-zA-Z0-9_]+\}/;
const STUB = /\b(TODO|lorem ipsum|placeholder|stub item)\b/i;

function baseInput(overrides: Partial<GenerateInput> = {}): GenerateInput {
  return {
    grade: 7,
    skillIds: ["nouns", "subject-verb-agreement", "fragments", "commas", "confused-words"],
    questionCount: 15,
    difficulty: "developing",
    includeDirections: true,
    title: "Grade 7 core",
    teacher: "Ms. Okonkwo",
    className: "English 7",
    date: "2026-09-29",
    seed: 42,
    ...overrides,
  };
}

describe("catalog", () => {
  it("encodes every skill and a generator for each", () => {
    assert.equal(SKILLS.length, 34);
    const ids = new Set(SKILLS.map((skill) => skill.id));
    assert.equal(ids.size, 34);
    for (const skill of SKILLS) {
      assert.ok(skill.name.length > 0);
      assert.ok(skill.directions.length > 20, skill.id);
      assert.ok(skill.gradeBands.length > 0, skill.id);
      assert.ok(patternsFor(skill.id).length > 0, skill.id);
    }
  });
});

describe("item banks", () => {
  for (const skill of SKILLS) {
    for (const difficulty of DIFFICULTIES) {
      it(`${skill.id} at ${difficulty} yields 25 coherent items`, () => {
        const items = generateFromPatterns(new Rng(20260929), difficulty, 25, patternsFor(skill.id));
        assert.equal(items.length, 25);
        const keys = new Set<string>();
        for (const item of items) {
          assert.ok(!keys.has(item.key), `${skill.id} duplicate ${item.key}`);
          keys.add(item.key);
          const blob = [item.prompt, item.stimulus ?? "", item.answer, item.explanation ?? "", ...(item.choices ?? [])].join(
            "\n",
          );
          assert.equal(PLACEHOLDER.test(blob), false, blob);
          assert.equal(STUB.test(blob), false, blob);
          assert.ok(item.prompt.trim().length > 0);
          assert.ok(item.answer.trim().length > 0);
          if (item.type === "multiple-choice") {
            assert.ok(item.choices && item.choices.length >= 2);
            const match = /^([A-Z])\. (.+)$/.exec(item.answer);
            assert.ok(match, `${skill.id} answer ${item.answer}`);
            const letter = match[1] ?? "";
            const text = match[2] ?? "";
            assert.equal(item.choices?.[letter.charCodeAt(0) - 65], text);
          } else {
            assert.equal(item.choices, undefined);
            assert.ok(item.lines > 0);
          }
          if (item.type === "rewrite" || item.type === "edit") {
            assert.ok((item.explanation ?? "").length > 12, `${skill.id}: ${item.stimulus ?? item.prompt}`);
          }
        }
      });
    }
  }
});

describe("worksheets", () => {
  it("is reproducible for the same seed and settings", () => {
    const first = worksheetItems(generateWorksheet(baseInput()));
    const second = worksheetItems(generateWorksheet(baseInput()));
    assert.deepEqual(
      first.map((item) => [item.prompt, item.stimulus, item.answer, item.choices]),
      second.map((item) => [item.prompt, item.stimulus, item.answer, item.choices]),
    );
    const other = worksheetItems(generateWorksheet(baseInput({ seed: 43 })));
    assert.notDeepEqual(
      first.map((item) => item.answer),
      other.map((item) => item.answer),
    );
  });

  it("numbers items continuously and warns when skills do not fit", () => {
    const sheet = generateWorksheet(
      baseInput({
        questionCount: 5,
        skillIds: ["nouns", "verbs", "commas", "fragments", "run-ons", "titles"],
      }),
    );
    const items = worksheetItems(sheet);
    assert.deepEqual(
      items.map((item) => item.number),
      [1, 2, 3, 4, 5],
    );
    assert.match(sheet.warning ?? "", /titles/i);
    assert.equal(sheet.sections.some((section) => section.skillId === "titles"), false);
  });

  it("builds grade 7 and grade 12 worksheets with matching keys", async () => {
    const cases: GenerateInput[] = [
      baseInput(),
      baseInput({
        grade: 12,
        difficulty: "advanced" as Difficulty,
        title: "Grade 12 editing",
        className: "English 12",
        skillIds: ["verb-mood", "modifiers", "hyphens-dashes", "formal-informal", "commas"],
        seed: 12,
      }),
    ];
    for (const input of cases) {
      const sheet = generateWorksheet(input);
      assert.equal(worksheetItems(sheet).length, input.questionCount);
      assert.equal(sheet.meta.grade, input.grade);
      assert.match(sheet.meta.date, /September 29, 2026/);
      for (const kind of ["worksheet", "answer-key"] as const) {
        const bytes = await buildPdf(sheet, kind);
        assert.equal(Buffer.from(bytes.subarray(0, 5)).toString("utf8"), "%PDF-");
        const doc = await PDFDocument.load(bytes);
        assert.ok(doc.getPageCount() >= 1);
        assert.match(fileSlug(sheet.meta.title, sheet.meta.grade, kind), new RegExp(`${kind}\\.pdf$`));
      }
    }
  });
});
