export type RichStyle = "regular" | "bold" | "italic" | "bolditalic";

export interface RichSpan {
  text: string;
  style: RichStyle;
}

/** Lightweight markup: *italics* and **bold**. */
export function parseRich(input: string): RichSpan[] {
  const spans: RichSpan[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const match of input.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) {
      spans.push({ text: input.slice(last, index), style: "regular" });
    }
    if (match[1] !== undefined) spans.push({ text: match[1], style: "bold" });
    else spans.push({ text: match[2] ?? "", style: "italic" });
    last = index + match[0].length;
  }
  if (last < input.length) {
    spans.push({ text: input.slice(last), style: "regular" });
  }
  if (spans.length === 0) spans.push({ text: "", style: "regular" });
  return spans;
}
