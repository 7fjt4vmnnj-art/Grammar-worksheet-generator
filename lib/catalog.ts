import type { Category, Grade, Skill } from "./types";
import { gradeBand } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "parts-of-speech",
    name: "Parts of speech & form",
    blurb: "How words work: nouns, pronouns, verbs, modifiers, and the words that connect them.",
  },
  {
    id: "agreement",
    name: "Agreement & consistency",
    blurb: "Subjects and verbs, pronouns and antecedents, tense, mood, voice, and parallel form.",
  },
  {
    id: "sentence-structure",
    name: "Sentence structure",
    blurb: "Clauses, sentence types, phrases, fragments, run-ons, modifiers, and sentence combining.",
  },
  {
    id: "punctuation",
    name: "Punctuation",
    blurb: "End marks, commas, semicolons, colons, apostrophes, dialogue, dashes, and titles.",
  },
  {
    id: "usage",
    name: "Usage & mechanics",
    blurb: "Word choice, negatives, comparison, capitalization, numbers, and register.",
  },
];

export const SKILLS: Skill[] = [
  {
    id: "nouns",
    name: "Nouns",
    category: "parts-of-speech",
    summary: "Common and proper, concrete and abstract, and collective nouns.",
    directions:
      "Identify nouns and label the kind each item asks for: common or proper, concrete or abstract, and collective.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["common", "proper", "concrete", "abstract", "collective"],
  },
  {
    id: "pronouns",
    name: "Pronouns",
    category: "parts-of-speech",
    summary:
      "Personal, possessive, reflexive, relative, indefinite, and demonstrative pronouns.",
    directions:
      "Find the pronoun, or name its type: personal, possessive, reflexive, relative, indefinite, or demonstrative.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["antecedent", "relative", "reflexive", "indefinite", "demonstrative"],
  },
  {
    id: "verbs",
    name: "Verbs",
    category: "parts-of-speech",
    summary: "Action, linking, and helping verbs; transitive and intransitive verbs.",
    directions:
      "Identify verbs as action, linking, or helping. When asked, also label a verb transitive or intransitive.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["linking", "helping", "transitive", "intransitive", "action"],
  },
  {
    id: "adjectives-adverbs",
    name: "Adjectives & adverbs",
    category: "parts-of-speech",
    summary: "Modifiers and the positive, comparative, and superlative degrees.",
    directions:
      "Tell adjectives from adverbs, and identify positive, comparative, and superlative forms.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["modifier", "comparative", "superlative", "degree"],
  },
  {
    id: "prepositions",
    name: "Prepositions & prepositional phrases",
    category: "parts-of-speech",
    summary: "Prepositions, the phrases they introduce, and look-alike conjunctions.",
    directions:
      "Identify prepositions and prepositional phrases. When asked, tell a preposition from a subordinating conjunction.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["phrase", "object of the preposition"],
  },
  {
    id: "conjunctions",
    name: "Conjunctions",
    category: "parts-of-speech",
    summary: "Coordinating, subordinating, and correlative conjunctions.",
    directions:
      "Identify coordinating, subordinating, and correlative conjunctions, and choose the conjunction that fits the relationship between ideas.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["fanboys", "coordinating", "subordinating", "correlative", "although", "either or"],
  },
  {
    id: "interjections",
    name: "Interjections",
    category: "parts-of-speech",
    summary: "Interjections and the punctuation that fits their strength.",
    directions:
      "Identify interjections and punctuate them. A strong interjection takes an exclamation point; a mild one is usually set off with a comma.",
    gradeBands: ["7-8"],
    keywords: ["exclamation", "wow", "oh"],
  },
  {
    id: "subject-verb-agreement",
    name: "Subject–verb agreement",
    category: "agreement",
    summary:
      "Basic agreement, compound subjects, indefinite pronouns, and intervening phrases.",
    directions:
      "Choose or write the verb that agrees with the subject in number. Watch for compound subjects, indefinite pronouns, and phrases between the subject and the verb.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["sva", "singular", "plural", "indefinite", "compound subject"],
  },
  {
    id: "pronoun-antecedent",
    name: "Pronoun–antecedent agreement",
    category: "agreement",
    summary: "Pronouns that match their antecedents in number and person.",
    directions:
      "Choose the pronoun that matches its antecedent in number and person. These items use clear antecedents and do not test singular they.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["antecedent", "their", "its", "agreement"],
  },
  {
    id: "pronoun-case",
    name: "Pronoun case",
    category: "agreement",
    summary: "Subjective, objective, and possessive case, including who and whom.",
    directions:
      "Choose the case the pronoun's job requires: subjective (I, she, who), objective (me, her, whom), or possessive (my, her, whose).",
    gradeBands: ["9-10", "11-12"],
    keywords: ["who", "whom", "i me", "subjective", "objective", "possessive"],
  },
  {
    id: "verb-tense",
    name: "Verb tense consistency",
    category: "agreement",
    summary: "Keeping tense steady unless the meaning calls for a shift.",
    directions:
      "Keep the verb tense consistent unless the meaning requires a change. Choose or write the form that matches the time already established.",
    gradeBands: ["7-8", "9-10", "11-12"],
    keywords: ["tense", "shift", "past", "present", "perfect"],
  },
  {
    id: "verb-mood",
    name: "Verb mood",
    category: "agreement",
    summary: "Indicative, imperative, and subjunctive mood.",
    directions:
      "Identify indicative, imperative, and subjunctive mood. Use the subjunctive for wishes, hypothetical conditions, and demands (if I were; insist that she be).",
    gradeBands: ["11-12"],
    keywords: ["subjunctive", "imperative", "indicative", "were", "mood"],
  },
  {
    id: "active-passive",
    name: "Active vs. passive voice",
    category: "agreement",
    summary: "Identifying whether a sentence is active or passive, then rewriting it in the opposite voice.",
    directions:
      "Identify whether each sentence is active or passive, then rewrite it in the opposite voice. Keep the tense the same.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["voice", "agent", "by"],
  },
  {
    id: "parallel-structure",
    name: "Parallel structure",
    category: "agreement",
    summary: "Matching grammatical form in a series and with correlative pairs.",
    directions:
      "Make items in a series, and items joined by pairs such as not only / but also, match in grammatical form.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["parallelism", "series", "not only", "correlative"],
  },
  {
    id: "clauses",
    name: "Independent & dependent clauses",
    category: "sentence-structure",
    summary: "Clauses that can stand alone and clauses that cannot.",
    directions:
      "Tell independent clauses from dependent clauses, and identify the clause the item names.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["subordinate", "main clause", "dependent", "independent"],
  },
  {
    id: "sentence-types",
    name: "Sentence types",
    category: "sentence-structure",
    summary: "Simple, compound, complex, and compound-complex sentences.",
    directions:
      "Classify each sentence as simple, compound, complex, or compound-complex.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["simple", "compound", "complex", "compound-complex", "variety"],
  },
  {
    id: "phrases",
    name: "Phrases",
    category: "sentence-structure",
    summary: "Appositive, participial, gerund, infinitive, and absolute phrases.",
    directions:
      "Identify the italicized phrase as appositive, participial, gerund, infinitive, or absolute.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["appositive", "participial", "gerund", "infinitive", "absolute"],
  },
  {
    id: "fragments",
    name: "Sentence fragments",
    category: "sentence-structure",
    summary: "Groups of words that are missing a subject, a verb, or a complete thought.",
    directions:
      "Decide whether a group of words is a fragment or a complete sentence. When asked, rewrite a fragment as a complete sentence.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["fragment", "complete sentence", "dependent clause"],
  },
  {
    id: "run-ons",
    name: "Run-ons & comma splices",
    category: "sentence-structure",
    summary: "Two independent clauses joined incorrectly, and how to repair them.",
    directions:
      "Identify run-ons and comma splices. Repair them with the method the item names: a period, a semicolon, or a coordinating conjunction.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["comma splice", "fused sentence", "run on"],
  },
  {
    id: "modifiers",
    name: "Misplaced & dangling modifiers",
    category: "sentence-structure",
    summary: "Modifiers that sit too far from the word they describe, or that have no word to describe.",
    directions:
      "Rewrite so each modifier sits next to the word it describes. If a modifier dangles, give the sentence a clear subject. Answers may vary; the key shows one strong revision.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["dangling", "misplaced", "modifier"],
  },
  {
    id: "combining-sentences",
    name: "Combining & expanding sentences",
    category: "sentence-structure",
    summary: "Joining short sentences into compound or complex sentences.",
    directions:
      "Combine the sentences into one sentence using the structure the item requests. The key shows one strong model; wording may vary slightly.",
    gradeBands: ["7-8", "9-10", "11-12"],
    keywords: ["combine", "expand", "sentence variety"],
  },
  {
    id: "end-punctuation",
    name: "End punctuation",
    category: "punctuation",
    summary: "Periods, question marks, and exclamation points, including indirect questions.",
    directions:
      "Choose the end mark. Direct questions take a question mark. Statements, commands, and indirect questions take a period. Use an exclamation point only for strong emotion.",
    gradeBands: ["7-8"],
    keywords: ["period", "question mark", "exclamation", "indirect question"],
  },
  {
    id: "commas",
    name: "Commas",
    category: "punctuation",
    summary:
      "Lists, compound sentences, introductory elements, nonrestrictive clauses, and appositives.",
    directions:
      "Add commas where they are needed, including the Oxford comma in a list. If the sentence needs no comma, write correct.",
    gradeBands: ["7-8", "9-10", "11-12"],
    keywords: ["oxford", "series", "introductory", "nonrestrictive", "appositive", "comma"],
  },
  {
    id: "semicolons-colons",
    name: "Semicolons & colons",
    category: "punctuation",
    summary: "Joining independent clauses and introducing lists or explanations.",
    directions:
      "Choose a semicolon, a colon, or no extra mark. Use a semicolon between independent clauses. Use a colon only after a complete sentence that introduces a list or an explanation.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["semicolon", "colon", "therefore", "however"],
  },
  {
    id: "apostrophes",
    name: "Apostrophes",
    category: "punctuation",
    summary: "Possession, including plural possessives, and contractions.",
    directions:
      "Choose the form that shows possession or a contraction correctly. A plural noun ending in s takes an apostrophe after the s. Possessive pronouns such as its and your take no apostrophe.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["possession", "contraction", "plural possessive", "its"],
  },
  {
    id: "quotation-marks",
    name: "Quotation marks & dialogue",
    category: "punctuation",
    summary: "American dialogue punctuation, including interrupted quotations.",
    directions:
      "Punctuate dialogue in American style. Commas and periods go inside closing quotation marks. Use a comma before a quotation that follows a speaker tag.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["dialogue", "quotes", "speaker tag"],
  },
  {
    id: "hyphens-dashes",
    name: "Hyphens, dashes & parentheses",
    category: "punctuation",
    summary: "Compound modifiers, breaks in a sentence, and quiet asides.",
    directions:
      "Choose a hyphen, an em dash, or parentheses. Hyphenate a compound modifier before a noun. Use an em dash for a sharp break and parentheses for a quiet aside.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["hyphen", "em dash", "parentheses", "compound modifier"],
  },
  {
    id: "titles",
    name: "Titles",
    category: "punctuation",
    summary: "Italics for long works and quotation marks for short works.",
    directions:
      "Italicize titles of long works (books, films, newspapers, albums, and plays). Put quotation marks around titles of short works (stories, poems, articles, songs, and chapters). When handwriting, underline a title that should be italicized. In typed answers, mark italics with asterisks, as in *The Giver*.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["italics", "underline", "quotation marks", "book title", "poem"],
  },
  {
    id: "confused-words",
    name: "Commonly confused words",
    category: "usage",
    summary: "Pairs such as its/it’s, affect/effect, their/there/they’re, and who/whom.",
    directions: "Choose the word that fits the meaning and grammar of the sentence.",
    gradeBands: ["7-8", "9-10", "11-12"],
    keywords: [
      "its",
      "it's",
      "affect",
      "effect",
      "their",
      "there",
      "they're",
      "who",
      "whom",
      "lay",
      "lie",
      "homophone",
      "hear",
      "here",
    ],
  },
  {
    id: "double-negatives",
    name: "Double negatives",
    category: "usage",
    summary: "Sentences that stack two negatives and how to say them once.",
    directions:
      "Rewrite so the sentence has only one negative and keeps the original meaning. Follow the wording the item asks you to keep.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["negative", "hardly", "scarcely", "not no"],
  },
  {
    id: "comparative-superlative",
    name: "Comparative vs. superlative",
    category: "usage",
    summary: "Comparing two things or more than two, including irregular forms.",
    directions:
      "Use the comparative (-er or more) to compare two things and the superlative (-est or most) to compare three or more. Avoid double forms such as more better.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["better", "best", "worse", "more", "most", "fewer"],
  },
  {
    id: "capitalization",
    name: "Capitalization",
    category: "usage",
    summary: "Proper nouns, titles before names, regions, seasons, and first words.",
    directions:
      "Rewrite with correct capitalization. Capitalize the first word of a sentence, proper nouns, months, holidays, languages, and titles used directly before names. Do not capitalize seasons or compass directions.",
    gradeBands: ["7-8", "9-10"],
    keywords: ["proper noun", "capital", "title", "season"],
  },
  {
    id: "numbers-abbreviations",
    name: "Numbers & abbreviations",
    category: "usage",
    summary: "When to spell out numbers, and how abbreviations work in formal prose.",
    directions:
      "Follow these classroom rules: spell out a number that begins a sentence; spell out one through nine, and use numerals for 10 and above; use numerals for times with a.m. or p.m.; spell out room and meeting in formal prose; use a period in titles such as Dr. and Ms.",
    gradeBands: ["9-10", "11-12"],
    keywords: ["numerals", "abbreviation", "a.m.", "percent"],
  },
  {
    id: "formal-informal",
    name: "Formal vs. informal register",
    category: "usage",
    summary: "Shifting slang and casual wording into academic prose.",
    directions:
      "Choose the most formal option, or rewrite informal wording in a formal academic register without changing the meaning. The key shows one strong model when wording may vary.",
    gradeBands: ["11-12"],
    keywords: ["register", "tone", "slang", "academic", "formal"],
  },
];

const skillMap = new Map(SKILLS.map((skill) => [skill.id, skill]));

export function getSkill(id: string): Skill {
  const skill = skillMap.get(id);
  if (!skill) throw new Error(`Unknown skill: ${id}`);
  return skill;
}

export function isRecommended(skill: Skill, grade: Grade): boolean {
  return skill.gradeBands.includes(gradeBand(grade));
}

export function skillsInCategory(category: Category["id"]): Skill[] {
  return SKILLS.filter((skill) => skill.category === category);
}
