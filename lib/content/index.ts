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

export const SKILL_PATTERNS: Record<string, Pattern[]> = {
  nouns: nounPatterns,
  pronouns: pronounPatterns,
  verbs: verbPatterns,
  "adjectives-adverbs": adjectiveAdverbPatterns,
  prepositions: prepositionPatterns,
  conjunctions: conjunctionPatterns,
  interjections: interjectionPatterns,
  "subject-verb-agreement": subjectVerbPatterns,
  "pronoun-antecedent": antecedentPatterns,
  "pronoun-case": casePatterns,
  "verb-tense": tensePatterns,
  "verb-mood": moodPatterns,
  "active-passive": voicePatterns,
  "parallel-structure": parallelPatterns,
  clauses: clausePatterns,
  "sentence-types": sentenceTypePatterns,
  phrases: phrasePatterns,
  fragments: fragmentPatterns,
  "run-ons": runOnPatterns,
  modifiers: modifierPatterns,
  "combining-sentences": combiningPatterns,
  "end-punctuation": endPunctuationPatterns,
  commas: commaPatterns,
  "semicolons-colons": semicolonColonPatterns,
  apostrophes: apostrophePatterns,
  "quotation-marks": quotationPatterns,
  "hyphens-dashes": hyphenPatterns,
  titles: titlePatterns,
  "confused-words": confusedWordPatterns,
  "double-negatives": doubleNegativePatterns,
  "comparative-superlative": comparativePatterns,
  capitalization: capitalizationPatterns,
  "numbers-abbreviations": numberPatterns,
  "formal-informal": registerPatterns,
};

export function patternsFor(skillId: string): Pattern[] {
  const patterns = SKILL_PATTERNS[skillId];
  if (!patterns) throw new Error(`No item generator for skill: ${skillId}`);
  return patterns;
}
