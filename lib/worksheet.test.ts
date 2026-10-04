import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PDFDocument } from "pdf-lib";
import { directionsCoverItemPrompts, SKILLS } from "./catalog";
import { patternsFor } from "./content";
import { countUniqueItems, generateFromPatterns } from "./content/engine";
import { fileSlug, generateWorksheet, worksheetItems } from "./generate";
import { buildPdf } from "./pdf";
import { Rng } from "./rng";
import { DIFFICULTIES, layoutItemPrompts, type Difficulty, type GenerateInput, type ItemPromptLayout } from "./types";

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
            assert.equal(item.lines, 1);
          }
          if (item.type === "rewrite" || item.type === "edit") {
            assert.ok((item.explanation ?? "").length > 12, `${skill.id}: ${item.stimulus ?? item.prompt}`);
          }
        }
      });
    }
  }
});

const DEEP_POOLS = new Set(["commas", "subject-verb-agreement", "confused-words"]);

describe("active vs. passive voice", () => {
  it("asks each item to identify the voice and rewrite it in the opposite voice", () => {
    const skill = SKILLS.find((entry) => entry.id === "active-passive");
    assert.ok(skill);
    assert.match(skill.directions, /opposite voice/i);
    assert.match(skill.summary, /opposite voice/i);
    for (const difficulty of DIFFICULTIES) {
      const items = generateFromPatterns(new Rng(7), difficulty, 25, patternsFor("active-passive"));
      assert.equal(items.length, 25);
      for (const item of items) {
        assert.equal(item.type, "rewrite");
        assert.equal(item.lines, 1);
        assert.equal(item.choices, undefined);
        assert.match(item.prompt, /rewrite/i);
        assert.match(item.prompt, /opposite voice|other voice/i);
        assert.match(item.prompt, /active or passive|the voice/i);
        assert.match(item.answer, /^(Active|Passive)\. .+/);
        const rewrite = item.answer.replace(/^(Active|Passive)\. /, "");
        assert.notEqual(rewrite, item.stimulus);
        if (item.answer.startsWith("Active.")) {
          assert.doesNotMatch(item.stimulus ?? "", / by /);
          assert.match(rewrite, / by /);
        } else {
          assert.match(item.stimulus ?? "", / by /);
          assert.doesNotMatch(rewrite, / by /);
        }
        assert.ok((item.explanation ?? "").length > 12);
      }
    }
  });

  it("states the voice instruction once in the section, not above every item", () => {
    assert.equal(directionsCoverItemPrompts("active-passive"), true);
    const sheet = generateWorksheet(
      baseInput({
        grade: 10,
        difficulty: "proficient",
        skillIds: ["active-passive"],
        questionCount: 10,
        title: "Active vs. passive voice",
        seed: 7,
      }),
    );
    const section = sheet.sections[0];
    assert.ok(section);
    assert.match(section.directions, /opposite voice/i);
    const prompts = section.items.map((item) => item.prompt);
    assert.equal(new Set(prompts).size, 1);
    const shown = layoutItemPrompts(section.items, true, true);
    assert.ok(shown.every((layout) => layout.prompt === "" && layout.groupPrompt === ""));
    const withoutDirections = layoutItemPrompts(section.items, false, true);
    assert.equal(withoutDirections[0]?.groupPrompt, prompts[0]);
    assert.ok(withoutDirections.slice(1).every((layout) => layout.prompt === "" && layout.groupPrompt === ""));
    for (const item of section.items) {
      assert.equal(item.lines, 1);
      assert.equal(item.choices, undefined);
      assert.match(item.answer, /^(Active|Passive)\. .+/);
    }
  });
});

describe("instruction layout", () => {
  it("prints a repeated task once and keeps a one-off prompt on its item", () => {
    const laid = layoutItemPrompts(
      [
        { prompt: "Rewrite the run-on as two sentences.", stimulus: "The bell rang the hall filled." },
        { prompt: "Rewrite the run-on as two sentences.", stimulus: "The paint peeled the mural faded." },
        {
          prompt: "Rewrite the run-on using a semicolon and no coordinating conjunction.",
          stimulus: "The solo ended the applause started.",
        },
      ],
      true,
      false,
    );
    assert.deepEqual(laid, [
      { prompt: "", groupPrompt: "Rewrite the run-on as two sentences." },
      { prompt: "", groupPrompt: "" },
      { prompt: "Rewrite the run-on using a semicolon and no coordinating conjunction.", groupPrompt: "" },
    ] satisfies ItemPromptLayout[]);
    const questions = layoutItemPrompts(
      [
        { prompt: "Which sentence is a comma splice?" },
        { prompt: "Which sentence is a comma splice?" },
      ],
      true,
      false,
    );
    assert.deepEqual(questions, [
      { prompt: "Which sentence is a comma splice?", groupPrompt: "" },
      { prompt: "Which sentence is a comma splice?", groupPrompt: "" },
    ]);
  });

  it("does not repeat a shared instruction on every question", () => {
    const sheet = generateWorksheet(
      baseInput({
        grade: 9,
        difficulty: "proficient",
        skillIds: ["run-ons", "combining-sentences", "confused-words"],
        questionCount: 15,
        seed: 11,
      }),
    );
    for (const section of sheet.sections) {
      const laid = layoutItemPrompts(
        section.items,
        true,
        directionsCoverItemPrompts(section.skillId),
      );
      assert.equal(laid.length, section.items.length);
      for (let index = 1; index < section.items.length; index += 1) {
        const item = section.items[index];
        const previous = section.items[index - 1];
        const current = item?.prompt.trim();
        if (
          current &&
          current === previous?.prompt.trim() &&
          item?.stimulus?.trim() &&
          previous?.stimulus?.trim()
        ) {
          assert.equal(laid[index]?.prompt, "");
          assert.equal(laid[index]?.groupPrompt, "");
        }
      }
      if (section.skillId === "confused-words") {
        assert.ok(laid.every((layout) => layout.prompt === "" && layout.groupPrompt === ""));
        assert.ok(section.items.every((item) => (item.choices?.length ?? 0) >= 2));
      }
      if (section.skillId === "combining-sentences") {
        const shown = laid.filter((layout) => layout.prompt || layout.groupPrompt);
        assert.ok(shown.length > 0);
      }
      if (section.skillId === "run-ons") {
        section.items.forEach((item, index) => {
          if (item.type !== "multiple-choice") assert.equal(item.lines, 1);
          if (!item.stimulus?.trim()) assert.equal(laid[index]?.prompt, item.prompt);
        });
      }
    }
  });
});

describe("item variety", () => {
  it("keeps a deep unique pool for every skill and difficulty", () => {
    for (const skill of SKILLS) {
      for (const difficulty of DIFFICULTIES) {
        const count = countUniqueItems(difficulty, patternsFor(skill.id));
        const minimum = DEEP_POOLS.has(skill.id) ? 80 : 40;
        assert.ok(count >= minimum, `${skill.id} at ${difficulty} has ${count} unique items; need ${minimum}`);
      }
    }
  });
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
