import type { Difficulty } from "../types";
import { NAMES } from "./names";
import { BAND, choicePattern, pattern, type Pattern } from "./engine";

function cap(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const CLAUSE_SENTENCES: Array<[string, string, string, string, string]> = [
  ["We started the rehearsal after the lights warmed up.", "after the lights warmed up", "We started the rehearsal", "the lights", "After the lights warmed up cannot stand alone, so it is dependent."],
  ["Because the auditorium was locked, the choir waited outside.", "Because the auditorium was locked", "the choir waited outside", "the auditorium", "Because introduces a dependent clause."],
  ["The student who plays first violin missed the bus.", "who plays first violin", "The student missed the bus", "first violin", "Who plays first violin is a relative clause and cannot stand alone."],
  ["If the paint is wet, leave the mural alone.", "If the paint is wet", "leave the mural alone", "the mural", "If the paint is wet is a dependent condition."],
  ["Although the trail was steep, the hikers kept going.", "Although the trail was steep", "the hikers kept going", "the trail", "Although introduces a dependent clause."],
  ["I will call you when the glue dries.", "when the glue dries", "I will call you", "the glue", "When the glue dries cannot stand alone."],
  ["The coach who scheduled the match is absent.", "who scheduled the match", "The coach is absent", "the match", "Who scheduled the match modifies coach and is dependent."],
  ["Unless the labels are checked, do not publish the graph.", "Unless the labels are checked", "do not publish the graph", "the graph", "Unless introduces a dependent clause."],
  ["The notes that you copied are on the desk.", "that you copied", "The notes are on the desk", "the desk", "That you copied is a dependent relative clause."],
  ["After the rain stopped, we walked to the field.", "After the rain stopped", "we walked to the field", "the field", "After the rain stopped cannot stand alone."],
  ["The backdrop that the crew painted is still damp.", "that the crew painted", "The backdrop is still damp", "the crew", "That the crew painted is dependent."],
  ["We stayed inside because the field was muddy.", "because the field was muddy", "We stayed inside", "the field", "Because the field was muddy is dependent."],
  ["When the bell rang, the students opened their notebooks.", "When the bell rang", "the students opened their notebooks", "their notebooks", "When the bell rang is dependent."],
  ["The poem that Maya chose fits the theme.", "that Maya chose", "The poem fits the theme", "the theme", "That Maya chose is a dependent clause."],
  ["If the bus is late, start the warm-up without us.", "If the bus is late", "start the warm-up without us", "the warm-up", "If the bus is late is dependent."],
  ["The samples remain usable although the labels faded.", "although the labels faded", "The samples remain usable", "the labels", "Although the labels faded is dependent."],
];

const ADVANCED_CLAUSES: Array<[string, string, string, string, string]> = [
  ["What the results show surprised the partners.", "What the results show", "surprised the partners", "the partners", "What the results show is a noun clause acting as the subject. It cannot stand alone as a sentence here because it is only the subject."],
  ["It was Maya who found the key.", "who found the key", "It was Maya", "the key", "Who found the key is a dependent relative clause."],
  ["The director asked where the gels were stored.", "where the gels were stored", "The director asked", "the gels", "Where the gels were stored is a dependent noun clause."],
  ["Whoever finishes first should reset the timer.", "Whoever finishes first", "should reset the timer", "the timer", "Whoever finishes first is a dependent noun clause used as the subject."],
  ["The fact that the beaker cracked changed the plan.", "that the beaker cracked", "The fact changed the plan", "the plan", "That the beaker cracked is a dependent noun clause renaming fact."],
  ["We left the lab before the announcement that school would close early.", "that school would close early", "We left the lab", "the lab", "That school would close early is a dependent clause inside the prepositional phrase."],
  ["The question is whether the data support the claim.", "whether the data support the claim", "The question is", "the claim", "Whether the data support the claim is a dependent noun clause."],
  ["Students who finish early may start the bonus set.", "who finish early", "Students may start the bonus set", "the bonus set", "Who finish early is a dependent relative clause."],
  ["Give the passes to whoever is still in the lobby.", "whoever is still in the lobby", "Give the passes", "the passes", "Whoever is still in the lobby is a dependent clause serving as the object of to."],
  ["Although the graph is accurate, the caption that you wrote needs a source.", "that you wrote", "the caption needs a source", "Although the graph is accurate", "That you wrote is one dependent clause. Although the graph is accurate is another. The item asks for the relative clause."],
];

export const clausePatterns: Pattern[] = [
  pattern({
    id: "clause-which",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Which group of words is a dependent clause?",
    build: (rng, difficulty) => {
      const pool = difficulty === "advanced" ? [...CLAUSE_SENTENCES, ...ADVANCED_CLAUSES] : CLAUSE_SENTENCES;
      const [sentence, dependent, independent, phrase, why] = rng.pick(pool);
      return {
        stimulus: sentence,
        answer: dependent,
        distractors: [independent, phrase],
        explanation: why,
        key: sentence,
      };
    },
  }),
  choicePattern("clause-label", BAND.all, "Is the italicized group an independent clause or a dependent clause?", [
    ...[
      ["*The choir waited outside.*", "independent", "The group has a subject and a verb and can stand alone."],
      ["*Because the auditorium was locked*", "dependent", "Because keeps the clause from standing alone."],
      ["*The field was muddy.*", "independent", "This group can stand alone as a sentence."],
      ["*although the trail was steep*", "dependent", "Although introduces a dependent clause."],
      ["*Leave the mural alone.*", "independent", "This command can stand alone. The subject you is understood."],
      ["*if the paint is wet*", "dependent", "If introduces a dependent clause."],
      ["*The students opened their notebooks.*", "independent", "This group expresses a complete thought."],
      ["*when the bell rang*", "dependent", "When the bell rang cannot stand alone."],
      ["*The backdrop is still damp.*", "independent", "This group can stand alone."],
      ["*that the crew painted*", "dependent", "The relative clause cannot stand alone."],
      ["*We stayed inside.*", "independent", "This group can stand alone."],
      ["*who plays first violin*", "dependent", "The relative clause needs a noun to modify."],
      ["*Start the warm-up.*", "independent", "A command with an understood subject can stand alone."],
      ["*unless the labels are checked*", "dependent", "Unless introduces a dependent clause."],
      ["*The samples remain usable.*", "independent", "This group can stand alone."],
      ["*after the lights warmed up*", "dependent", "The clause cannot stand alone."],
    ].map(([stimulus, answer, explanation]) => ({
      stimulus,
      answer,
      distractors: [answer === "independent" ? "dependent" : "independent"],
      explanation,
    })),
    ...ADVANCED_CLAUSES.slice(0, 8).map(([sentence, dependent, , , why]) => ({
      levels: ["advanced"] as Difficulty[],
      stimulus: sentence.replace(dependent, `*${dependent}*`),
      answer: "dependent",
      distractors: ["independent"],
      explanation: why,
    })),
  ]),
];

type SentenceKind = "simple" | "compound" | "complex" | "compound-complex";

const CORE_SENTENCES: Array<{ sentence: string; type: SentenceKind; why: string }> = [
  ["The stage crew painted the backdrop.", "simple", "The sentence has one independent clause and no dependent clause."],
  ["Maya and Luis carried the risers into the gym.", "simple", "A compound subject does not make the sentence compound. There is still one independent clause."],
  ["The audience laughed and applauded.", "simple", "A compound predicate does not make the sentence compound. There is one subject and no dependent clause."],
  ["After school the editors met in the library.", "simple", "After school is a prepositional phrase, not a clause. The sentence has one independent clause."],
  ["The book on the front desk belongs to the library.", "simple", "On the front desk and to the library are phrases. There is one independent clause."],
  ["There is a crack in the beaker.", "simple", "The sentence has one independent clause."],
  ["The tired cast sat quietly in the wings.", "simple", "Modifiers and a prepositional phrase do not add a second clause."],
  ["Please return the beakers to the cart.", "simple", "An imperative sentence can be simple. The subject you is understood."],
  ["The student in the red jacket waved.", "simple", "In the red jacket is a phrase. There is one independent clause."],
  ["Under the desk sat the missing stamp.", "simple", "The sentence has one independent clause, even though the subject follows the verb."],
  ["The lights above the stage needed a new gel.", "simple", "Above the stage is a phrase. There is one clause."],
  ["Both posters belong to the art club.", "simple", "There is one independent clause."],
  ["The bell rang, and the hallway filled.", "compound", "Two independent clauses are joined by a comma and and. There is no dependent clause."],
  ["The printer jammed, so Maya checked the paper tray.", "compound", "So joins two independent clauses."],
  ["I studied the map, but the trail still confused me.", "compound", "But joins two independent clauses."],
  ["The sky darkened; we still held practice.", "compound", "A semicolon joins two independent clauses, and there is no dependent clause."],
  ["The lab was closed, yet the partners finished the report.", "compound", "Yet joins two independent clauses."],
  ["The paint was wet, so nobody touched the mural.", "compound", "Two independent clauses are joined by so."],
  ["Lena found the key, but the auditorium stayed dark.", "compound", "But joins two independent clauses."],
  ["The data looked odd; the partners ran the trial again.", "compound", "The semicolon joins two independent clauses."],
  ["The solo ended, and the audience stayed quiet.", "compound", "And joins two independent clauses."],
  ["Bring a pencil, or borrow one from the front desk.", "compound", "Two commands are joined by or. Each command is an independent clause."],
  ["The bus was late, yet rehearsal started on time.", "compound", "Yet joins two independent clauses."],
  ["The beaker cracked, and we stopped the experiment.", "compound", "And joins two independent clauses."],
  ["We started the rehearsal after the lights warmed up.", "complex", "After the lights warmed up is a dependent clause attached to one independent clause."],
  ["Because the auditorium was locked, the choir waited outside.", "complex", "The sentence has one dependent clause and one independent clause."],
  ["The student who plays first violin missed the bus.", "complex", "Who plays first violin is a dependent clause."],
  ["If the paint is wet, leave the mural alone.", "complex", "If the paint is wet is dependent, and the command is independent."],
  ["Although the trail was steep, the hikers kept going.", "complex", "Although the trail was steep is dependent."],
  ["I will call you when the glue dries.", "complex", "When the glue dries is a dependent clause."],
  ["The coach who scheduled the match is absent.", "complex", "Who scheduled the match is a dependent relative clause."],
  ["Unless the labels are checked, do not publish the graph.", "complex", "Unless the labels are checked is dependent."],
  ["The notes that you copied are on the desk.", "complex", "That you copied is a dependent clause."],
  ["What the results show surprised the partners.", "complex", "What the results show is a noun clause. The sentence has one independent clause built around surprised."],
  ["We stayed inside because the field was muddy.", "complex", "Because the field was muddy is dependent."],
  ["Students who finish early may start the bonus set.", "complex", "Who finish early is a dependent clause."],
].map(([sentence, type, why]) => ({ sentence, type: type as SentenceKind, why }));

const UPPER_SENTENCES: Array<{ sentence: string; type: SentenceKind; why: string }> = [
  ["Because the auditorium was locked, the choir waited outside, and the director found another key.", "compound-complex", "Because the auditorium was locked is dependent, and the sentence also has two independent clauses."],
  ["The student who plays first violin missed the bus, so the section started late.", "compound-complex", "Who plays first violin is dependent, and so joins two independent clauses."],
  ["When the lights warmed up, the crew grew quiet, and the curtain rose.", "compound-complex", "When the lights warmed up is dependent, and and joins two independent clauses."],
  ["I studied the map, but the trail still confused me because the signs were gone.", "compound-complex", "The sentence has two independent clauses and the dependent clause because the signs were gone."],
  ["If the paint is wet, leave the mural alone, and tell the stage manager.", "compound-complex", "If the paint is wet is dependent, and two commands are joined by and."],
  ["Although the trail was steep, the hikers kept going, and the guide stayed at the back.", "compound-complex", "Although the trail was steep is dependent, and the sentence has two independent clauses."],
  ["The notes that you copied are on the desk, and the folder is labeled.", "compound-complex", "That you copied is dependent, and and joins two independent clauses."],
  ["We started the rehearsal after the lights warmed up, but the microphones were dead.", "compound-complex", "After the lights warmed up is dependent, and but joins a second independent clause."],
  ["Unless the labels are checked, do not publish the graph, and hold the press release.", "compound-complex", "Unless the labels are checked is dependent, and two commands form the independent clauses."],
  ["The partners ran the trial again after the numbers looked wrong, but the second graph still puzzled them.", "compound-complex", "After the numbers looked wrong is dependent, and but joins two independent clauses."],
  ["The lab closed at noon; however, we finished the graphs at home.", "compound", "However is a conjunctive adverb, not a subordinating conjunction. The semicolon joins two independent clauses, so the sentence is compound."],
  ["Having finished the graphs, we left.", "simple", "Having finished the graphs is a participial phrase, not a clause. The sentence has one independent clause."],
].map(([sentence, type, why]) => ({ sentence, type: type as SentenceKind, why }));

export const sentenceTypePatterns: Pattern[] = [
  pattern({
    id: "sentence-types-core",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "What kind of sentence is this?",
    build: (rng, difficulty) => {
      const item = rng.pick(CORE_SENTENCES);
      const choices =
        difficulty === "developing"
          ? ["simple", "compound", "complex"]
          : ["simple", "compound", "complex", "compound-complex"];
      return {
        stimulus: item.sentence,
        answer: item.type,
        choices,
        explanation: item.why,
        key: `core|${item.sentence}`,
      };
    },
  }),
  pattern({
    id: "sentence-types-upper",
    difficulties: BAND.upper,
    type: "multiple-choice",
    prompt: "What kind of sentence is this?",
    build: (rng) => {
      const item = rng.pick(UPPER_SENTENCES);
      return {
        stimulus: item.sentence,
        answer: item.type,
        choices: ["simple", "compound", "complex", "compound-complex"],
        explanation: item.why,
        key: `upper|${item.sentence}`,
      };
    },
  }),
];

const PHRASES: Array<{ levels?: Difficulty[]; stimulus: string; answer: string; why: string }> = [
  { stimulus: "Ms. Okonkwo, *our principal*, visited the class.", answer: "appositive", why: "Our principal renames Ms. Okonkwo, so it is an appositive phrase." },
  { stimulus: "The novel *The Giver* is on the ninth-grade list.", answer: "appositive", why: "The Giver renames the novel, so it is an appositive." },
  { stimulus: "We met Coach Rahman, *the new track coach*.", answer: "appositive", why: "The new track coach renames Coach Rahman." },
  { stimulus: "My cousin *Jordan* plays first violin.", answer: "appositive", why: "Jordan identifies cousin. An appositive can be essential and need no commas." },
  { stimulus: "The tool *a digital caliper* gives a more exact measurement.", answer: "appositive", why: "A digital caliper renames the tool." },
  { stimulus: "Everyone congratulated Imani, *captain of the team*.", answer: "appositive", why: "Captain of the team renames Imani." },
  { stimulus: "The river, *a slow brown ribbon*, curved past the field.", answer: "appositive", why: "A slow brown ribbon renames the river." },
  { stimulus: "We read a poem by Rita Dove, *a former poet laureate*.", answer: "appositive", why: "A former poet laureate renames Rita Dove." },
  { stimulus: "*Exhausted from rehearsal*, the cast sat quietly.", answer: "participial", why: "Exhausted from rehearsal is a participial phrase modifying cast." },
  { stimulus: "*Running for the bus*, Maya dropped her folder.", answer: "participial", why: "Running for the bus modifies Maya. The phrase begins with a participle." },
  { stimulus: "The student *standing near the exit* has the passes.", answer: "participial", why: "Standing near the exit modifies student." },
  { stimulus: "*Painted last night*, the backdrop is still damp.", answer: "participial", why: "Painted last night modifies backdrop." },
  { stimulus: "We found the beaker *cracked along the rim*.", answer: "participial", why: "Cracked along the rim modifies beaker." },
  { stimulus: "*Smiling at the punch line*, the audience applauded.", answer: "participial", why: "Smiling at the punch line modifies audience." },
  { stimulus: "The notes *taken during the lecture* are on the desk.", answer: "participial", why: "Taken during the lecture modifies notes." },
  { stimulus: "*Hoping for a clear day*, the class planned the picnic.", answer: "participial", why: "Hoping for a clear day modifies class." },
  { stimulus: "*Reading poetry aloud* takes practice.", answer: "gerund", why: "Reading poetry aloud acts as the subject of takes, so it is a gerund phrase." },
  { stimulus: "The club enjoys *hiking before sunrise*.", answer: "gerund", why: "Hiking before sunrise is the object of enjoys and functions as a noun." },
  { stimulus: "She is tired of *labeling every sample*.", answer: "gerund", why: "Labeling every sample is the object of the preposition of, so the phrase is a gerund." },
  { stimulus: "*Measuring the salt twice* prevented the error.", answer: "gerund", why: "The phrase is the subject of prevented." },
  { stimulus: "A good warm-up is *stretching for ten minutes*.", answer: "gerund", why: "Stretching for ten minutes renames warm-up and functions as a noun." },
  { stimulus: "They talked about *revising the ending*.", answer: "gerund", why: "Revising the ending is the object of about." },
  { stimulus: "*Checking the units* saved the lab group.", answer: "gerund", why: "The phrase functions as the subject, so it is a gerund phrase." },
  { stimulus: "The hardest part was *citing every source*.", answer: "gerund", why: "Citing every source functions as a noun after the linking verb was." },
  { stimulus: "We paused *to admire the mural*.", answer: "infinitive", why: "To admire the mural begins with to plus a verb and tells why we paused." },
  { stimulus: "Maya wants *to join the choir*.", answer: "infinitive", why: "To join the choir is the object of wants." },
  { stimulus: "*To finish the mural*, the crew needs more paint.", answer: "infinitive", why: "To finish the mural tells why and begins with to plus a verb." },
  { stimulus: "The best book *to read this month* is on reserve.", answer: "infinitive", why: "To read this month modifies book." },
  { stimulus: "The partners agreed *to run the trial again*.", answer: "infinitive", why: "To run the trial again is the object of agreed." },
  { stimulus: "It is hard *to hear the cue from the back row*.", answer: "infinitive", why: "To hear the cue from the back row completes the meaning of hard." },
  { stimulus: "*To keep the samples cold*, store them on ice.", answer: "infinitive", why: "To keep the samples cold modifies the command store." },
  { stimulus: "The director asked the cast *to hold the final note*.", answer: "infinitive", why: "To hold the final note completes asked." },
  { levels: ["proficient", "advanced"], stimulus: "*Hands shaking*, Jordan opened the letter.", answer: "absolute", why: "Hands shaking has its own noun plus a participle and modifies the whole sentence, so it is an absolute phrase." },
  { levels: ["proficient", "advanced"], stimulus: "*Her voice trembling*, Maya began the speech.", answer: "absolute", why: "Her voice trembling is a noun plus a participle. It does not modify a single noun in the main clause the way a participial phrase would." },
  { levels: ["proficient", "advanced"], stimulus: "*Eyes closed*, the audience listened.", answer: "absolute", why: "Eyes closed is an absolute phrase: a noun plus a participle." },
  { levels: ["proficient", "advanced"], stimulus: "*The map folded in his pocket*, Omar trusted the trail.", answer: "absolute", why: "The map folded in his pocket modifies the whole sentence." },
  { levels: ["proficient", "advanced"], stimulus: "*Paint still wet*, the mural could not be touched.", answer: "absolute", why: "Paint still wet is an absolute phrase." },
  { levels: ["proficient", "advanced"], stimulus: "*Heart pounding*, Lena waited for the cue.", answer: "absolute", why: "Heart pounding contains a noun and a participle and modifies the whole sentence." },
  { levels: ["proficient", "advanced"], stimulus: "*Weather permitting*, the class will meet outside.", answer: "absolute", why: "Weather permitting is a classic absolute phrase." },
  { levels: ["proficient", "advanced"], stimulus: "*Arms folded*, the judges waited for the score.", answer: "absolute", why: "Arms folded is a noun plus a participle and modifies the whole sentence, so it is an absolute phrase." },
  { levels: ["advanced"], stimulus: "We walked *to the mural* before the tour.", answer: "prepositional", why: "To is followed by the noun mural, not by a verb, so to the mural is a prepositional phrase rather than an infinitive." },
  { levels: ["advanced"], stimulus: "*Reading poetry aloud*, Maya lost track of time.", answer: "participial", why: "Here reading poetry aloud modifies Maya. When the same words act as a noun, they are a gerund; here they are participial." },
];

export const phrasePatterns: Pattern[] = [
  pattern({
    id: "phrase-kind",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "The italicized phrase is which kind?",
    build: (rng, difficulty) => {
      const pool = PHRASES.filter((item) => !item.levels || item.levels.includes(difficulty));
      const item = rng.pick(pool);
      const choices =
        item.answer === "prepositional"
          ? ["prepositional", "infinitive", "gerund", "participial"]
          : difficulty === "developing"
            ? ["appositive", "participial", "gerund", "infinitive"]
            : ["appositive", "participial", "gerund", "infinitive", "absolute"];
      if (!choices.includes(item.answer)) {
        throw new Error(`Phrase answer ${item.answer} missing from choices`);
      }
      return {
        stimulus: item.stimulus,
        answer: item.answer,
        choices,
        explanation: item.why,
        key: item.stimulus,
      };
    },
  }),
];

const FRAGMENTS: Array<[string, string, string]> = [
  ["Because the bus was late.", "We started the lab because the bus was late.", "Because the bus was late is a dependent clause and needs an independent clause."],
  ["Running down the hall.", "The students were running down the hall.", "A participial phrase needs a subject and a finite verb to become a sentence."],
  ["The tall student in the red jacket.", "The tall student in the red jacket waved.", "The group has a subject but no verb."],
  ["After the lights warmed up.", "The rehearsal started after the lights warmed up.", "After the lights warmed up is a dependent clause."],
  ["Such as microscopes, slides, and gloves.", "The cart held supplies such as microscopes, slides, and gloves.", "Such as introduces a phrase, not a sentence."],
  ["Standing near the exit.", "Maya was standing near the exit.", "The phrase needs a subject and a helping or finite verb."],
  ["When the bell rang.", "When the bell rang, the students opened their notebooks.", "When the bell rang is dependent."],
  ["To finish the mural before Friday.", "The crew stayed late to finish the mural before Friday.", "An infinitive phrase is not a sentence."],
  ["The book on the front desk.", "The book on the front desk belongs to the library.", "The group names something but does not say what it does."],
  ["Although the trail was steep.", "Although the trail was steep, the hikers kept going.", "Although the trail was steep is a dependent clause."],
  ["Hoping for a clear day.", "Hoping for a clear day, the class planned a picnic.", "A participial phrase cannot stand alone."],
  ["Which we found under the desk.", "We returned the stamp which we found under the desk.", "A relative clause needs an independent clause."],
  ["In the cabinet beside the sink.", "The spare goggles are in the cabinet beside the sink.", "Prepositional phrases are not sentences."],
  ["That the beaker cracked.", "The fact that the beaker cracked changed the plan.", "That the beaker cracked is a dependent clause."],
  ["Without checking the units.", "The group reported the mass without checking the units.", "Without checking the units is a phrase."],
  ["The student who forgot a pass.", "The student who forgot a pass waited in the office.", "The group has no finite verb for the main subject student."],
  ["If the paint is still wet.", "If the paint is still wet, leave the mural alone.", "If the paint is still wet is dependent."],
  ["A slow brown ribbon.", "The river, a slow brown ribbon, curved past the field.", "An appositive phrase is not a sentence."],
  ["While the glue dried.", "We waited while the glue dried.", "While the glue dried is a dependent clause."],
  ["Having finished the graphs.", "Having finished the graphs, we left.", "A participial phrase needs an independent clause."],
];

const COMPLETE: Array<[string, string]> = [
  ["The tall student in the red jacket waved.", "The group has a subject, student, and a verb, waved."],
  ["Because the bus was late, we started without the set.", "The dependent clause is attached to an independent clause, so the whole sentence is complete."],
  ["Please return the beakers to the cart.", "The command has an understood subject, you."],
  ["The book on the front desk belongs to the library.", "Belongs is the verb for book."],
  ["After the lights warmed up, the rehearsal started.", "The opening clause is dependent, but the rehearsal started completes the sentence."],
  ["Maya was standing near the exit.", "Was standing is a complete verb phrase."],
  ["We waited while the glue dried.", "We waited is an independent clause."],
  ["The crew stayed late to finish the mural.", "The crew stayed late can stand on its own."],
  ["There is a crack in the beaker.", "There is opens a complete clause."],
  ["The student who forgot a pass waited in the office.", "Waited is the verb for student."],
  ["Leave the mural alone if the paint is wet.", "The command is an independent clause."],
  ["Having finished the graphs, we left.", "We left is the independent clause. The opening words are only a phrase."],
  ["The river curved past the field.", "The group has a subject and a verb."],
  ["Nobody touched the mural.", "The group expresses a complete thought."],
];

export const fragmentPatterns: Pattern[] = [
  pattern({
    id: "fragment-identify",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Is the group of words a fragment or a complete sentence?",
    build: (rng) => {
      if (rng.next() < 0.55) {
        const [stimulus, , why] = rng.pick(FRAGMENTS);
        return {
          stimulus,
          answer: "fragment",
          choices: ["fragment", "complete sentence"],
          explanation: why,
          key: stimulus,
        };
      }
      const [stimulus, why] = rng.pick(COMPLETE);
      return {
        stimulus,
        answer: "complete sentence",
        choices: ["fragment", "complete sentence"],
        explanation: why,
        key: stimulus,
      };
    },
  }),
  pattern({
    id: "fragment-repair",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the fragment as a complete sentence.",
    lines: 2,
    build: (rng) => {
      const [stimulus, answer, explanation] = rng.pick(FRAGMENTS);
      return {
        stimulus,
        answer,
        explanation: `${explanation} Answers may vary; the key shows one complete sentence that keeps the original idea.`,
        key: stimulus,
      };
    },
  }),
];

const RUN_ON_PAIRS = [
  ["The sky darkened", "we still held practice"],
  ["The printer jammed", "Maya checked the paper tray"],
  ["The bell rang", "the hallway filled with students"],
  ["I studied the map", "the trail still confused me"],
  ["The lab was closed", "we finished the report at home"],
  ["The paint was wet", "nobody touched the mural"],
  ["Lena found the key", "the auditorium stayed dark"],
  ["The numbers looked odd", "the partners ran the trial again"],
  ["The solo ended", "the audience stayed quiet"],
  ["The bus was late", "rehearsal started without the set"],
  ["The beaker cracked", "we stopped the experiment"],
  ["The essay was long", "the thesis was still clear"],
  ["The glue dried", "the crew hung the backdrop"],
  ["The caption was missing", "the graph could not be published"],
] as const;

export const runOnPatterns: Pattern[] = [
  pattern({
    id: "runon-identify",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Which sentence is a comma splice?",
    build: (rng) => {
      const [a, b] = rng.pick(RUN_ON_PAIRS);
      const splice = `${a}, ${b}.`;
      const fixed = `${a}. ${cap(b)}.`;
      const compound = `${a}, and ${b}.`;
      return {
        answer: splice,
        choices: [splice, fixed, compound],
        explanation: `${splice} joins two independent clauses with only a comma. Use a period, a semicolon, or a comma plus a coordinating conjunction.`,
        key: splice,
      };
    },
  }),
  pattern({
    id: "runon-period",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the run-on as two sentences.",
    lines: 2,
    build: (rng) => {
      const [a, b] = rng.pick(RUN_ON_PAIRS);
      return {
        stimulus: `${a} ${b}.`,
        answer: `${a}. ${cap(b)}.`,
        explanation: "A period separates the two independent clauses.",
        key: `${a}|period`,
      };
    },
  }),
  pattern({
    id: "runon-semi",
    difficulties: BAND.upper,
    type: "rewrite",
    prompt: "Rewrite the run-on using a semicolon and no coordinating conjunction.",
    lines: 2,
    build: (rng) => {
      const [a, b] = rng.pick(RUN_ON_PAIRS);
      return {
        stimulus: `${a}, ${b}.`,
        answer: `${a}; ${b}.`,
        explanation: "A semicolon can join two closely related independent clauses.",
        key: `${a}|semi`,
      };
    },
  }),
  pattern({
    id: "runon-and",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the run-on as one compound sentence with a comma and and.",
    lines: 2,
    build: (rng) => {
      const [a, b] = rng.pick(RUN_ON_PAIRS);
      return {
        stimulus: `${a} ${b}.`,
        answer: `${a}, and ${b}.`,
        explanation: "A comma and the coordinating conjunction and correctly join the two independent clauses.",
        key: `${a}|and`,
      };
    },
  }),
];

const DANGLING: Array<[string, string, string]> = [
  ["Walking to school, the rain soaked {name}'s notebook.", "Walking to school, {name} felt the rain soak the notebook.", "Walking describes a person. {name} has to be the subject, or the modifier dangles."],
  ["After studying for hours, the test looked easy to {name}.", "After studying for hours, {name} thought the test looked easy.", "The test did not study. {name} did."],
  ["To finish the mural, more paint was needed by {name}.", "To finish the mural, {name} needed more paint.", "The infinitive phrase needs the person who will finish the mural."],
  ["Running down the hall, {name}'s posters fell.", "Running down the hall, {name} dropped the posters.", "The posters were not running. {name} was."],
  ["While reading the lab notes, the beaker cracked in front of {name}.", "While reading the lab notes, {name} saw the beaker crack.", "The beaker was not reading."],
  ["Exhausted from rehearsal, {name}'s voice gave out.", "Exhausted from rehearsal, {name} could barely sing.", "Exhausted describes {name}, not the voice."],
  ["Driving past the school, the mural caught {name}'s eye.", "Driving past the school, {name} noticed the mural.", "The mural was not driving."],
  ["To hear the cue, the speaker was turned up by {name}.", "To hear the cue, {name} turned up the speaker.", "The person who wants to hear the cue must be the subject."],
  ["Sitting in the back row, the actors looked tiny to {name}.", "Sitting in the back row, {name} thought the actors looked tiny.", "The actors were not sitting in the back row in this sentence. {name} was."],
  ["Without checking the units, the mass was reported by {name}.", "Without checking the units, {name} reported the mass.", "The person who failed to check the units must be the subject."],
  ["Hoping for sun, the picnic was planned by {name}.", "Hoping for sun, {name} planned the picnic.", "The picnic cannot hope. {name} can."],
  ["While heating the solution, the thermometer slipped from {name}'s hand.", "While heating the solution, {name} felt the thermometer slip.", "The thermometer was not heating the solution."],
];

const MISPLACED: Array<[string, string, string, string]> = [
  ["{name} saw a mural painted by the art class on the bus.", "On the bus, {name} saw a mural painted by the art class.", "The intended meaning is that {name} was on the bus.", "On the bus tells where {name} saw the mural, not where it was painted."],
  ["{name} served sandwiches to the guests on paper plates.", "{name} served the guests sandwiches on paper plates.", "The sandwiches, not the guests, were on paper plates.", "On paper plates should modify sandwiches."],
  ["{name} read a book about dinosaurs in the library.", "In the library, {name} read a book about dinosaurs.", "The reading happened in the library.", "In the library was too far from read and seemed to modify dinosaurs."],
  ["{name} almost found all of the missing stamps.", "{name} found almost all of the missing stamps.", "The intended meaning is that nearly every stamp was found, not that the finding almost happened.", "Almost should modify all, not found."],
  ["{name} only saw the mural in the lobby.", "{name} saw the mural only in the lobby.", "The intended meaning is that the lobby was the only place {name} saw the mural.", "Only should sit next to in the lobby."],
  ["{name} bought a phone for a cousin with a cracked screen.", "{name} bought a cousin a phone with a cracked screen.", "The phone had the cracked screen.", "With a cracked screen should modify phone."],
  ["{name} nearly spent an hour on every problem.", "{name} spent nearly an hour on every problem.", "The intended meaning is that each problem took almost an hour.", "Nearly should modify an hour."],
  ["The teacher said after lunch {name} could retake the quiz.", "The teacher said {name} could retake the quiz after lunch.", "The retake is after lunch, not the announcement.", "After lunch should modify could retake."],
  ["{name} found a note on the desk that the director wrote.", "{name} found, on the desk, a note that the director wrote.", "The director wrote the note. The note was on the desk.", "The relative clause should follow note. Answers may vary slightly."],
  ["{name} saw the eagle using a telescope.", "Using a telescope, {name} saw the eagle.", "The intended meaning is that {name} used the telescope.", "Using a telescope should modify {name}."],
];

export const modifierPatterns: Pattern[] = [
  pattern({
    id: "modifier-dangling",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence so the opening modifier has a clear subject.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [bad, good, why] = rng.pick(DANGLING);
      const fill = (text: string) => text.replaceAll("{name}", name);
      return {
        stimulus: fill(bad),
        answer: fill(good),
        explanation: `${fill(why)} Answers may vary; the key shows one revision that removes the dangling modifier.`,
        key: `${name}|${bad}`,
      };
    },
  }),
  pattern({
    id: "modifier-misplaced",
    difficulties: BAND.upper,
    type: "rewrite",
    prompt: "Rewrite the sentence so the modifier sits next to the word it is meant to describe.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [bad, good, intention, why] = rng.pick(MISPLACED);
      const fill = (text: string) => text.replaceAll("{name}", name);
      return {
        prompt: `Rewrite the sentence. ${fill(intention)}`,
        stimulus: fill(bad),
        answer: fill(good),
        explanation: `${fill(why)} Answers may vary slightly.`,
        key: `${name}|${bad}`,
      };
    },
  }),
];

