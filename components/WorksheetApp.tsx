"use client";

import { useEffect, useMemo, useState } from "react";
import Preview from "@/components/Preview";
import { CATEGORIES, SKILLS, isRecommended } from "@/lib/catalog";
import { fileSlug, generateWorksheet } from "@/lib/generate";
import { buildPdf } from "@/lib/pdf";
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  GRADES,
  defaultDifficulty,
  type CategoryId,
  type Difficulty,
  type GenerateInput,
  type Grade,
  type Worksheet,
} from "@/lib/types";

const QUICK_STARTS: {
  label: string;
  detail: string;
  grade: Grade;
  skillIds: string[];
  questions: number;
}[] = [
  {
    label: "Grade 7 core",
    detail: "Nouns, agreement, fragments, commas, confused words",
    grade: 7,
    skillIds: ["nouns", "subject-verb-agreement", "fragments", "commas", "confused-words"],
    questions: 15,
  },
  {
    label: "Grade 10 sentences",
    detail: "Clauses, sentence types, modifiers, parallel structure, semicolons",
    grade: 10,
    skillIds: ["clauses", "sentence-types", "modifiers", "parallel-structure", "semicolons-colons"],
    questions: 15,
  },
  {
    label: "Grade 12 editing",
    detail: "Mood, modifiers, dashes, register, commas",
    grade: 12,
    skillIds: ["verb-mood", "modifiers", "hyphens-dashes", "formal-informal", "commas"],
    questions: 15,
  },
];

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function randomSeed(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] ?? 1;
}

function snapshot(input: GenerateInput): string {
  return JSON.stringify(input);
}

