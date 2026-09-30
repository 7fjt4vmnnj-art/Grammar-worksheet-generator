import type { Pattern } from "./engine";
import {
  adjectiveAdverbPatterns,
  conjunctionPatterns,
  interjectionPatterns,
  nounPatterns,
  prepositionPatterns,
  pronounPatterns,
  verbPatterns,
} from "./parts-of-speech";
import {
  antecedentPatterns,
  casePatterns,
  moodPatterns,
  parallelPatterns,
  subjectVerbPatterns,
  tensePatterns,
  voicePatterns,
} from "./agreement";
import {
  clausePatterns,
  combiningPatterns,
  fragmentPatterns,
  modifierPatterns,
  phrasePatterns,
  runOnPatterns,
  sentenceTypePatterns,
} from "./sentences";
import {
  apostrophePatterns,
  commaPatterns,
  endPunctuationPatterns,
  hyphenPatterns,
  quotationPatterns,
  semicolonColonPatterns,
  titlePatterns,
} from "./punctuation";
import {
  capitalizationPatterns,
  comparativePatterns,
  confusedWordPatterns,
  doubleNegativePatterns,
  numberPatterns,
  registerPatterns,
} from "./usage";
import { EXTRA_PATTERNS } from "./expanded";

export const SKILL_PATTERNS: Record<string, Pattern[]> = {
  nouns: nounPatterns,
  pronouns: pronounPatterns,
  verbs: [...verbPatterns, ...(EXTRA_PATTERNS.verbs ?? [])],
  "adjectives-adverbs": [...adjectiveAdverbPatterns, ...(EXTRA_PATTERNS["adjectives-adverbs"] ?? [])],
  prepositions: [...prepositionPatterns, ...(EXTRA_PATTERNS.prepositions ?? [])],
  conjunctions: [...conjunctionPatterns, ...(EXTRA_PATTERNS.conjunctions ?? [])],
  interjections: [...interjectionPatterns, ...(EXTRA_PATTERNS.interjections ?? [])],
  "subject-verb-agreement": subjectVerbPatterns,
  "pronoun-antecedent": [...antecedentPatterns, ...(EXTRA_PATTERNS["pronoun-antecedent"] ?? [])],
  "pronoun-case": casePatterns,
  "verb-tense": [...tensePatterns, ...(EXTRA_PATTERNS["verb-tense"] ?? [])],
  "verb-mood": [...moodPatterns, ...(EXTRA_PATTERNS["verb-mood"] ?? [])],
  "active-passive": voicePatterns,
  "parallel-structure": parallelPatterns,
  clauses: [...clausePatterns, ...(EXTRA_PATTERNS.clauses ?? [])],
  "sentence-types": [...sentenceTypePatterns, ...(EXTRA_PATTERNS["sentence-types"] ?? [])],
  phrases: [...phrasePatterns, ...(EXTRA_PATTERNS.phrases ?? [])],
  fragments: [...fragmentPatterns, ...(EXTRA_PATTERNS.fragments ?? [])],
  "run-ons": runOnPatterns,
  modifiers: modifierPatterns,
  "combining-sentences": combiningPatterns,
  "end-punctuation": endPunctuationPatterns,
  commas: [...commaPatterns, ...(EXTRA_PATTERNS.commas ?? [])],
  "semicolons-colons": [...semicolonColonPatterns, ...(EXTRA_PATTERNS["semicolons-colons"] ?? [])],
  apostrophes: [...apostrophePatterns, ...(EXTRA_PATTERNS.apostrophes ?? [])],
  "quotation-marks": quotationPatterns,
  "hyphens-dashes": [...hyphenPatterns, ...(EXTRA_PATTERNS["hyphens-dashes"] ?? [])],
  titles: [...titlePatterns, ...(EXTRA_PATTERNS.titles ?? [])],
  "confused-words": confusedWordPatterns,
  "double-negatives": doubleNegativePatterns,
  "comparative-superlative": [...comparativePatterns, ...(EXTRA_PATTERNS["comparative-superlative"] ?? [])],
  capitalization: [...capitalizationPatterns, ...(EXTRA_PATTERNS.capitalization ?? [])],
  "numbers-abbreviations": [...numberPatterns, ...(EXTRA_PATTERNS["numbers-abbreviations"] ?? [])],
  "formal-informal": [...registerPatterns, ...(EXTRA_PATTERNS["formal-informal"] ?? [])],
};

export function patternsFor(skillId: string): Pattern[] {
  const patterns = SKILL_PATTERNS[skillId];
  if (!patterns) throw new Error(`No item generator for skill: ${skillId}`);
  return patterns;
}
