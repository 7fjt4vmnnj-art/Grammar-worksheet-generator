# Grammar Worksheet Generator

A teacher-facing generator for middle and high school grammar practice (grades 7–12). Choose a grade and one or more skills, set a few options, then download a printable worksheet PDF and a matching answer-key PDF. No accounts and no database.

The catalog covers parts of speech, agreement, sentence structure, punctuation, and usage. Each skill can be selected on its own. Skills carry recommended grade bands (7–8, 9–10, 11–12) for filtering, and any grade can still use any skill. Difficulty changes the depth of the items: Developing for grades 7–8, Proficient for 9–10, and Advanced for 11–12, unless you override it.

Generation is seeded. The same grade, skills, question count, difficulty, and seed rebuild the same worksheet.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pick a quick start or select skills yourself, then choose **Generate worksheet**. Preview the student page and the answer key, then download the PDFs.

## Generate sample PDFs

```bash
npm run sample
```

This writes three pairs of PDFs under `samples/` (gitignored):

- Grade 7 core: nouns, subject–verb agreement, fragments, commas, commonly confused words
- Grade 10 sentences: clauses, sentence types, modifiers, parallel structure, semicolons and colons
- Grade 12 editing: verb mood, modifiers, hyphens and dashes, formal register, commas

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` confirms every skill can produce 25 unique items at each difficulty, and that grade 7 and grade 12 worksheets become real PDFs with matching answer keys.

## Classroom conventions

- American English, including the Oxford comma.
- A collective noun is singular when the group acts as one unit.
- Pronoun–antecedent items use a clear number (and a stated gender when gender matters). The generator does not infer gender from a name.
- Titles of long works are marked with asterisks in typed answers (`*The Giver*`), which print as italics. Students may underline those titles by hand. Short works take quotation marks.
- Numbers: spell out a number that starts a sentence; spell out one through nine; use numerals for 10 and above; use numerals for times with a.m. or p.m.
- When a rewrite can be worded more than one way, the answer key shows one strong model and says so.

## Project layout

- `lib/catalog.ts` — categories and the 34 skills
- `lib/content/` — item banks and the seeded generator
- `lib/generate.ts` — worksheet assembly
- `lib/pdf.ts` — worksheet and answer-key PDFs (`pdf-lib`)
- `components/` — the teacher screen and on-screen preview
- `scripts/sample.ts` — sample PDF export
