import type { Worksheet } from "@/lib/types";
import { DIFFICULTY_LABEL } from "@/lib/types";
import { parseRich, type RichSpan } from "@/lib/rich";

export default function Preview({
  worksheet,
  mode,
}: {
  worksheet: Worksheet | null;
  mode: "worksheet" | "answer-key";
}) {
  if (!worksheet) {
    return (
      <div className="print-area flex min-h-[640px] items-center justify-center rounded-sm border border-dashed border-line bg-card px-8 text-center shadow-paper">
        <div className="max-w-md">
          <p className="font-serif text-2xl text-ink">Your worksheet will appear here.</p>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            Choose a grade, select one or more skills, and generate. You can preview the
            student page and the answer key before downloading the PDFs.
          </p>
        </div>
      </div>
    );
  }

  const { meta } = worksheet;
  const answerKey = mode === "answer-key";

  return (
    <article className="print-area mx-auto min-h-[640px] max-w-[760px] bg-white px-8 py-8 text-ink shadow-paper sm:px-12">
      <div className="mb-4 h-2 bg-moss" />
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-moss">
          {answerKey ? "ANSWER KEY" : "GRAMMAR WORKSHEET"}
        </p>
        <p className="text-xs font-semibold tracking-[0.16em] text-moss">GRADE {meta.grade}</p>
      </div>
      <h2 className="mt-2 font-serif text-3xl leading-tight">{meta.title}</h2>
      <p className="mt-2 text-sm text-ink/70">
        {[
          meta.teacher ? `Teacher: ${meta.teacher}` : "",
          meta.className ? `Class: ${meta.className}` : "",
          meta.date ? `Date: ${meta.date}` : "",
          DIFFICULTY_LABEL[meta.difficulty],
          `Seed ${meta.seed}`,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {answerKey ? (
        <p className="mt-3 text-sm italic text-ink/70">
          Teacher copy. When a revision can be worded more than one way, one strong model is shown.
        </p>
      ) : (
        <p className="mt-4 font-serif text-base">
          Name ________________________________ &nbsp;&nbsp; Period ________
        </p>
      )}
      {worksheet.warning && !answerKey ? (
        <p className="mt-3 text-sm text-clay">{worksheet.warning}</p>
      ) : null}
      <div className="mt-4 border-t-2 border-moss" />
      {worksheet.sections.map((section) => (
        <section key={section.skillId} className="mt-6">
          <h3 className="text-xs font-semibold tracking-[0.14em] text-moss">
            {section.skillName.toUpperCase()}
          </h3>
          {meta.includeDirections ? (
            <p className="mt-2 border border-line bg-mist px-3 py-2 font-serif text-sm italic leading-6">
              {section.directions}
            </p>
          ) : null}
          <ol className="mt-4 space-y-5">
            {section.items.map((item) => (
              <li key={item.number} className="grid grid-cols-[2rem_1fr] gap-2">
                <span className="font-serif font-semibold">{item.number}.</span>
                <div className="font-serif text-[15px] leading-6">
                  <p>
                    <Rich text={item.prompt} />
                  </p>
                  {item.stimulus ? (
                    <p className="mt-1">
                      <Rich text={item.stimulus} />
                    </p>
                  ) : null}
                  {item.choices ? (
                    <ul className="mt-1 space-y-0.5">
                      {item.choices.map((choice, index) => (
                        <li key={`${item.number}-${choice}`} className="grid grid-cols-[1.5rem_1fr]">
                          <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                          <span>
                            <Rich text={choice} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {!answerKey && item.lines > 0 ? (
                    <div className="mt-2">
                      {Array.from({ length: item.lines }, (_, line) => (
                        <div key={line} className="paper-rule" />
                      ))}
                    </div>
                  ) : null}
                  {answerKey ? (
                    <div className="mt-1">
                      <p className="font-semibold text-moss">
                        Answer: <Rich text={item.answer.replace(/^[A-H]\. /, (match) => match)} />
                      </p>
                      {item.explanation ? (
                        <p className="text-sm italic text-ink/70">
                          <Rich text={item.explanation} />
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <footer className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-2 text-[11px] text-ink/60">
        <p>Skills: {meta.skillNames.join(" · ")}</p>
        <p>Grade {meta.grade}</p>
      </footer>
    </article>
  );
}

function Rich({ text }: { text: string }) {
  const spans = parseRich(text);
  return (
    <span className="whitespace-pre-wrap">
      {spans.map((span, index) => (
        <span key={index} className={classFor(span)}>
          {span.text}
        </span>
      ))}
    </span>
  );
}

function classFor(span: RichSpan): string | undefined {
  if (span.style === "italic") return "italic";
  if (span.style === "bold") return "font-semibold";
  if (span.style === "bolditalic") return "font-semibold italic";
  return undefined;
}
