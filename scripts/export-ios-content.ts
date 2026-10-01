/**
 * Writes the iOS catalog and a harvested item bank from the web generator.
 * Run with `npm run export:ios` after catalog or item-bank changes.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES, SKILLS } from "../lib/catalog";
import { patternsFor } from "../lib/content";
import { Rng } from "../lib/rng";
import { DIFFICULTIES, type Difficulty } from "../lib/types";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iosRoot = resolve(root, "ios/Sources/GrammarCore");
function harvestTarget(skillId: string): number {
  // Confused-words now holds the full glossary, so the export keeps every unique item
  // instead of stopping at the older sample cap.
  if (skillId === "confused-words") return 800;
  if (skillId === "commas" || skillId === "subject-verb-agreement") {
    return 120;
  }
  return 72;
}

function harvestMinimum(skillId: string): number {
  if (skillId === "commas" || skillId === "subject-verb-agreement" || skillId === "confused-words") {
    return 80;
  }
  return 40;
}

const PLACEHOLDER = /\{[a-zA-Z0-9_]+\}/;
const STUB = /\b(TODO|lorem ipsum|placeholder|stub item)\b/i;

interface BankItem {
  patternId: string;
  order: number;
  type: string;
  prompt: string;
  stimulus?: string;
  choices?: string[];
  lines: number;
  answer: string;
  explanation?: string;
  key: string;
}

function seedFor(round: number, n: number, order: number, difficulty: Difficulty): number {
  const mix =
    Math.imul(round + 1, 1_000_003) +
    Math.imul(n + 3, 97) +
    Math.imul(order + 1, 131) +
    difficulty.charCodeAt(0) * 17;
  return mix >>> 0;
}

function harvest(skillId: string, difficulty: Difficulty): BankItem[] {
  const target = harvestTarget(skillId);
  const patterns = patternsFor(skillId)
    .map((entry, order) => ({ entry, order }))
    .filter(({ entry }) => entry.difficulties.includes(difficulty));
  if (patterns.length === 0) {
    throw new Error(`${skillId} has no patterns at ${difficulty}`);
  }
  const seen = new Set<string>();
  const items: BankItem[] = [];
  let stagnant = 0;
  const roundLimit = skillId === "confused-words" ? 420 : 280;
  const stagnantLimit = skillId === "confused-words" ? 48 : 20;
  const draws = skillId === "confused-words" ? 28 : 12;
  for (let round = 0; round < roundLimit && items.length < target && stagnant < stagnantLimit; round += 1) {
    let added = 0;
    for (const slot of patterns) {
      for (let n = 0; n < draws; n += 1) {
        const rng = new Rng(seedFor(round, n, slot.order, difficulty));
        const built = slot.entry.build(rng, difficulty);
        if (seen.has(built.key)) continue;
        const blob = [
          built.prompt,
          built.stimulus ?? "",
          built.answer,
          built.explanation ?? "",
          ...(built.choices ?? []),
        ].join("\n");
        if (PLACEHOLDER.test(blob) || STUB.test(blob)) {
          throw new Error(`${skillId} ${difficulty} produced a stub: ${built.key}`);
        }
        if (built.type === "multiple-choice") {
          const match = /^([A-Z])\. (.+)$/.exec(built.answer);
          if (!match || !built.choices || built.choices.length < 2) {
            throw new Error(`${skillId} bad multiple choice: ${built.answer}`);
          }
          const letter = match[1] ?? "";
          const text = match[2] ?? "";
          if (built.choices[letter.charCodeAt(0) - 65] !== text) {
            throw new Error(`${skillId} answer letter mismatch: ${built.answer}`);
          }
        } else if (built.lines <= 0) {
          throw new Error(`${skillId} ${built.type} needs answer lines`);
        }
        seen.add(built.key);
        added += 1;
        const item: BankItem = {
          patternId: slot.entry.id,
          order: slot.order,
          type: built.type,
          prompt: built.prompt,
          lines: built.lines,
          answer: built.answer,
          key: built.key,
        };
        if (built.stimulus) item.stimulus = built.stimulus;
        if (built.choices) item.choices = built.choices;
        if (built.explanation) item.explanation = built.explanation;
        items.push(item);
        if (items.length >= target) break;
      }
      if (items.length >= target) break;
    }
    stagnant = added === 0 ? stagnant + 1 : 0;
  }
  const minimum = harvestMinimum(skillId);
  if (items.length < minimum) {
    throw new Error(`${skillId} at ${difficulty} only harvested ${items.length} unique items; need ${minimum}`);
  }
  items.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
  return items;
}

function swiftString(value: string): string {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`;
}

function swiftArray(values: readonly string[]): string {
  return `[${values.map(swiftString).join(", ")}]`;
}

function emitCatalog(): string {
  const categories = CATEGORIES.map(
    (category) =>
      `        Category(id: .${swiftCase(category.id)}, name: ${swiftString(category.name)}, blurb: ${swiftString(category.blurb)})`,
  ).join(",\n");
  const skills = SKILLS.map(
    (skill) => `        Skill(
            id: ${swiftString(skill.id)},
            name: ${swiftString(skill.name)},
            category: .${swiftCase(skill.category)},
            summary: ${swiftString(skill.summary)},
            directions: ${swiftString(skill.directions)},
            gradeBands: [${skill.gradeBands.map((band) => `.${swiftCase(band)}`).join(", ")}],
            keywords: ${swiftArray(skill.keywords)}
        )`,
  ).join(",\n");
  return `// Generated by scripts/export-ios-content.ts. Do not edit by hand.
import Foundation

extension Catalog {
    public static let categories: [Category] = [
${categories}
    ]

    public static let skills: [Skill] = [
${skills}
    ]
}
`;
}

function swiftCase(id: string): string {
  const map: Record<string, string> = {
    "parts-of-speech": "partsOfSpeech",
    agreement: "agreement",
    "sentence-structure": "sentenceStructure",
    punctuation: "punctuation",
    usage: "usage",
    "7-8": "grades7to8",
    "9-10": "grades9to10",
    "11-12": "grades11to12",
  };
  const name = map[id];
  if (!name) throw new Error(`No Swift case for ${id}`);
  return name;
}

const items: Record<string, Record<string, BankItem[]>> = {};
for (const skill of SKILLS) {
  items[skill.id] = {};
  for (const difficulty of DIFFICULTIES) {
    const harvested = harvest(skill.id, difficulty);
    items[skill.id][difficulty] = harvested;
    process.stdout.write(`${skill.id} ${difficulty}: ${harvested.length}\n`);
  }
}

const bank = {
  version: 1,
  items,
};
const bankPath = resolve(iosRoot, "Resources/item-bank.json");
const catalogPath = resolve(iosRoot, "CatalogData.swift");
writeFileSync(bankPath, `${JSON.stringify(bank)}\n`);
writeFileSync(catalogPath, emitCatalog());
const bytes = Buffer.byteLength(JSON.stringify(bank));
process.stdout.write(`Wrote ${bankPath} (${bytes} bytes) and ${catalogPath}\n`);
