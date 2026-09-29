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

## iOS app

A SwiftUI app for iPhone and iPad lives in `ios/`. It uses the same 34-skill catalog and the same item templates as the web generator. There is no login and no server: worksheets and answer keys are built on the device and shared through the system share sheet.

Minimum version is **iOS 17**. Open the project in **Xcode 15 or later** on a Mac.

```bash
open ios/GrammarWorksheets.xcodeproj
```

Choose an iPhone or iPad simulator (or a device) and press Run. If Xcode asks for a signing team, select your Personal Team. On iPhone, set the grade, skills, and options, then tap **Generate worksheet** to preview. On iPad, the preview stays beside the form. From the preview, share the worksheet PDF, the answer key PDF, or both.

The shared generator is a Swift package (`ios/Package.swift`) so the catalog, seeding, and worksheet assembly can be tested without a simulator:

```bash
cd ios
swift test
```

Question text is harvested from `lib/content` into `ios/Sources/GrammarCore/Resources/item-bank.json`. After changing the web catalog or item banks, refresh the iOS copy:

```bash
npm run export:ios
```

This Linux environment can compile and test that Swift package. It cannot launch the iOS Simulator, so the Xcode app target was not built here. The on-device PDFs use `UIGraphicsPDFRenderer` and PDFKit.

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
- `scripts/export-ios-content.ts` — refreshes the iOS catalog and item bank
- `ios/` — SwiftUI app and the `GrammarCore` package
