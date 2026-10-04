import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
  type RGB,
} from "pdf-lib";
import { directionsCoverItemPrompts } from "./catalog";
import { answerLineCount, layoutItemPrompts, type Worksheet, type WorksheetItem } from "./types";
import { DIFFICULTY_LABEL } from "./types";
import { parseRich, type RichSpan, type RichStyle } from "./rich";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const TOP = 46;
const BOTTOM = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const WRITE_IN_LEAD = 28;
const WRITE_IN_TRAIL = 6;
const WORKSHEET_ITEM_GAP = 18;
const ANSWER_KEY_ITEM_GAP = 8;
const WORKSHEET_PROMPT_GAP = 8;
const ANSWER_KEY_PROMPT_GAP = 4;

const INK = rgb(0.11, 0.1, 0.08);
const MUTED = rgb(0.34, 0.31, 0.27);
const GREEN = rgb(0.12, 0.3, 0.22);
const RULE = rgb(0.72, 0.66, 0.56);
const BOX = rgb(0.965, 0.955, 0.935);

type Fonts = Record<RichStyle, PDFFont> & { sans: PDFFont; sansBold: PDFFont };
type Kind = "worksheet" | "answer-key";

interface Pen {
  doc: PDFDocument;
  page: PDFPage;
  cursor: number;
  pages: PDFPage[];
  fonts: Fonts;
  worksheet: Worksheet;
  kind: Kind;
}