export default function WorksheetApp() {
  const [grade, setGrade] = useState<Grade>(7);
  const [skillIds, setSkillIds] = useState<string[]>(QUICK_STARTS[0]?.skillIds ?? []);
  const [questionCount, setQuestionCount] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>("developing");
  const [difficultyTouched, setDifficultyTouched] = useState(false);
  const [includeDirections, setIncludeDirections] = useState(true);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [title, setTitle] = useState(QUICK_STARTS[0]?.label ?? "");
  const [teacher, setTeacher] = useState("");
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [seed, setSeed] = useState(48291);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [recommendedOnly, setRecommendedOnly] = useState(true);
  const [query, setQuery] = useState("");
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [generatedFrom, setGeneratedFrom] = useState("");
  const [previewMode, setPreviewMode] = useState<"worksheet" | "answer-key">("worksheet");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"worksheet" | "answer-key" | "">("");

  useEffect(() => {
    setDate(todayIso());
    setSeed(randomSeed());
  }, []);

  const input = useMemo<GenerateInput>(
    () => ({
      grade,
      skillIds,
      questionCount,
      difficulty,
      includeDirections,
      title,
      teacher,
      className,
      date,
      seed: Number.isFinite(seed) ? seed : 0,
    }),
    [
      grade,
      skillIds,
      questionCount,
      difficulty,
      includeDirections,
      title,
      teacher,
      className,
      date,
      seed,
    ],
  );

  const stale = worksheet !== null && snapshot(input) !== generatedFrom;

  const visibleSkills = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SKILLS.filter((skill) => {
      if (category !== "all" && skill.category !== category) return false;
      if (recommendedOnly && !isRecommended(skill, grade)) return false;
      if (!needle) return true;
      const haystack = [skill.name, skill.summary, ...skill.keywords].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [category, recommendedOnly, query, grade]);

  function chooseGrade(next: Grade) {
    setGrade(next);
    if (!difficultyTouched) setDifficulty(defaultDifficulty(next));
  }

  function toggleSkill(id: string) {
    setSkillIds((current) =>
      current.includes(id) ? current.filter((skillId) => skillId !== id) : [...current, id],
    );
  }

  function selectRecommended() {
    const recommended = SKILLS.filter((skill) => isRecommended(skill, grade)).map((skill) => skill.id);
    setSkillIds(recommended);
  }

  function applyQuickStart(index: number) {
    const preset = QUICK_STARTS[index];
    if (!preset) return;
    setGrade(preset.grade);
    setDifficulty(defaultDifficulty(preset.grade));
    setDifficultyTouched(false);
    setSkillIds(preset.skillIds);
    setQuestionCount(preset.questions);
    setTitle(preset.label);
    setRecommendedOnly(false);
    setCategory("all");
    setQuery("");
    setError("");
  }

  function generate() {
    try {
      const next = generateWorksheet(input);
      setWorksheet(next);
      setGeneratedFrom(snapshot(input));
      setPreviewMode("worksheet");
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate a worksheet.");
    }
  }

  async function download(kind: "worksheet" | "answer-key") {
    if (!worksheet) return;
    setBusy(kind);
    setError("");
    try {
      const bytes = await buildPdf(worksheet, kind);
      const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileSlug(worksheet.meta.title, worksheet.meta.grade, kind);
      link.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not build the PDF.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="no-print mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-moss">GRADES 7–12</p>
          <h1 className="mt-1 font-serif text-4xl text-ink">Grammar Worksheet Generator</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/75">
            Pick a grade and the skills you want to practice, then download a printable
            worksheet and a matching answer key. The same seed rebuilds the same items.
          </p>
        </div>
        <p className="text-sm text-ink/60">{SKILLS.length} skills · no sign-in</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <form
          className="no-print space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            generate();
          }}
        >
          <section className="rounded-sm border border-line bg-card p-4 shadow-paper">
            <h2 className="font-serif text-xl">Quick starts</h2>
            <div className="mt-3 grid gap-2">
              {QUICK_STARTS.map((preset, index) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyQuickStart(index)}
                  className="rounded-sm border border-line bg-mist px-3 py-2 text-left hover:border-moss"
                >
                  <span className="block text-sm font-semibold text-mossdark">{preset.label}</span>
                  <span className="block text-xs leading-5 text-ink/70">{preset.detail}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-sm border border-line bg-card p-4 shadow-paper">
            <h2 className="font-serif text-xl">Grade</h2>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {GRADES.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={grade === value}
                  onClick={() => chooseGrade(value)}
                  className={
                    grade === value
                      ? "rounded-sm bg-moss px-2 py-2 text-sm font-semibold text-white"
                      : "rounded-sm border border-line bg-white px-2 py-2 text-sm hover:border-moss"
                  }
                >
                  {value}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-sm border border-line bg-card p-4 shadow-paper">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl">Skills</h2>
                <p className="mt-1 text-xs leading-5 text-ink/65">
                  {skillIds.length} selected. Questions are split across skills in this order.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectRecommended}
                  className="text-xs font-semibold text-moss underline-offset-2 hover:underline"
                >
                  Recommended
                </button>
                <button
                  type="button"
                  onClick={() => setSkillIds([])}
                  className="text-xs font-semibold text-clay underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            {skillIds.length > 0 ? (
              <ol className="mt-3 flex flex-wrap gap-1.5">
                {skillIds.map((id, index) => {
                  const skill = SKILLS.find((entry) => entry.id === id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => toggleSkill(id)}
                        className="rounded-full bg-moss px-2.5 py-1 text-xs font-medium text-white"
                      >
                        {index + 1}. {skill?.name ?? id} ×
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : null}

            <label className="mt-3 block text-xs font-semibold tracking-wide text-ink/70">
              Search
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="comma, who, fragment…"
                className="mt-1 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink"
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                All
              </FilterChip>
              {CATEGORIES.map((entry) => (
                <FilterChip
                  key={entry.id}
                  active={category === entry.id}
                  onClick={() => setCategory(entry.id)}
                >
                  {entry.name}
                </FilterChip>
              ))}
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={recommendedOnly}
                onChange={(event) => setRecommendedOnly(event.target.checked)}
              />
              Show skills recommended for grade {grade}
            </label>

            <ul className="mt-3 max-h-[360px] space-y-2 overflow-auto pr-1">
              {visibleSkills.length === 0 ? (
                <li className="text-sm text-ink/60">No skills match this filter.</li>
              ) : (
                visibleSkills.map((skill) => {
                  const selected = skillIds.includes(skill.id);
                  const order = skillIds.indexOf(skill.id);
                  return (
                    <li key={skill.id}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleSkill(skill.id)}
                        className={
                          selected
                            ? "w-full rounded-sm border border-moss bg-[#e7f0eb] px-3 py-2 text-left"
                            : "w-full rounded-sm border border-line bg-white px-3 py-2 text-left hover:border-moss"
                        }
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">
                            {selected ? `${order + 1}. ` : ""}
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-semibold tracking-wide text-moss">
                            {skill.gradeBands.join(" · ")}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-ink/70">{skill.summary}</span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="rounded-sm border border-line bg-card p-4 shadow-paper">
            <h2 className="font-serif text-xl">Options</h2>
            <label className="mt-3 block text-sm">
              <span className="flex items-center justify-between font-semibold">
                Questions
                <span>{questionCount}</span>
              </span>
              <input
                type="range"
                min={5}
                max={25}
                value={questionCount}
                onChange={(event) => setQuestionCount(Number(event.target.value))}
                className="mt-2 w-full accent-moss"
              />
            </label>

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold">Difficulty</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={difficulty === value}
                    onClick={() => {
                      setDifficulty(value);
                      setDifficultyTouched(true);
                    }}
                    className={
                      difficulty === value
                        ? "rounded-sm bg-moss px-2 py-2 text-xs font-semibold text-white"
                        : "rounded-sm border border-line bg-white px-2 py-2 text-xs hover:border-moss"
                    }
                  >
                    {DIFFICULTY_LABEL[value]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-ink/65">
                {grade <= 8
                  ? "Grades 7–8 start on Developing."
                  : grade <= 10
                    ? "Grades 9–10 start on Proficient."
                    : "Grades 11–12 start on Advanced."}{" "}
                You can override it for any skill.
              </p>
            </fieldset>

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeDirections}
                  onChange={(event) => setIncludeDirections(event.target.checked)}
                />
                Include directions
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(event) => setIncludeAnswerKey(event.target.checked)}
                />
                Include a separate answer-key PDF
              </label>
            </div>

            <div className="mt-4 grid gap-3">
              <Field label="Title (optional)" value={title} onChange={setTitle} placeholder="Uses the skill names if blank" />
              <Field label="Teacher" value={teacher} onChange={setTeacher} placeholder="Ms. Okonkwo" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Class" value={className} onChange={setClassName} placeholder="English 10" />
                <label className="block text-xs font-semibold tracking-wide text-ink/70">
                  Date
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink"
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold tracking-wide text-ink/70">
                Seed
                <span className="mt-1 flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={seed}
                    onChange={(event) => setSeed(Number(event.target.value))}
                    className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink"
                  />
                  <button
                    type="button"
                    onClick={() => setSeed(randomSeed())}
                    className="shrink-0 rounded-sm border border-line bg-white px-3 py-2 text-xs font-semibold hover:border-moss"
                  >
                    New seed
                  </button>
                </span>
              </label>
            </div>
          </section>

          {error ? (
            <p className="rounded-sm border border-clay/40 bg-[#f8ece9] px-3 py-2 text-sm text-clay" role="alert">
              {error}
            </p>
          ) : null}
          {stale ? (
            <p className="text-sm text-clay">Settings changed. Generate again to refresh the preview and PDFs.</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-sm bg-moss px-4 py-3 text-sm font-semibold text-white hover:bg-mossdark"
          >
            Generate worksheet
          </button>
        </form>

        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-sm border border-line bg-card p-1">
              <ModeButton active={previewMode === "worksheet"} onClick={() => setPreviewMode("worksheet")}>
                Worksheet
              </ModeButton>
              <ModeButton active={previewMode === "answer-key"} onClick={() => setPreviewMode("answer-key")}>
                Answer key
              </ModeButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!worksheet || busy !== ""}
                onClick={() => download("worksheet")}
                className="rounded-sm bg-moss px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy === "worksheet" ? "Building…" : "Download worksheet PDF"}
              </button>
              {includeAnswerKey ? (
                <button
                  type="button"
                  disabled={!worksheet || busy !== ""}
                  onClick={() => download("answer-key")}
                  className="rounded-sm border border-moss bg-white px-3 py-2 text-sm font-semibold text-moss disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === "answer-key" ? "Building…" : "Download answer key PDF"}
                </button>
              ) : null}
              <button
                type="button"
                disabled={!worksheet}
                onClick={() => window.print()}
                className="rounded-sm border border-line bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Print
              </button>
            </div>
          </div>
          {worksheet?.warning && previewMode === "worksheet" ? (
            <p className="no-print rounded-sm border border-clay/30 bg-[#f8ece9] px-3 py-2 text-sm text-clay">
              {worksheet.warning}
            </p>
          ) : null}
          <Preview worksheet={worksheet} mode={previewMode} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-semibold tracking-wide text-ink/70">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border border-line bg-white px-3 py-2 text-sm font-normal tracking-normal text-ink"
      />
    </label>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"
          : "rounded-full border border-line bg-white px-2.5 py-1 text-[11px] text-ink/80 hover:border-moss"
      }
    >
      {children}
    </button>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "rounded-sm bg-moss px-3 py-1.5 text-sm font-semibold text-white"
          : "rounded-sm px-3 py-1.5 text-sm text-ink/70"
      }
    >
      {children}
    </button>
  );
}