const COMBINING: Array<[string, string, string, string, string]> = [
  ["{name} revised the ending.", "The first draft felt rushed.", "Combine the sentences into one complex sentence that uses because.", "{name} revised the ending because the first draft felt rushed.", "Because introduces the cause as a dependent clause."],
  ["{name} stayed late.", "The lab was still open.", "Combine the sentences into one complex sentence that begins with because.", "Because the lab was still open, {name} stayed late.", "The dependent clause comes first and is followed by a comma."],
  ["The trail was steep.", "The hikers kept going.", "Combine the sentences into one complex sentence that uses although.", "Although the trail was steep, the hikers kept going.", "Although shows contrast."],
  ["The lights warmed up.", "The crew started the rehearsal.", "Combine the sentences into one complex sentence that uses after.", "The crew started the rehearsal after the lights warmed up.", "After introduces the earlier event."],
  ["{name} leads the section.", "{name} plays first violin.", "Combine the sentences into one sentence that uses who.", "{name}, who plays first violin, leads the section.", "Who creates a relative clause renaming {name}."],
  ["The beaker cracked.", "We stopped the experiment.", "Combine the sentences into one compound sentence that uses a comma and so.", "The beaker cracked, so we stopped the experiment.", "So shows the result and joins two independent clauses."],
  ["The paint was wet.", "Nobody touched the mural.", "Combine the sentences into one compound sentence that uses a semicolon.", "The paint was wet; nobody touched the mural.", "A semicolon joins two related independent clauses without a conjunction."],
  ["{name} checked the units.", "The mass still looked wrong.", "Combine the sentences into one complex sentence that uses even though.", "Even though {name} checked the units, the mass still looked wrong.", "Even though introduces a contrast."],
  ["The bus arrived.", "Rehearsal had already started.", "Combine the sentences into one complex sentence that uses by the time.", "By the time the bus arrived, rehearsal had already started.", "By the time introduces a dependent clause."],
  ["The notes were copied.", "The folder was labeled.", "Combine the sentences into one compound sentence that uses a comma and and.", "The notes were copied, and the folder was labeled.", "And joins two independent clauses of equal weight."],
  ["{name} wants a clearer graph.", "The caption is missing a source. The numbers themselves are correct.", "Combine the sentences into one compound-complex sentence that uses both because and but.", "{name} wants a clearer graph because the caption is missing a source, but the numbers themselves are correct.", "Because creates a dependent clause, and but joins a second independent clause. Answers may vary."],
  ["The choir waited outside.", "The auditorium was locked. The director found another key.", "Combine all three sentences into one compound-complex sentence.", "Because the auditorium was locked, the choir waited outside, and the director found another key.", "Because creates a dependent clause, and and joins two independent clauses."],
];

