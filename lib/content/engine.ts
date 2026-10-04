import { answerLineCount, type Difficulty, type ItemType } from "../types";
import { Rng } from "../rng";

export const BAND = {
  all: ["developing", "proficient", "advanced"] as Difficulty[],
  dev: ["developing"] as Difficulty[],
  prof: ["proficient"] as Difficulty[],
  adv: ["advanced"] as Difficulty[],
  core: ["developing", "proficient"] as Difficulty[],
  upper: ["proficient", "advanced"] as Difficulty[],
};

export interface ItemDraft {
  key: string;
  order: number;
  type: ItemType;
  prompt: string;
  stimulus?: string;
  choices?: string[];
  lines: number;
  answer: string;
  explanation?: string;
}

export interface Pattern {
  id: string;
  difficulties: Difficulty[];
  build: (rng: Rng, difficulty: Difficulty) => Omit<ItemDraft, "order">;
}

interface DraftCore {
  stimulus?: string;
  answer: string;
  explanation?: string;
  distractors?: string[];
  choices?: string[];
  prompt?: string;
  lines?: number;
  key?: string;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function clean(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.trim();
}

function defaultLines(type: ItemType): number {
  return type === "multiple-choice" ? 0 : 1;
}

function multipleChoice(
  rng: Rng,
  correct: string,
  distractors: string[] | undefined,
  allChoices: string[] | undefined,
): { choices: string[]; answer: string } {
  const unique: string[] = [];
  const source = allChoices ?? [correct, ...(distractors ?? [])];
  for (const choice of source) {
    const trimmed = choice.trim();
    if (!trimmed) throw new Error("Empty choice");
    if (!unique.includes(trimmed)) unique.push(trimmed);
  }
  if (allChoices && !unique.includes(correct)) {
    throw new Error(`Correct answer is not among the choices: ${correct}`);
  }
  if (!unique.includes(correct)) unique.unshift(correct);
  if (unique.length < 2) throw new Error("A multiple-choice item needs at least two choices");
  const choices = rng.shuffle(unique);
  const index = choices.indexOf(correct);
  const letter = LETTERS[index];
  if (!letter) throw new Error("Too many choices to letter");
  return { choices, answer: `${letter}. ${correct}` };
}

export function pattern(opts: {
  id: string;
  difficulties: Difficulty[];
  type: ItemType;
  prompt: string;
  lines?: number;
  build: (rng: Rng, difficulty: Difficulty) => DraftCore;
}): Pattern {
  return {
    id: opts.id,
    difficulties: opts.difficulties,
    build: (rng, difficulty) => {
      let core: DraftCore;
      try {
        core = opts.build(rng, difficulty);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Pattern ${opts.id}: ${message}`);
      }
      // Keep the pattern instruction as written. A shared task is printed once for the
      // section, not paraphrased above every item. Item-specific prompts still come through core.prompt.
      const prompt = clean(core.prompt ?? opts.prompt) ?? opts.prompt;
      const stimulus = clean(core.stimulus);
      const correct = clean(core.answer);
      const explanation = clean(core.explanation);
      if (!prompt) throw new Error(`Pattern ${opts.id} produced an empty prompt`);
      if (!correct) throw new Error(`Pattern ${opts.id} produced an empty answer`);
      const lines = answerLineCount(opts.type, core.lines ?? opts.lines ?? defaultLines(opts.type));
      const key = core.key ?? `${opts.id}|${stimulus ?? ""}|${prompt}|${correct}`;
      if (opts.type === "multiple-choice") {
        const built = multipleChoice(rng, correct, core.distractors, core.choices);
        return {
          key,
          type: opts.type,
          prompt,
          stimulus,
          choices: built.choices,
          lines: 0,
          answer: built.answer,
          explanation,
        };
      }
      return {
        key,
        type: opts.type,
        prompt,
        stimulus,
        lines,
        answer: correct,
        explanation,
      };
    },
  };
}

export function fromList<T>(opts: {
  id: string;
  difficulties: Difficulty[];
  type: ItemType;
  prompt: string;
  lines?: number;
  items: readonly T[];
  map: (item: T, rng: Rng, difficulty: Difficulty) => DraftCore;
}): Pattern {
  if (opts.items.length === 0) {
    throw new Error(`Pattern ${opts.id} has no items`);
  }
  return pattern({
    id: opts.id,
    difficulties: opts.difficulties,
    type: opts.type,
    prompt: opts.prompt,
    lines: opts.lines,
    build: (rng, difficulty) => {
      const eligible = opts.items.filter((item) => {
        const levels = (item as { levels?: Difficulty[] }).levels;
        return !levels || levels.includes(difficulty);
      });
      if (eligible.length === 0) {
        throw new Error(`Pattern ${opts.id} has no items for ${difficulty}`);
      }
      return opts.map(rng.pick(eligible), rng, difficulty);
    },
  });
}

export function fillSlots(template: string, row: Record<string, string>): string {
  const filled = template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => {
    const value = row[key];
    if (value === undefined) {
      throw new Error(`Missing {${key}} in: ${template}`);
    }
    return value;
  });
  if (filled.includes("{")) {
    throw new Error(`Unresolved slot in: ${filled}`);
  }
  return filled;
}

export interface ChoiceItem {
  levels?: Difficulty[];
  stimulus?: string;
  answer: string;
  distractors?: string[];
  choices?: string[];
  explanation?: string;
  prompt?: string;
}

export function choicePattern(
  id: string,
  difficulties: Difficulty[],
  prompt: string,
  items: readonly ChoiceItem[],
): Pattern {
  return fromList({
    id,
    difficulties,
    type: "multiple-choice",
    prompt,
    items,
    map: (item) => ({
      stimulus: item.stimulus,
      answer: item.answer,
      distractors: item.distractors,
      choices: item.choices,
      explanation: item.explanation,
      prompt: item.prompt,
      key: `${id}|${item.prompt ?? prompt}|${item.stimulus ?? ""}|${item.answer}`,
    }),
  });
}

export interface RevisionItem {
  levels?: Difficulty[];
  stimulus: string;
  answer: string;
  explanation: string;
  prompt?: string;
  lines?: number;
}

export function revisionPattern(
  id: string,
  difficulties: Difficulty[],
  type: ItemType,
  prompt: string,
  items: readonly RevisionItem[],
  lines?: number,
): Pattern {
  return fromList({
    id,
    difficulties,
    type,
    prompt,
    lines,
    items,
    map: (item) => ({
      stimulus: item.stimulus,
      answer: item.answer,
      explanation: item.explanation,
      prompt: item.prompt,
      lines: item.lines,
      key: `${id}|${item.prompt ?? prompt}|${item.stimulus}|${item.answer}`,
    }),
  });
}

export function generateFromPatterns(
  rng: Rng,
  difficulty: Difficulty,
  count: number,
  patterns: Pattern[],
): ItemDraft[] {
  const eligible = patterns
    .map((entry, order) => ({ entry, order }))
    .filter(({ entry }) => entry.difficulties.includes(difficulty));
  if (eligible.length === 0) {
    throw new Error(`No item patterns for difficulty ${difficulty}`);
  }

  const seen = new Set<string>();
  const seenPrompt = new Set<string>();
  const pool: ItemDraft[] = [];
  let guard = 0;
  const maxAttempts = Math.max(800, count * 120);
  while (pool.length < count && guard < maxAttempts) {
    const slot = eligible[guard % eligible.length];
    if (!slot) break;
    guard += 1;
    const built = slot.entry.build(rng, difficulty);
    const answerText =
      built.type === "multiple-choice" ? built.answer.replace(/^[A-Z]\. /, "") : built.answer;
    const promptFace = `${built.prompt}\u0000${built.stimulus ?? ""}\u0000${answerText}`;
    if (seen.has(built.key) || seenPrompt.has(promptFace)) continue;
    seen.add(built.key);
    seenPrompt.add(promptFace);
    pool.push({ ...built, order: slot.order });
  }
  if (pool.length < count) {
    throw new Error(
      `Could only build ${pool.length} of ${count} unique items at ${difficulty}`,
    );
  }
  const ranked = pool.map((item, index) => ({ item, index }));
  ranked.sort((a, b) => a.item.order - b.item.order || a.index - b.index);
  return ranked.slice(0, count).map((entry) => entry.item);
}

/** How many distinct questions a skill can build at one difficulty. */
export function countUniqueItems(difficulty: Difficulty, patterns: Pattern[]): number {
  const eligible = patterns
    .map((entry, order) => ({ entry, order }))
    .filter(({ entry }) => entry.difficulties.includes(difficulty));
  const seen = new Set<string>();
  let stagnant = 0;
  // Wide enough to exhaust the confused-words glossary, which is several hundred items.
  for (let round = 0; round < 320 && stagnant < 40; round += 1) {
    let added = 0;
    for (const slot of eligible) {
      for (let n = 0; n < 24; n += 1) {
        const mix =
          Math.imul(round + 1, 1_000_003) +
          Math.imul(n + 3, 97) +
          Math.imul(slot.order + 1, 131) +
          difficulty.charCodeAt(0) * 17;
        const built = slot.entry.build(new Rng(mix >>> 0), difficulty);
        if (seen.has(built.key)) continue;
        seen.add(built.key);
        added += 1;
      }
    }
    stagnant = added === 0 ? stagnant + 1 : 0;
  }
  return seen.size;
}