export async function buildPdf(worksheet: Worksheet, kind: Kind): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${worksheet.meta.title} (${kind === "worksheet" ? "worksheet" : "answer key"})`);
  doc.setAuthor(worksheet.meta.teacher || "Grammar Worksheet Generator");
  doc.setSubject(`Grade ${worksheet.meta.grade} grammar practice`);
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.TimesRoman),
    bold: await doc.embedFont(StandardFonts.TimesRomanBold),
    italic: await doc.embedFont(StandardFonts.TimesRomanItalic),
    bolditalic: await doc.embedFont(StandardFonts.TimesRomanBoldItalic),
    sans: await doc.embedFont(StandardFonts.Helvetica),
    sansBold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const pen: Pen = { doc, page, cursor: PAGE_HEIGHT - TOP, pages: [page], fonts, worksheet, kind };

  drawFirstHeader(pen);
  if (worksheet.warning && kind === "worksheet") {
    drawParagraph(pen, worksheet.warning, 9, MUTED, fonts.italic, 12);
    pen.cursor -= 6;
  }

  for (const section of worksheet.sections) {
    const directionHeight = worksheet.meta.includeDirections
      ? measureBox(fonts, section.directions) + 8
      : 0;
    ensure(pen, 16 + directionHeight + 36);
    drawTracked(pen, section.skillName.toUpperCase());
    if (worksheet.meta.includeDirections) {
      drawBox(pen, section.directions);
      pen.cursor -= 8;
    }
    const laidOut = layoutItemPrompts(
      section.items,
      worksheet.meta.includeDirections,
      directionsCoverItemPrompts(section.skillId),
    );
    section.items.forEach((item, index) => {
      const layout = laidOut[index] ?? { prompt: "", groupPrompt: "" };
      const promptGap = pen.kind === "worksheet" ? WORKSHEET_PROMPT_GAP : ANSWER_KEY_PROMPT_GAP;
      const itemGap = pen.kind === "worksheet" ? WORKSHEET_ITEM_GAP : ANSWER_KEY_ITEM_GAP;
      if (index > 0 && (layout.groupPrompt || layout.prompt)) pen.cursor -= promptGap;
      if (layout.groupPrompt) drawLead(pen, layout.groupPrompt);
      drawItem(pen, item, layout.prompt);
      pen.cursor -= itemGap;
    });
    pen.cursor -= 6;
  }

  const total = pen.pages.length;
  const skillLine = fitText(
    fonts.sans,
    `Skills: ${worksheet.meta.skillNames.join(" · ")}`,
    8,
    CONTENT_WIDTH - 90,
  );
  pen.pages.forEach((current, index) => {
    current.drawLine({
      start: { x: MARGIN_X, y: 36 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: 36 },
      thickness: 0.4,
      color: RULE,
    });
    current.drawText(skillLine, { x: MARGIN_X, y: 24, size: 8, font: fonts.sans, color: MUTED });
    const pageLabel = `Page ${index + 1} of ${total}`;
    const pageWidth = fonts.sans.widthOfTextAtSize(pageLabel, 8);
    current.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN_X - pageWidth,
      y: 24,
      size: 8,
      font: fonts.sans,
      color: MUTED,
    });
  });

  return doc.save();
}

function newPage(pen: Pen) {
  pen.page = pen.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pen.pages.push(pen.page);
  pen.cursor = PAGE_HEIGHT - TOP;
  pen.page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 8, width: PAGE_WIDTH, height: 8, color: GREEN });
  const label = `${pen.kind === "answer-key" ? "Answer key" : "Worksheet"} · ${pen.worksheet.meta.title} · Grade ${pen.worksheet.meta.grade}`;
  pen.page.drawText(fitText(pen.fonts.sans, label, 9, CONTENT_WIDTH), {
    x: MARGIN_X,
    y: pen.cursor - 9,
    size: 9,
    font: pen.fonts.sans,
    color: MUTED,
  });
  pen.cursor -= 22;
}

function ensure(pen: Pen, height: number) {
  if (pen.cursor - height < BOTTOM) newPage(pen);
}

function drawFirstHeader(pen: Pen) {
  const { page, fonts, worksheet, kind } = pen;
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 10, width: PAGE_WIDTH, height: 10, color: GREEN });
  const kicker = kind === "answer-key" ? "ANSWER KEY" : "GRAMMAR WORKSHEET";
  page.drawText(kicker, { x: MARGIN_X, y: pen.cursor - 9, size: 9, font: fonts.sansBold, color: GREEN });
  const grade = `Grade ${worksheet.meta.grade}`;
  page.drawText(grade, {
    x: PAGE_WIDTH - MARGIN_X - fonts.sansBold.widthOfTextAtSize(grade, 9),
    y: pen.cursor - 9,
    size: 9,
    font: fonts.sansBold,
    color: GREEN,
  });
  pen.cursor -= 20;
  for (const line of wrapPlain(worksheet.meta.title, fonts.bold, 18, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN_X, y: pen.cursor - 18, size: 18, font: fonts.bold, color: INK });
    pen.cursor -= 22;
  }
  const meta = [
    worksheet.meta.teacher ? `Teacher: ${worksheet.meta.teacher}` : "",
    worksheet.meta.className ? `Class: ${worksheet.meta.className}` : "",
    worksheet.meta.date ? `Date: ${worksheet.meta.date}` : "",
    DIFFICULTY_LABEL[worksheet.meta.difficulty],
    `Seed ${worksheet.meta.seed}`,
  ]
    .filter(Boolean)
    .join("   ·   ");
  drawParagraph(pen, meta, 9, MUTED, fonts.sans, 12);
  if (kind === "worksheet") {
    pen.cursor -= 4;
    page.drawText("Name ________________________________    Period ________", {
      x: MARGIN_X,
      y: pen.cursor - 11,
      size: 11,
      font: fonts.regular,
      color: INK,
    });
    pen.cursor -= 18;
  } else {
    drawParagraph(
      pen,
      "Teacher copy. When a revision can be worded more than one way, one strong model is shown.",
      9,
      MUTED,
      fonts.italic,
      12,
    );
  }
  pen.cursor -= 4;
  pen.page.drawLine({
    start: { x: MARGIN_X, y: pen.cursor },
    end: { x: PAGE_WIDTH - MARGIN_X, y: pen.cursor },
    thickness: 0.8,
    color: GREEN,
  });
  pen.cursor -= 14;
}

function drawItem(pen: Pen, item: WorksheetItem, prompt: string) {
  const promptLines = prompt.trim()
    ? wrapRich(parseRich(prompt), pen.fonts, 11, CONTENT_WIDTH - 22)
    : [];
  const stimulusLines = item.stimulus
    ? wrapRich(parseRich(item.stimulus), pen.fonts, 11, CONTENT_WIDTH - 22)
    : [];
  const choiceBlocks = (item.choices ?? []).map((choice) =>
    wrapRich(parseRich(choice), pen.fonts, 11, CONTENT_WIDTH - 40),
  );
  const answerLines =
    pen.kind === "answer-key"
      ? wrapRich(parseRich(`Answer: ${item.answer}`), pen.fonts, 11, CONTENT_WIDTH - 22)
      : [];
  const explanationLines =
    pen.kind === "answer-key" && item.explanation
      ? wrapRich(parseRich(item.explanation), pen.fonts, 9, CONTENT_WIDTH - 22)
      : [];
  const blankHeight =
    pen.kind === "worksheet" && answerLineCount(item.type, item.lines) > 0
      ? WRITE_IN_LEAD + WRITE_IN_TRAIL
      : 0;
  const height =
    promptLines.length * 15 +
    (stimulusLines.length ? stimulusLines.length * 15 + 3 : 0) +
    choiceBlocks.reduce((sum, lines) => sum + Math.max(1, lines.length) * 15, 0) +
    answerLines.length * 15 +
    explanationLines.length * 13 +
    blankHeight +
    6;
  ensure(pen, Math.min(height, 120));

  pen.page.drawText(`${item.number}.`, {
    x: MARGIN_X,
    y: pen.cursor - 11,
    size: 11,
    font: pen.fonts.bold,
    color: INK,
  });
  if (promptLines.length) drawRich(pen, promptLines, MARGIN_X + 22, 11, INK);
  if (stimulusLines.length) {
    if (promptLines.length) pen.cursor -= 2;
    drawRich(pen, stimulusLines, MARGIN_X + 22, 11, INK);
  }
  choiceBlocks.forEach((lines, index) => {
    ensure(pen, Math.max(1, lines.length) * 15);
    pen.page.drawText(`${"ABCDEFGH"[index] ?? "?"}.`, {
      x: MARGIN_X + 22,
      y: pen.cursor - 11,
      size: 11,
      font: pen.fonts.bold,
      color: INK,
    });
    drawRich(pen, lines, MARGIN_X + 40, 11, INK);
  });
  if (pen.kind === "answer-key") {
    pen.cursor -= 1;
    drawRich(pen, answerLines, MARGIN_X + 22, 11, GREEN);
    if (explanationLines.length) drawRich(pen, explanationLines, MARGIN_X + 22, 9, MUTED);
  } else if (answerLineCount(item.type, item.lines) > 0) {
    ensure(pen, WRITE_IN_LEAD + WRITE_IN_TRAIL);
    pen.cursor -= WRITE_IN_LEAD;
    pen.page.drawLine({
      start: { x: MARGIN_X + 22, y: pen.cursor },
      end: { x: PAGE_WIDTH - MARGIN_X, y: pen.cursor },
      thickness: 0.6,
      color: RULE,
    });
    pen.cursor -= WRITE_IN_TRAIL;
  }
}

function drawLead(pen: Pen, text: string) {
  const spans = parseRich(text).map((span) => ({
    text: span.text,
    style: span.style === "regular" ? ("italic" as const) : span.style === "bold" ? ("bolditalic" as const) : span.style,
  }));
  const lines = wrapRich(spans, pen.fonts, 11, CONTENT_WIDTH);
  ensure(pen, lines.length * 15 + 6 + 120);
  drawRich(pen, lines, MARGIN_X, 11, INK);
  pen.cursor -= 6;
}

function drawTracked(pen: Pen, text: string) {
  ensure(pen, 18);
  let x = MARGIN_X;
  const baseline = pen.cursor - 9;
  for (const char of text) {
    pen.page.drawText(char, { x, y: baseline, size: 9, font: pen.fonts.sansBold, color: GREEN });
    x += pen.fonts.sansBold.widthOfTextAtSize(char, 9) + 0.45;
  }
  pen.cursor -= 16;
}

function drawBox(pen: Pen, text: string) {
  const lines = wrapPlain(text, pen.fonts.italic, 10, CONTENT_WIDTH - 16);
  const height = lines.length * 13 + 10;
  ensure(pen, height);
  pen.page.drawRectangle({
    x: MARGIN_X,
    y: pen.cursor - height,
    width: CONTENT_WIDTH,
    height,
    color: BOX,
    borderColor: RULE,
    borderWidth: 0.6,
  });
  let y = pen.cursor - 8;
  for (const line of lines) {
    pen.page.drawText(line, {
      x: MARGIN_X + 8,
      y: y - 10,
      size: 10,
      font: pen.fonts.italic,
      color: INK,
    });
    y -= 13;
  }
  pen.cursor -= height;
}

function measureBox(fonts: Fonts, text: string): number {
  return wrapPlain(text, fonts.italic, 10, CONTENT_WIDTH - 16).length * 13 + 10;
}

function drawParagraph(
  pen: Pen,
  text: string,
  size: number,
  color: RGB,
  font: PDFFont,
  lineHeight: number,
) {
  for (const line of wrapPlain(text, font, size, CONTENT_WIDTH)) {
    ensure(pen, lineHeight);
    pen.page.drawText(line, { x: MARGIN_X, y: pen.cursor - size, size, font, color });
    pen.cursor -= lineHeight;
  }
}

function drawRich(pen: Pen, lines: RichSpan[][], x: number, size: number, color: RGB) {
  const lineHeight = size * 1.35;
  for (const line of lines) {
    ensure(pen, lineHeight);
    let cx = x;
    const baseline = pen.cursor - size;
    for (const span of line) {
      if (!span.text) continue;
      const font = pen.fonts[span.style];
      pen.page.drawText(span.text, { x: cx, y: baseline, size, font, color });
      cx += font.widthOfTextAtSize(span.text, size);
    }
    pen.cursor -= lineHeight;
  }
}

function wrapRich(spans: RichSpan[], fonts: Fonts, size: number, maxWidth: number): RichSpan[][] {
  const tokens: Array<{ text: string; style: RichStyle; kind: "word" | "space" | "break" }> = [];
  for (const span of spans) {
    for (const part of span.text.split(/(\n)/)) {
      if (part === "\n") {
        tokens.push({ text: "", style: span.style, kind: "break" });
        continue;
      }
      for (const bit of part.split(/(\s+)/)) {
        if (!bit) continue;
        tokens.push({
          text: /^\s+$/.test(bit) ? " " : bit,
          style: span.style,
          kind: /^\s+$/.test(bit) ? "space" : "word",
        });
      }
    }
  }
  const lines: RichSpan[][] = [];
  let current: RichSpan[] = [];
  let width = 0;
  const pushLine = () => {
    lines.push(current.length ? current : [{ text: "", style: "regular" }]);
    current = [];
    width = 0;
  };
  for (const token of tokens) {
    if (token.kind === "break") {
      pushLine();
      continue;
    }
    const font = fonts[token.style];
    const tokenWidth = font.widthOfTextAtSize(token.text, size);
    if (token.kind === "space") {
      if (width > 0 && width + tokenWidth <= maxWidth) {
        current.push({ text: " ", style: token.style });
        width += tokenWidth;
      }
      continue;
    }
    if (tokenWidth > maxWidth) {
      if (width > 0) pushLine();
      let chunk = "";
      for (const char of token.text) {
        const next = chunk + char;
        if (font.widthOfTextAtSize(next, size) > maxWidth && chunk) {
          current.push({ text: chunk, style: token.style });
          pushLine();
          chunk = char;
        } else chunk = next;
      }
      if (chunk) {
        current.push({ text: chunk, style: token.style });
        width = font.widthOfTextAtSize(chunk, size);
      }
      continue;
    }
    if (width + tokenWidth > maxWidth && width > 0) pushLine();
    current.push({ text: token.text, style: token.style });
    width += tokenWidth;
  }
  if (current.length) pushLine();
  return lines.length ? lines : [[{ text: "", style: "regular" }]];
}

function wrapPlain(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let current = "";
    const pushWord = (word: string) => {
      if (font.widthOfTextAtSize(word, size) <= maxWidth) return word;
      let chunk = "";
      for (const char of word) {
        const trial = chunk + char;
        if (font.widthOfTextAtSize(trial, size) > maxWidth && chunk) {
          lines.push(chunk);
          chunk = char;
        } else chunk = trial;
      }
      return chunk;
    };
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        current = next;
        continue;
      }
      if (current) lines.push(current);
      current = pushWord(word);
    }
    if (current) lines.push(current);
  }
  return lines.length ? lines : [""];
}

function fitText(font: PDFFont, text: string, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 0 && font.widthOfTextAtSize(`${trimmed}…`, size) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed.trimEnd()}…`;
}