export const combiningPatterns: Pattern[] = [
  pattern({
    id: "combining-basic",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Combine the sentences as the directions inside the item require.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const row = rng.pick(COMBINING.slice(0, 10));
      const fill = (text: string) => text.replaceAll("{name}", name);
      return {
        prompt: fill(row[2]),
        stimulus: `${fill(row[0])} ${fill(row[1])}`,
        answer: fill(row[3]),
        explanation: `${fill(row[4])} Answers may vary slightly if they follow the requested structure.`,
        key: `${fill(row[2])}|${fill(row[0])}|${fill(row[1])}`,
      };
    },
  }),
  pattern({
    id: "combining-advanced",
    difficulties: BAND.adv,
    type: "rewrite",
    prompt: "Combine the sentences as the directions inside the item require.",
    lines: 3,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const row = rng.pick(COMBINING.slice(10));
      const fill = (text: string) => text.replaceAll("{name}", name);
      return {
        prompt: fill(row[2]),
        stimulus: `${fill(row[0])} ${fill(row[1])}`,
        answer: fill(row[3]),
        explanation: `${fill(row[4])} Answers may vary if the requested structure is kept.`,
        key: `adv|${fill(row[2])}|${fill(row[0])}|${fill(row[1])}`,
      };
    },
  }),
];
