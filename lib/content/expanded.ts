import type { Difficulty } from "../types";
import { NAMES } from "./names";
import { BAND, choicePattern, pattern, revisionPattern, type Pattern } from "./engine";

const all: Difficulty[] = ["developing", "proficient", "advanced"];

function mc(
  id: string,
  difficulties: Difficulty[],
  prompt: string,
  rows: ReadonlyArray<readonly [string, string, readonly string[], string]>,
): Pattern {
  return choicePattern(
    id,
    difficulties,
    prompt,
    rows.map(([stimulus, answer, distractors, explanation]) => ({
      stimulus,
      answer,
      distractors: [...distractors],
      explanation,
    })),
  );
}

function rewrites(
  id: string,
  difficulties: Difficulty[],
  type: "rewrite" | "edit",
  prompt: string,
  rows: Array<[string, string, string]>,
  lines?: number,
): Pattern {
  return revisionPattern(
    id,
    difficulties,
    type,
    prompt,
    rows.map(([stimulus, answer, explanation]) => ({ stimulus, answer, explanation })),
    lines,
  );
}

export const extraConjunctions: Pattern[] = [
  mc("conj-type-more", all, "The italicized word or pair is which kind of conjunction?", [
    ["The scoreboard failed, *so* the referee used a watch.", "coordinating", ["subordinating", "correlative"], "So joins two independent clauses and is a coordinating conjunction."],
    ["We moved the picnic indoors *since* the field was muddy.", "subordinating", ["coordinating", "correlative"], "Since introduces a dependent clause of cause."],
    ["*Not only* the caption *but also* the units were wrong.", "correlative", ["coordinating", "subordinating"], "Not only / but also is a correlative pair."],
    ["The ice melted, *for* the cooler had been left open.", "coordinating", ["subordinating", "correlative"], "For is a coordinating conjunction when it means because and joins two independent clauses."],
    ["*While* the glue dried, the crew cleaned the brushes.", "subordinating", ["coordinating", "correlative"], "While introduces a dependent clause of time."],
    ["*Whether* the bus is late *or* on time, start the warm-up.", "correlative", ["coordinating", "subordinating"], "Whether / or is a correlative pair."],
    ["Label the samples, *and* store them on ice.", "coordinating", ["subordinating", "correlative"], "And is a coordinating conjunction joining two commands."],
    ["*Once* the paint dries, hang the poster.", "subordinating", ["coordinating", "correlative"], "Once introduces a dependent clause."],
    ["*Both* the caption *and* the scale need a revision.", "correlative", ["coordinating", "subordinating"], "Both / and is a correlative pair."],
    ["The trail forked, *yet* the hikers stayed calm.", "coordinating", ["subordinating", "correlative"], "Yet is a coordinating conjunction showing contrast."],
    ["Leave the mural alone *until* the sealant sets.", "subordinating", ["coordinating", "correlative"], "Until introduces the dependent clause the sealant sets."],
    ["*Neither* the map *nor* the compass was in the pack.", "correlative", ["coordinating", "subordinating"], "Neither / nor is a correlative pair."],
    ["The password changed, *so* nobody could log in.", "coordinating", ["subordinating", "correlative"], "So joins two independent clauses."],
    ["*Whenever* the alarm sounds, we line up by the lockers.", "subordinating", ["coordinating", "correlative"], "Whenever introduces a dependent clause."],
    ["Bring a pencil *and* a notebook.", "coordinating", ["subordinating", "correlative"], "And joins two nouns here. It is still a coordinating conjunction."],
    ["*As soon as* the bell rings, open your notebooks.", "subordinating", ["coordinating", "correlative"], "As soon as introduces a dependent clause of time."],
  ]),
  mc("conj-fit-more", all, "Choose the conjunction that shows the relationship in parentheses.", [
    ["The cooler was open, ____ the ice melted. (result)", "so", ["but", "or", "yet"], "So shows that the melting was the result."],
    ["The cooler was open, ____ the ice had not melted. (contrast)", "yet", ["so", "or", "for"], "Yet shows an unexpected contrast."],
    ["Take the ridge trail, ____ take the creek trail. (choice)", "or", ["but", "so", "yet"], "Or presents a choice."],
    ["We stayed inside ____ the alarm was still sounding. (time)", "while", ["unless", "so", "or"], "While places the two actions at the same time."],
    ["____ the units match, publish the graph. (condition)", "If", ["So", "And", "Yet"], "If introduces a condition."],
    ["Start the timer ____ the solution begins to bubble. (time)", "when", ["unless", "although", "so"], "When marks the moment to start."],
    ["The caption is clear ____ the source is missing. (contrast)", "although", ["because", "unless", "so"], "Although concedes a problem."],
    ["She revised the scale ____ the first axis was mislabeled. (cause)", "because", ["although", "until", "or"], "Because gives the reason."],
    ["____ the soloist ____ the accompanist had the new music. (negative pair)", "Neither ... nor", ["Both ... and", "Either ... or", "Not only ... but also"], "Neither / nor makes both parts negative."],
    ["The review was ____ specific ____ fair. (both qualities)", "both ... and", ["either ... or", "neither ... nor", "whether ... or"], "Both / and includes the two qualities together."],
    ["Pack the gels ____ you strike the set. (time)", "before", ["unless", "although", "so"], "Before places packing earlier than striking the set."],
    ["We can meet in the library ____ in the lab. (choice of place)", "or", ["but", "so", "yet"], "Or offers a choice between two places."],
  ]),
];

export const extraAntecedents: Pattern[] = [
  mc("antecedent-more", all, "Choose the pronoun that agrees with its antecedent.", [
    ["The aunt packed ____ suitcase before dawn.", "her", ["his", "their", "its"], "Aunt is singular, so the pronoun is her."],
    ["The uncles packed ____ suitcases before dawn.", "their", ["his", "her", "its"], "Uncles is plural, so the pronoun is their."],
    ["The doe led ____ fawn across the path.", "her", ["his", "their", "its"], "Doe names one female deer, so the pronoun is her."],
    ["The company published ____ annual report.", "its", ["their", "his", "her"], "Company is singular when it acts as one unit, so the pronoun is its."],
    ["The athletes stretched ____ legs before the race.", "their", ["its", "his", "her"], "Athletes is plural."],
    ["Each of the girls brought ____ own pencil.", "her", ["their", "his", "its"], "Each is singular, and the group is made up of girls, so the pronoun is her."],
    ["Each of the boys forgot ____ pass.", "his", ["their", "her", "its"], "Each is singular, and the group is made up of boys, so the pronoun is his."],
    ["Neither of the statues has ____ plaque yet.", "its", ["their", "his", "her"], "Neither is singular, and a statue is a thing, so the pronoun is its."],
    ["The flock kept ____ formation over the field.", "its", ["their", "his", "her"], "Flock is one group, so American English uses its."],
    ["The geese flapped ____ wings above the pond.", "their", ["its", "his", "her"], "Geese is plural, so the pronoun is their. The flock would be its; the birds themselves are their."],
    ["If the musicians arrive early, ____ may tune in the hallway.", "they", ["you", "he", "it"], "Musicians is third-person plural. You would shift the person."],
    ["The newspaper corrected ____ headline online.", "its", ["their", "his", "her"], "Newspaper is singular."],
    ["Both of the aunts forgot ____ tickets.", "their", ["her", "its", "his"], "Both is plural."],
    ["Every microscope should be returned to ____ cabinet.", "its", ["their", "his", "her"], "Every microscope is singular."],
    ["The brothers compared ____ notes after class.", "their", ["his", "its", "her"], "Brothers is plural."],
    ["The sister compared ____ notes with the diagram.", "her", ["their", "his", "its"], "Sister is singular."],
    ["The herd lowered ____ heads to drink.", "its", ["their", "his", "her"], "Herd is a collective noun acting as one unit, so the verb idea is singular and the pronoun is its."],
    ["The calves followed ____ mothers to the gate.", "their", ["its", "her", "his"], "Calves is plural."],
    ["The museum updated ____ hours on the website.", "its", ["their", "his", "her"], "Museum is singular, so the possessive pronoun is its."],
  ]),
];

export const extraTense: Pattern[] = [
  mc("tense-choice-more", all, "Choose the verb that keeps the tense consistent.", [
    ["Last spring the class ____ a garden behind the gym.", "planted", ["plants", "will plant", "planting"], "Last spring places the action in the past."],
    ["Every afternoon the manager ____ the lights.", "checks", ["checked", "will checked", "checking"], "Every afternoon describes a present habit."],
    ["By the time the bus arrived, the cast ____ the set.", "had loaded", ["loads", "has loaded", "will load"], "The loading finished before the past arrival, so use the past perfect."],
    ["Tomorrow the editor ____ the corrections.", "will send", ["sent", "had sent", "sends yesterday"], "Tomorrow calls for the future."],
    ["While the crew was hanging the backdrop, a rung ____.", "snapped", ["snaps", "will snap", "snap"], "Was hanging is past, so the interruption snapped is past."],
    ["Next month the museum ____ a new exhibit.", "opens", ["opened", "had opened", "open last year"], "A scheduled future event can use the present tense opens."],
    ["The biologist observes the tank and then ____ the temperature.", "records", ["recorded", "will recorded", "had record"], "Observes is present, so records stays in the present."],
    ["Before the school added a darkroom, Lena ____ photos at home.", "had developed", ["develops", "will develop", "has developing"], "The developing happened before a past event, so use had developed."],
    ["Right now the judges ____ the scores.", "are comparing", ["compared", "will compared", "had compare"], "Right now calls for the present progressive."],
    ["After the glue set, we ____ the backdrop.", "hung", ["hang", "will hang", "hanging"], "Set is past here, so hung matches it."],
    ["By June the partners ____ the report.", "will have finished", ["finished", "finish", "had finish"], "By June looks ahead to a completed action, so use the future perfect."],
    ["Yesterday the alarm ____ during the quiz.", "sounded", ["sounds", "will sound", "sound"], "Yesterday requires the past tense."],
    ["If the paint dries tonight, we ____ the poster tomorrow.", "will hang", ["hung", "had hung", "hang yesterday"], "A present condition about the future pairs with will hang."],
    ["The historian describes the map and then ____ a question.", "asks", ["asked", "will asked", "had ask"], "Describes is present, so asks keeps that tense."],
    ["In 2019 the choir ____ at the state festival.", "performed", ["performs", "will perform", "performing"], "A past year requires the past tense."],
    ["Since breakfast, Maya ____ two drafts.", "has revised", ["revised", "had revise", "will revised"], "Since breakfast marks a period continuing to the present, so use the present perfect."],
  ]),
  rewrites("tense-rewrite-more", all, "rewrite", "Rewrite the sentence so the verb tense stays consistent.", [
    ["Last spring the class plants a garden behind the gym.", "Last spring the class planted a garden behind the gym.", "Last spring requires the past tense planted."],
    ["Every afternoon the manager checked the lights and then locks the shop.", "Every afternoon the manager checks the lights and then locks the shop.", "Every afternoon is a habit. Both verbs should be present."],
    ["By the time the bus arrived, the cast loads the set.", "By the time the bus arrived, the cast had loaded the set.", "The loading finished before the past arrival, so use had loaded."],
    ["While the crew was hanging the backdrop, a rung snaps.", "While the crew was hanging the backdrop, a rung snapped.", "The hanging is past, so the snap should be snapped."],
    ["Tomorrow the editor sent the corrections.", "Tomorrow the editor will send the corrections.", "Tomorrow requires a future form."],
    ["Before the school added a darkroom, Lena develops photos at home.", "Before the school added a darkroom, Lena had developed photos at home.", "The developing came before the past addition, so use had developed."],
    ["Right now the judges compared the scores.", "Right now the judges are comparing the scores.", "Right now calls for the present progressive."],
    ["After the glue set, we hang the backdrop.", "After the glue set, we hung the backdrop.", "Set is past, so hang should be hung."],
    ["In 2019 the choir performs at the state festival.", "In 2019 the choir performed at the state festival.", "A past year requires the past tense."],
    ["The biologist observed the tank and then records the temperature.", "The biologist observed the tank and then recorded the temperature.", "Observed is past, so records should be recorded."],
    ["Next month the museum opened a new exhibit.", "Next month the museum opens a new exhibit.", "Next month is future. A scheduled event can use the present tense opens."],
    ["Since breakfast, Maya revised two drafts and is still working.", "Since breakfast, Maya has revised two drafts and is still working.", "Since breakfast continues to the present, so the finished drafts take the present perfect has revised."],
  ]),
];

export const extraMoods: Pattern[] = [
  mc("mood-more", all, "What mood is the main verb?", [
    ["The darkroom stays locked after school.", "indicative", ["imperative", "subjunctive"], "The sentence states a fact, so the mood is indicative."],
    ["Did anyone label the spare gel?", "indicative", ["imperative", "subjunctive"], "A question about a fact is indicative."],
    ["The scale on the graph is accurate.", "indicative", ["imperative", "subjunctive"], "The sentence reports a fact."],
    ["The understudy knows the second scene.", "indicative", ["imperative", "subjunctive"], "The sentence states a fact."],
    ["Stack the chairs before you leave.", "imperative", ["indicative", "subjunctive"], "Stack gives a command. The subject you is understood."],
    ["Please dim the work lights.", "imperative", ["indicative", "subjunctive"], "This is a request addressed to you."],
    ["Do not publish the graph yet.", "imperative", ["indicative", "subjunctive"], "This is a negative command."],
    ["Hand the passes to the ushers.", "imperative", ["indicative", "subjunctive"], "The base verb hand gives a command."],
    ["I wish the ending were quieter.", "subjunctive", ["indicative", "imperative"], "Were expresses a wish that is not a fact."],
    ["If I were the stage manager, I would call a hold.", "subjunctive", ["indicative", "imperative"], "Were states a condition contrary to fact."],
    ["The editor insists that the caption be specific.", "subjunctive", ["indicative", "imperative"], "After insists that, use the base form be."],
    ["We recommend that the trial be repeated.", "subjunctive", ["indicative", "imperative"], "Recommend that is followed by the base form be."],
    ["The coach asked that every runner stretch.", "subjunctive", ["indicative", "imperative"], "Asked that is followed by the base form stretch."],
    ["She acts as if the rumor were true.", "subjunctive", ["indicative", "imperative"], "Were shows a comparison that is not a fact."],
    ["If he were here, he would know the cue.", "subjunctive", ["indicative", "imperative"], "The condition is contrary to fact."],
    ["The board requested that the vote be public.", "subjunctive", ["indicative", "imperative"], "Requested that takes the base form be."],
    ["I suggest that the source be added.", "subjunctive", ["indicative", "imperative"], "Suggest that is followed by be."],
    ["The librarian requires that every book have a card.", "subjunctive", ["indicative", "imperative"], "Requires that is followed by the base form have."],
    ["The pond freezes in January.", "indicative", ["imperative", "subjunctive"], "The sentence states a recurring fact."],
    ["Wipe the lens before you store the camera.", "imperative", ["indicative", "subjunctive"], "Wipe gives a command."],
    ["The partners disagree about the caption.", "indicative", ["imperative", "subjunctive"], "The sentence reports a fact."],
    ["I wish the bus were on time.", "subjunctive", ["indicative", "imperative"], "A wish contrary to fact uses were."],
    ["Keep the samples on ice.", "imperative", ["indicative", "subjunctive"], "Keep tells the listener what to do."],
    ["The rule is posted beside the door.", "indicative", ["imperative", "subjunctive"], "The sentence states a fact."],
  ]),
];

const MORE_CLAUSES: Array<[string, string, string, string, string]> = [
  ["The marker that you borrowed is out of ink.", "that you borrowed", "The marker is out of ink", "out of ink", "That you borrowed is a relative clause and cannot stand alone."],
  ["Whenever the alarm sounds, we line up by the lockers.", "Whenever the alarm sounds", "we line up by the lockers", "the lockers", "Whenever introduces a dependent clause."],
  ["Hang the poster after the sealant dries.", "after the sealant dries", "Hang the poster", "the poster", "After the sealant dries cannot stand alone."],
  ["The gel that cracked belongs in the trash.", "that cracked", "The gel belongs in the trash", "the trash", "That cracked is a dependent relative clause."],
  ["Unless the caption names a source, do not print the graph.", "Unless the caption names a source", "do not print the graph", "the graph", "Unless introduces a dependent clause."],
  ["The usher who collected the passes is in the lobby.", "who collected the passes", "The usher is in the lobby", "the lobby", "Who collected the passes cannot stand alone."],
  ["We waited inside until the thunder stopped.", "until the thunder stopped", "We waited inside", "the thunder", "Until the thunder stopped is dependent."],
  ["Because the cooler was open, the ice melted.", "Because the cooler was open", "the ice melted", "the ice", "Because introduces a dependent clause."],
  ["The poem that Luis chose fits the unit.", "that Luis chose", "The poem fits the unit", "the unit", "That Luis chose is a dependent relative clause."],
  ["If the battery dies, use the spare.", "If the battery dies", "use the spare", "the spare", "If the battery dies is a dependent condition."],
  ["The students opened their notebooks when the bell rang.", "when the bell rang", "The students opened their notebooks", "their notebooks", "When the bell rang cannot stand alone."],
  ["Although the scale is small, the trend is clear.", "Although the scale is small", "the trend is clear", "the trend", "Although introduces a dependent clause."],
  ["Leave a note before you lock the shop.", "before you lock the shop", "Leave a note", "a note", "Before you lock the shop is dependent."],
  ["The bridge that the crew painted is still closed.", "that the crew painted", "The bridge is still closed", "the crew", "That the crew painted is a dependent clause."],
  ["Since the field was muddy, practice moved indoors.", "Since the field was muddy", "practice moved indoors", "the field", "Since introduces a dependent clause of cause."],
  ["The folder that you labeled is on the piano.", "that you labeled", "The folder is on the piano", "the piano", "That you labeled is a dependent relative clause."],
  ["While the glue dried, the crew cleaned the brushes.", "While the glue dried", "the crew cleaned the brushes", "the brushes", "While the glue dried is dependent."],
  ["Whoever has the spare key should open the shop.", "Whoever has the spare key", "should open the shop", "the shop", "Whoever has the spare key is a dependent noun clause used as the subject."],
  ["The question is whether the units match.", "whether the units match", "The question is", "the units", "Whether the units match is a dependent noun clause."],
  ["Give the gel to whoever is at the board.", "whoever is at the board", "Give the gel", "the gel", "Whoever is at the board is a dependent clause."],
];

export const extraClauses: Pattern[] = [
  pattern({
    id: "clause-more",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Which group of words is a dependent clause?",
    build: (rng, difficulty) => {
      const pool = difficulty === "developing" ? MORE_CLAUSES.slice(0, 16) : MORE_CLAUSES;
      const [sentence, dependent, independent, phrase, why] = rng.pick(pool);
      return {
        stimulus: sentence,
        answer: dependent,
        distractors: [independent, phrase],
        explanation: why,
        key: `more|${sentence}`,
      };
    },
  }),
];

const MORE_SENTENCES: Array<[string, "simple" | "compound" | "complex", string]> = [
  ["The librarian stamped the passes.", "simple", "The sentence has one independent clause and no dependent clause."],
  ["Under the bleachers sat a forgotten trumpet.", "simple", "There is one independent clause, even though the subject follows the verb."],
  ["Jordan's cousin and the stage manager arrived early.", "simple", "A compound subject does not make the sentence compound. There is one independent clause."],
  ["Running late, Jordan still caught the bus.", "simple", "Running late is a phrase, not a clause. The sentence has one independent clause."],
  ["The spare gels are in the cabinet beside the sink.", "simple", "In the cabinet and beside the sink are phrases. There is one clause."],
  ["Please wipe the lens before storing the camera.", "simple", "Before storing the camera is a phrase. The command is one independent clause."],
  ["The scoreboard failed, so the referee used a watch.", "compound", "So joins two independent clauses. There is no dependent clause."],
  ["The roses wilted; the ferns stayed green.", "compound", "A semicolon joins two independent clauses."],
  ["The alarm sounded, and the class lined up.", "compound", "And joins two independent clauses."],
  ["The password changed, yet nobody could log in.", "compound", "Yet joins two independent clauses."],
  ["Take the ridge trail, or take the creek trail.", "compound", "Two commands joined by or are two independent clauses."],
  ["The ice melted, for the cooler had been left open.", "compound", "For joins two independent clauses and means because. It does not create a dependent clause the way the subordinator because would."],
  ["The marker that you borrowed is out of ink.", "complex", "That you borrowed is a dependent clause attached to one independent clause."],
  ["Whenever the alarm sounds, we line up by the lockers.", "complex", "Whenever the alarm sounds is dependent, and the rest is one independent clause."],
  ["Hang the poster after the sealant dries.", "complex", "After the sealant dries is a dependent clause."],
  ["The usher who collected the passes is in the lobby.", "complex", "Who collected the passes is a dependent relative clause."],
  ["We waited inside until the thunder stopped.", "complex", "Until the thunder stopped is dependent."],
  ["Because the cooler was open, the ice melted.", "complex", "The sentence has one dependent clause and one independent clause."],
];

export const extraSentenceTypes: Pattern[] = [
  pattern({
    id: "sentence-types-more",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "What kind of sentence is this?",
    build: (rng, difficulty) => {
      const item = rng.pick(MORE_SENTENCES);
      const choices =
        difficulty === "developing"
          ? ["simple", "compound", "complex"]
          : ["simple", "compound", "complex", "compound-complex"];
      return {
        stimulus: item[0],
        answer: item[1],
        choices,
        explanation: item[2],
        key: `more|${item[0]}`,
      };
    },
  }),
];

export const extraPhrases: Pattern[] = [
  mc("phrase-more", all, "The italicized phrase is which kind?", [
    ["The tool, *a digital caliper*, gives a more exact measurement.", "appositive", ["participial", "gerund", "infinitive"], "A digital caliper renames the tool, so it is an appositive."],
    ["We met Dr. Shah, *the new lab director*.", "appositive", ["participial", "gerund", "infinitive"], "The new lab director renames Dr. Shah."],
    ["The river, *a slow brown ribbon*, curved past the mill.", "appositive", ["participial", "gerund", "infinitive"], "A slow brown ribbon renames the river."],
    ["My neighbor *Elena* leads the section.", "appositive", ["participial", "gerund", "infinitive"], "Elena renames neighbor. An appositive can be essential and need no commas."],
    ["*Tired after the hike*, the class ate in silence.", "participial", ["appositive", "gerund", "infinitive"], "Tired after the hike is a participial phrase modifying class."],
    ["The student *waiting by the door* has the passes.", "participial", ["appositive", "gerund", "infinitive"], "Waiting by the door modifies student."],
    ["*Printed last night*, the programs are still damp.", "participial", ["appositive", "gerund", "infinitive"], "Printed last night modifies programs."],
    ["We found the lens *scratched across the middle*.", "participial", ["appositive", "gerund", "infinitive"], "Scratched across the middle modifies lens."],
    ["*Checking the scale twice* prevented the error.", "gerund", ["participial", "appositive", "infinitive"], "The phrase is the subject of prevented, so it is a gerund phrase."],
    ["The club enjoys *sketching before class*.", "gerund", ["participial", "appositive", "infinitive"], "Sketching before class is the object of enjoys and acts as a noun."],
    ["She is tired of *rewriting the caption*.", "gerund", ["participial", "infinitive", "appositive"], "Rewriting the caption is the object of the preposition of."],
    ["A useful warm-up is *humming the first line*.", "gerund", ["participial", "infinitive", "appositive"], "Humming the first line functions as a noun after is."],
    ["We paused *to hear the echo*.", "infinitive", ["participial", "gerund", "appositive"], "To hear the echo begins with to plus a verb and tells why we paused."],
    ["*To protect the lens*, cap the camera.", "infinitive", ["participial", "gerund", "appositive"], "To protect the lens tells why and begins with to plus a verb."],
    ["The director asked the cast *to hold the last note*.", "infinitive", ["gerund", "participial", "appositive"], "To hold the last note completes asked."],
    ["The best chapter *to reread tonight* is the third.", "infinitive", ["gerund", "participial", "appositive"], "To reread tonight modifies chapter."],
    ["*Whistling the melody*, Jordan found the pitch.", "participial", ["gerund", "infinitive", "appositive"], "Whistling the melody modifies Jordan, so it is a participial phrase."],
    ["The goal is *memorizing the cue*.", "gerund", ["participial", "infinitive", "appositive"], "Memorizing the cue functions as a noun after the linking verb is, so it is a gerund phrase."],
  ]),
];

const MORE_FRAGMENTS: Array<[string, string, string]> = [
  ["Because the cooler was open.", "The ice melted because the cooler was open.", "Because the cooler was open is a dependent clause and needs an independent clause."],
  ["Waiting by the stage door.", "The understudy was waiting by the stage door.", "A participial phrase needs a subject and a finite verb."],
  ["The spare gel in the top drawer.", "The spare gel in the top drawer is cracked.", "The group names something but has no verb."],
  ["Until the thunder stopped.", "We waited inside until the thunder stopped.", "Until the thunder stopped is a dependent clause."],
  ["Such as goggles, gloves, and aprons.", "The cabinet holds safety gear such as goggles, gloves, and aprons.", "Such as introduces a phrase, not a sentence."],
  ["To hear the echo in the stairwell.", "We paused to hear the echo in the stairwell.", "An infinitive phrase is not a sentence."],
  ["The usher who collected the passes.", "The usher who collected the passes is in the lobby.", "The main subject usher has no finite verb of its own."],
  ["Although the scale is small.", "Although the scale is small, the trend is clear.", "Although the scale is small is dependent."],
  ["Scratched across the middle.", "The lens, scratched across the middle, needs to be replaced.", "A participial phrase cannot stand alone."],
  ["Which the crew painted last night.", "The bridge which the crew painted last night is still closed.", "A relative clause needs an independent clause."],
  ["Beside the sink in the prep room.", "The spare goggles are beside the sink in the prep room.", "Prepositional phrases are not sentences."],
  ["Whenever the alarm sounds.", "Whenever the alarm sounds, we line up by the lockers.", "Whenever the alarm sounds is a dependent clause."],
  ["A former poet laureate.", "We read a poem by Rita Dove, a former poet laureate.", "An appositive phrase is not a sentence."],
  ["Without naming a source.", "Do not print the graph without naming a source.", "Without naming a source is a phrase."],
  ["That the units do not match.", "The fact that the units do not match changes the conclusion.", "That the units do not match is a dependent clause."],
  ["Humming the first line.", "A useful warm-up is humming the first line.", "A gerund phrase needs a full clause around it if it is going to be a sentence."],
];

const MORE_COMPLETE: Array<[string, string]> = [
  ["The librarian stamped the passes.", "Stamped is the verb for librarian."],
  ["Because the cooler was open, the ice melted.", "The dependent clause is attached to an independent clause."],
  ["Wipe the lens before you store the camera.", "The command has an understood subject, you."],
  ["The spare gel in the top drawer is cracked.", "Is cracked is the verb for gel."],
  ["We waited inside until the thunder stopped.", "We waited inside can stand on its own."],
  ["The understudy was waiting by the stage door.", "Was waiting is a complete verb phrase."],
  ["Whenever the alarm sounds, we line up.", "We line up completes the sentence."],
  ["The bridge which the crew painted is still closed.", "Is closed is the verb for bridge."],
  ["There is a spare key in the drawer.", "There is opens a complete clause."],
  ["Nobody could log in.", "The group expresses a complete thought."],
];

export const extraFragments: Pattern[] = [
  pattern({
    id: "fragment-identify-more",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Is the group of words a fragment or a complete sentence?",
    build: (rng) => {
      if (rng.next() < 0.55) {
        const [stimulus, , why] = rng.pick(MORE_FRAGMENTS);
        return {
          stimulus,
          answer: "fragment",
          choices: ["fragment", "complete sentence"],
          explanation: why,
          key: `frag|${stimulus}`,
        };
      }
      const [stimulus, why] = rng.pick(MORE_COMPLETE);
      return {
        stimulus,
        answer: "complete sentence",
        choices: ["fragment", "complete sentence"],
        explanation: why,
        key: `complete|${stimulus}`,
      };
    },
  }),
  pattern({
    id: "fragment-repair-more",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the fragment as a complete sentence.",
    lines: 2,
    build: (rng) => {
      const [stimulus, answer, explanation] = rng.pick(MORE_FRAGMENTS);
      return {
        stimulus,
        answer,
        explanation: `${explanation} Answers may vary; the key shows one complete sentence that keeps the original idea.`,
        key: `repair|${stimulus}`,
      };
    },
  }),
];

export const extraSemicolons: Pattern[] = [
  mc("semi-more", all, "Choose the punctuation that belongs in the blank.", [
    ["The scoreboard failed____ the referee used a watch.", "semicolon", ["comma", "colon", "no extra mark"], "Both sides are independent clauses with no coordinating conjunction, so use a semicolon. A comma alone would be a comma splice."],
    ["The field was muddy____ therefore, practice moved indoors.", "semicolon", ["comma", "colon", "no extra mark"], "Use a semicolon before the conjunctive adverb therefore when it joins two independent clauses."],
    ["Bring the following items____ goggles, gloves, and an apron.", "colon", ["semicolon", "comma", "no extra mark"], "Bring the following items is a complete sentence introducing a list, so a colon is correct."],
    ["The required items are____ goggles, gloves, and an apron.", "no extra mark", ["colon", "semicolon", "comma"], "Do not use a colon after a verb that the list completes."],
    ["She had one request____ a quieter ending.", "colon", ["semicolon", "comma", "no extra mark"], "A colon can introduce an explanation after a complete sentence."],
    ["The alarm sounded____ the class lined up.", "semicolon", ["comma", "colon", "no extra mark"], "These are two independent clauses. A comma alone would be a comma splice."],
    ["The warning is brief____ wear goggles.", "colon", ["semicolon", "comma", "no extra mark"], "The colon introduces the warning after a complete sentence. Wear goggles is not an independent clause, so a semicolon would be wrong."],
    ["We need four colors____ blue, gold, white, and black.", "colon", ["semicolon", "comma", "no extra mark"], "We need four colors is a complete sentence before the list."],
    ["The colors are blue, gold, white____ and black.", "comma", ["colon", "semicolon", "no extra mark"], "This is a series. The Oxford comma belongs before and."],
    ["The battery died____ the clock stopped.", "semicolon", ["comma", "colon", "no extra mark"], "Two independent clauses need a semicolon, a period, or a comma plus a conjunction."],
    ["Please pack____ a pencil, a notebook, and a calculator.", "no extra mark", ["colon", "semicolon", "comma"], "Do not put a colon between a verb and its object."],
    ["The trail forked____ the map gave no help.", "semicolon", ["comma", "colon", "no extra mark"], "A comma alone would create a comma splice."],
    ["We stayed late____ but the sealant was still tacky.", "comma", ["semicolon", "colon", "no extra mark"], "Use a comma before but when it joins two independent clauses."],
    ["The lights failed____ however, the concert continued.", "semicolon", ["comma", "colon", "no extra mark"], "However cannot join clauses by itself. Use a semicolon before it."],
    ["Only one person remembered the cue____ Jordan.", "colon", ["semicolon", "comma", "no extra mark"], "The colon introduces the name that explains one person. The first part is a complete sentence."],
    ["Store the gels____ before you strike the set.", "no extra mark", ["colon", "semicolon", "comma"], "Before you strike the set is a dependent clause. No colon or semicolon belongs there."],
    ["The roses wilted____ the ferns stayed green.", "semicolon", ["comma", "colon", "no extra mark"], "These closely related independent clauses can be joined with a semicolon."],
    ["Remember this warning____ measure twice.", "colon", ["semicolon", "comma", "no extra mark"], "The colon introduces the warning after a complete sentence."],
    ["Count twice____ pour once.", "semicolon", ["colon", "comma", "no extra mark"], "These are two short independent clauses. A comma alone would be a splice."],
    ["The tools include a level a square and a chalk line.", "This sentence needs commas, not a colon or semicolon.", ["colon after include", "semicolon after level", "colon after tools"], "Include should not be followed by a colon. The series needs commas: a level, a square, and a chalk line."],
    ["The ice melted____ meanwhile, we found another cooler.", "semicolon", ["comma", "colon", "no extra mark"], "Use a semicolon before the conjunctive adverb meanwhile."],
    ["The caption was vague____ readers missed the point.", "semicolon", ["comma", "colon", "no extra mark"], "A comma alone would create a comma splice."],
    ["The director announced the decision____ cancel the matinee.", "colon", ["semicolon", "comma", "no extra mark"], "A colon introduces the decision after a complete sentence. Cancel the matinee is not an independent clause, so a semicolon would be wrong."],
    ["We packed tape, scissors____ and string.", "comma", ["colon", "semicolon", "no extra mark"], "The blank is the Oxford comma in a series."],
    ["The roads flooded____ consequently, the match was moved.", "semicolon", ["comma", "colon", "no extra mark"], "Use a semicolon before the conjunctive adverb consequently."],
    ["At last the sealant cured____ we could hang the poster.", "semicolon", ["comma", "colon", "no extra mark"], "Both parts are independent clauses."],
    ["The lab is closed on Sunday____ nevertheless, the posters are due Monday.", "semicolon", ["comma", "colon", "no extra mark"], "Nevertheless is a conjunctive adverb and needs a semicolon before it when it joins clauses."],
    ["Our goal is clear____ finish the mural before Friday.", "colon", ["semicolon", "comma", "no extra mark"], "The colon introduces the explanation of the goal."],
  ]),
];

export const extraApostrophes: Pattern[] = [
  mc("apostrophe-more", all, "Choose the form that shows possession correctly. Read the hint in parentheses.", [
    ["The (teacher's / teachers') lounge is down the hall. (More than one teacher.)", "teachers'", ["teacher's", "teachers", "teacher"], "Teachers is already plural. Add the apostrophe after the s."],
    ["The (teacher's / teachers') lounge key is missing. (One teacher.)", "teacher's", ["teachers'", "teachers", "teacher"], "A singular noun takes apostrophe + s."],
    ["The (baby's / babies') bottles are warm. (More than one baby.)", "babies'", ["baby's", "babies", "baby"], "The plural babies already ends in s, so add an apostrophe after it."],
    ["The (baby's / babies') bottle is warm. (One baby.)", "baby's", ["babies'", "babys", "babies"], "One baby takes baby's."],
    ["The (city's / cities') mayor spoke at noon. (One city.)", "city's", ["cities'", "citys", "cities"], "One city takes city's."],
    ["The (artist's / artists') portfolios are on the table. (More than one artist.)", "artists'", ["artist's", "artists", "artist"], "The plural artists takes an apostrophe after the s."],
    ["(Maya's / Mayas) notebook is on the piano.", "Maya's", ["Mayas", "Mayas'", "Maya"], "A singular name takes apostrophe + s."],
    ["The (team's / teams') banner hung over the door. (One team.)", "team's", ["teams'", "teams", "team"], "One team takes team's."],
    ["Both (team's / teams') banners were wet. (Two teams.)", "teams'", ["team's", "teams", "team"], "Both tells you the noun is plural: teams'."],
    ["The (people's / peoples') choice was the short ending.", "people's", ["peoples'", "peoples", "people"], "People is plural but does not end in s, so add 's."],
    ["That backpack is (hers / her's).", "hers", ["her's", "hers'", "her"], "Possessive pronouns such as hers never take an apostrophe."],
    ["The victory was (ours / our's).", "ours", ["our's", "ours'", "our"], "Ours is a possessive pronoun and takes no apostrophe."],
    ["The (fox's / foxes') den is under the porch. (One fox.)", "fox's", ["foxes'", "foxs", "fox"], "One fox takes fox's."],
    ["The (fox's / foxes') dens are marked on the map. (More than one fox.)", "foxes'", ["fox's", "foxes", "fox"], "The plural foxes already ends in s, so add an apostrophe."],
    ["The (boss's / bosses') memo arrived at noon. (One boss.)", "boss's", ["bosses'", "boss'", "bosses"], "The singular noun boss takes 's."],
    ["The two (boss's / bosses') memos contradicted each other.", "bosses'", ["boss's", "bosses", "boss"], "The plural bosses takes an apostrophe after the s."],
  ]),
  rewrites("apostrophe-contraction-more", all, "rewrite", "Rewrite the sentence, replacing the words that can form a contraction.", [
    ["She is the understudy for the second scene.", "She's the understudy for the second scene.", "She is contracts to she's."],
    ["He is on the cue after the solo.", "He's on the cue after the solo.", "He is contracts to he's."],
    ["I am ready for the entrance.", "I'm ready for the entrance.", "I am contracts to I'm."],
    ["The paint is not dry.", "The paint isn't dry.", "Is not contracts to isn't."],
    ["The labels are not finished.", "The labels aren't finished.", "Are not contracts to aren't."],
    ["The bus was not late.", "The bus wasn't late.", "Was not contracts to wasn't."],
    ["The cues were not marked.", "The cues weren't marked.", "Were not contracts to weren't."],
    ["Maya did not miss the entrance.", "Maya didn't miss the entrance.", "Did not contracts to didn't."],
    ["The glue has not set.", "The glue hasn't set.", "Has not contracts to hasn't."],
    ["The partners have not agreed.", "The partners haven't agreed.", "Have not contracts to haven't."],
    ["I would not change the ending.", "I wouldn't change the ending.", "Would not contracts to wouldn't."],
    ["You should not touch the lens.", "You shouldn't touch the lens.", "Should not contracts to shouldn't."],
    ["The crew could not find the gel.", "The crew couldn't find the gel.", "Could not contracts to couldn't."],
    ["They have reset the lights.", "They've reset the lights.", "They have contracts to they've."],
    ["We have labeled every sample.", "We've labeled every sample.", "We have contracts to we've."],
    ["I will bring the camera.", "I'll bring the camera.", "I will contracts to I'll."],
    ["She will cue the music.", "She'll cue the music.", "She will contracts to she'll."],
  ]),
];

export const extraHyphens: Pattern[] = [
  mc("hyphen-more", all, "Choose the sentence that uses the hyphen correctly.", [
    ["Which sentence hyphenates the compound modifier before the noun?", "She accepted a full-time job in the lab.", ["She accepted a full time-job in the lab.", "She accepted a full-time-job in the lab.", "She accepted a time-full job in the lab."], "Hyphenate full-time when it comes before the noun job."],
    ["Which sentence correctly leaves the modifier open after the noun?", "The job in the lab is full time.", ["The job in the lab is full-time-job.", "The job-is full time in the lab.", "The full time-job is in the lab."], "After the noun, full time does not need a hyphen."],
    ["Which sentence is correct?", "Please bring a brand-new microscope.", ["Please bring a brand new-microscope.", "Please bring a brand-new-microscope.", "Please bring a new-brand microscope."], "Hyphenate brand-new before microscope."],
    ["Which sentence is correct?", "The microscope they ordered is brand new.", ["The microscope they ordered is brand-new-microscope.", "The brand new-microscope is ordered.", "The microscope is brand-new microscope."], "Brand new needs no hyphen when it follows the noun."],
    ["Which sentence is correct?", "We drank ice-cold water at the break.", ["We drank ice cold-water at the break.", "We drank ice-cold-water at the break.", "We drank cold-ice water at the break."], "Hyphenate ice-cold before water."],
    ["Which sentence is correct?", "The water at the break was ice cold.", ["The water at the break was ice-cold-water.", "The ice cold-water was at the break.", "The water was ice-cold water at."], "No hyphen is needed when ice cold follows the noun."],
    ["Which sentence is correct?", "Submit a well-written essay by Friday.", ["Submit a well written-essay by Friday.", "Submit a well-written-essay by Friday.", "Submit a written-well essay by Friday."], "Hyphenate well-written before essay."],
    ["Which sentence is correct?", "The essay she submitted is well written.", ["The essay she submitted is well-written-essay.", "The well written-essay is submitted.", "The essay is well-written essay."], "Well written is open when it follows the noun."],
    ["Which sentence is correct?", "Replace the out-of-date map.", ["Replace the out of date-map.", "Replace the out-of-date-map.", "Replace the date-out of map."], "Hyphenate the whole compound modifier out-of-date before map."],
    ["Which sentence is correct?", "The map in the folder is out of date.", ["The map in the folder is out-of-date-map.", "The out of date-map is in the folder.", "The map is out-of date folder."], "Out of date needs no hyphens when it follows the noun."],
    ["Which sentence is correct?", "The world-famous mural faces the street.", ["The world famous-mural faces the street.", "The world-famous-mural faces the street.", "The famous-world mural faces the street."], "Hyphenate world-famous before mural."],
    ["Which sentence is correct?", "The mural that faces the street is world famous.", ["The mural that faces the street is world-famous-mural.", "The world famous-mural faces is.", "The mural is world-famous mural."], "World famous is open after the noun."],
    ["Which sentence is correct?", "Leave the half-finished backdrop alone.", ["Leave the half finished-backdrop alone.", "Leave the half-finished-backdrop alone.", "Leave the finished-half backdrop alone."], "Hyphenate half-finished before backdrop."],
    ["Which sentence is correct?", "The backdrop on stage is half finished.", ["The backdrop on stage is half-finished-backdrop.", "The half finished-backdrop is on stage.", "The backdrop is half-finished backdrop."], "Half finished is open when it follows the noun."],
    ["Which sentence is correct?", "We followed a well-planned route.", ["We followed a well planned-route.", "We followed a well-planned-route.", "We followed a planned-well route."], "Hyphenate well-planned before route."],
    ["Which sentence is correct?", "The route we followed was well planned.", ["The route we followed was well-planned-route.", "The well planned-route was followed.", "The route was well-planned route."], "Well planned is open after the noun."],
    ["Which sentence is correct?", "A fast-moving storm delayed the match.", ["A fast moving-storm delayed the match.", "A fast-moving-storm delayed the match.", "A moving-fast storm delayed the match."], "Hyphenate fast-moving before storm."],
    ["Which sentence is correct?", "The storm that delayed the match was fast moving.", ["The storm that delayed the match was fast-moving-storm.", "The fast moving-storm was delayed.", "The storm was fast-moving storm."], "Fast moving is open after the noun."],
    ["Which sentence is correct?", "Read the two-hour rehearsal notes.", ["Read the two hour-rehearsal notes.", "Read the two-hour-rehearsal notes.", "Read the hour-two rehearsal notes."], "Hyphenate two-hour when it modifies rehearsal notes. The number-plus-noun modifier comes before the noun."],
    ["Which sentence is correct?", "The rehearsal lasts two hours.", ["The rehearsal lasts two-hours.", "The rehearsal-lasts two hours.", "The two-hours lasts rehearsal."], "Two hours is not a modifier before another noun, so do not hyphenate it."],
    ["Which sentence is correct?", "The editor wrote an in-depth review.", ["The editor wrote an in depth-review.", "The editor wrote an in-depth-review.", "The editor wrote a depth-in review."], "Hyphenate in-depth before review."],
    ["Which sentence is correct?", "The review of the play was in depth.", ["The review of the play was in-depth-review.", "The in depth-review was of the play.", "The review was in-depth review."], "In depth is open when it follows the verb and is not placed before a noun."],
    ["Which sentence is correct?", "We attended an on-site rehearsal.", ["We attended an on site-rehearsal.", "We attended an on-site-rehearsal.", "We attended a site-on rehearsal."], "Hyphenate on-site before rehearsal."],
    ["Which sentence is correct?", "The rehearsal was held on site.", ["The rehearsal was held on-site-rehearsal.", "The on site-rehearsal was held.", "The rehearsal was on-site rehearsal."], "On site needs no hyphen in the phrase on site after the verb."],
  ]),
];

const MORE_TITLES: Array<[string, string, string]> = [
  ["The class is reading To Kill a Mockingbird.", "The class is reading *To Kill a Mockingbird*.", "Book titles are italicized. Underline them when you write by hand."],
  ["We discussed The House on Mango Street in class.", "We discussed *The House on Mango Street* in class.", "The title of a book is italicized."],
  ["Fahrenheit 451 is on the reserve shelf.", "Fahrenheit 451 is on the reserve shelf.".replace("Fahrenheit 451", "*Fahrenheit 451*"), "A novel's title is italicized."],
  ["The ninth graders are reading The Odyssey.", "The ninth graders are reading *The Odyssey*.", "Titles of long works, including epics, are italicized."],
  ["Lord of the Flies starts with a conch shell.", "Lord of the Flies starts with a conch shell.".replace("Lord of the Flies", "*Lord of the Flies*"), "Book titles are italicized."],
  ["Animal Farm is a short novel with a sharp ending.", "Animal Farm is a short novel with a sharp ending.".replace("Animal Farm", "*Animal Farm*"), "The title of a novel is italicized."],
  ["Our seminar compared The Great Gatsby with a modern novel.", "Our seminar compared *The Great Gatsby* with a modern novel.", "Book titles are italicized."],
  ["The drama class is staging The Crucible.", "The drama class is staging *The Crucible*.", "Play titles are italicized."],
  ["Romeo and Juliet is this year's fall play.", "Romeo and Juliet is this year's fall play.".replace("Romeo and Juliet", "*Romeo and Juliet*"), "Play titles are italicized."],
  ["The Glass Menagerie closes on Saturday.", "The Glass Menagerie closes on Saturday.".replace("The Glass Menagerie", "*The Glass Menagerie*"), "A play title is italicized."],
  ["Persepolis is the graphic memoir we chose.", "Persepolis is the graphic memoir we chose.".replace("Persepolis", "*Persepolis*"), "Titles of books, including graphic memoirs, are italicized."],
  ["The film Spirited Away is on reserve.", "The film *Spirited Away* is on reserve.", "Film titles are italicized."],
  ["Her essay cites an article from Scientific American.", "Her essay cites an article from *Scientific American*.", "Magazine titles are italicized."],
  ["I borrowed The Atlantic from the library.", "I borrowed *The Atlantic* from the library.", "Magazine titles are italicized."],
  ["The jazz band listened to Kind of Blue.", "The jazz band listened to *Kind of Blue*.", "Album titles are italicized."],
  ["Please read the poem The Raven aloud.", 'Please read the poem "The Raven" aloud.', "Poem titles go in quotation marks."],
  ["Mother to Son is the poem posted by the door.", 'Mother to Son is the poem posted by the door.'.replace("Mother to Son", '"Mother to Son"'), "A poem title takes quotation marks."],
  ["We analyzed the poem Harlem.", 'We analyzed the poem "Harlem."', "Poem titles go in quotation marks, and the period belongs inside the closing quotation mark."],
  ["The story The Gift of the Magi ends with a twist.", 'The story "The Gift of the Magi" ends with a twist.', "Short-story titles go in quotation marks."],
  ["Have you read The Most Dangerous Game?", 'Have you read "The Most Dangerous Game"?', "The story title takes quotation marks. The question mark belongs to the whole sentence, so it stays outside."],
  ["The chapter The Fire explains the symbol.", 'The chapter "The Fire" explains the symbol.', "Chapter titles go in quotation marks."],
  ["Her song Lean on Me closed the assembly.", 'Her song "Lean on Me" closed the assembly.', "Song titles go in quotation marks. The album title would be italicized."],
  ["The article School Lunch, Revised needs a source.", 'The article "School Lunch, Revised" needs a source.', "Article titles go in quotation marks."],
  ["We watched the episode The Empty City.", 'We watched the episode "The Empty City."', "Episode titles go in quotation marks, and the period belongs inside the closing quotation mark."],
  ["The speech The Gettysburg Address is shorter than students expect.", 'The speech "The Gettysburg Address" is shorter than students expect.', "The title of a speech is placed in quotation marks."],
  ["Her essay quotes the poem Because I could not stop for Death.", 'Her essay quotes the poem "Because I could not stop for Death."', "Poem titles go in quotation marks, and the period belongs inside the closing quotation mark."],
  ["The book Persepolis contains the chapter The Veil.", 'The book *Persepolis* contains the chapter "The Veil."', "Italicize the book and put quotation marks around the chapter. The period goes inside the closing quotation mark."],
  ["We compared the poem Harlem with the film Do the Right Thing.", 'We compared the poem "Harlem" with the film *Do the Right Thing*.', "The poem takes quotation marks, and the film title is italicized."],
];

export const extraTitles: Pattern[] = [
  pattern({
    id: "titles-more",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence, punctuating the title correctly. Use *asterisks* to show italics.",
    lines: 2,
    build: (rng) => {
      const [stimulus, answer, explanation] = rng.pick(MORE_TITLES);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
];

const DEGREES: Array<[string, string, string, string, string]> = [
  ["quiet", "quieter", "quietest", "hallway", "hallways"],
  ["tall", "taller", "tallest", "player", "players"],
  ["short", "shorter", "shortest", "speech", "speeches"],
  ["easy", "easier", "easiest", "route", "routes"],
  ["heavy", "heavier", "heaviest", "backpack", "backpacks"],
  ["funny", "funnier", "funniest", "caption", "captions"],
  ["busy", "busier", "busiest", "week", "weeks"],
  ["cold", "colder", "coldest", "morning", "mornings"],
  ["warm", "warmer", "warmest", "room", "rooms"],
  ["kind", "kinder", "kindest", "note", "notes"],
  ["loud", "louder", "loudest", "alarm", "alarms"],
  ["safe", "safer", "safest", "path", "paths"],
  ["neat", "neater", "neatest", "diagram", "diagrams"],
  ["late", "later", "latest", "bus", "buses"],
  ["careful", "more careful", "most careful", "editor", "editors"],
  ["helpful", "more helpful", "most helpful", "guide", "guides"],
  ["precise", "more precise", "most precise", "scale", "scales"],
  ["serious", "more serious", "most serious", "error", "errors"],
];

export const extraComparisons: Pattern[] = [
  choicePattern(
    "compare-more",
    BAND.all,
    "Choose the comparative or superlative form that fits.",
    DEGREES.flatMap(([base, comp, sup, one, many]) => [
      {
        stimulus: `Of the two ${many}, this one is ____.`,
        answer: comp,
        distractors: [sup, base],
        explanation: `Two ${many} call for the comparative form ${comp}.`,
      },
      {
        stimulus: `This ${one} is ____ than the other ${one}.`,
        answer: comp,
        distractors: [sup, base],
        explanation: `Than compares two, so use the comparative ${comp}.`,
      },
      {
        stimulus: `Of the five ${many}, this one is the ____.`,
        answer: sup,
        distractors: [comp, base],
        explanation: `Five ${many} call for the superlative form ${sup}.`,
      },
    ]),
  ),
  rewrites("compare-fix-more", all, "rewrite", "Rewrite the sentence so the comparison is grammatical.", [
    ["This hallway is more quieter than the gym.", "This hallway is quieter than the gym.", "Quieter is already comparative. Do not add more."],
    ["She is the most kindest guide in the program.", "She is the kindest guide in the program.", "Kindest is already superlative. Do not add most."],
    ["Of the two routes, this one is the easiest.", "Of the two routes, this one is easier.", "Two routes call for the comparative easier."],
    ["Of the five routes, this one is easier.", "Of the five routes, this one is the easiest.", "Five routes call for the superlative easiest."],
    ["The diagram is more neater than the first sketch.", "The diagram is neater than the first sketch.", "Neater is already the comparative form."],
    ["That was the most worst error in the lab.", "That was the worst error in the lab.", "Worst is already superlative."],
    ["This scale is less preciser than the old one.", "This scale is less precise than the old one.", "Less already makes the comparison. Use the positive form precise."],
    ["He is more busier this week than last week.", "He is busier this week than last week.", "Busier is already comparative."],
    ["Of the two editors, this one is the most careful.", "Of the two editors, this one is more careful.", "Two editors call for the comparative more careful, not the superlative."],
    ["Of the four editors, this one is more careful.", "Of the four editors, this one is the most careful.", "More than two editors call for the superlative most careful."],
  ]),
];

export const extraCapitalization: Pattern[] = [
  rewrites("capitalization-more", all, "rewrite", "Rewrite the sentence with correct capitalization.", [
    ["we visited yellowstone national park in july.", "We visited Yellowstone National Park in July.", "Capitalize the first word, the proper noun Yellowstone National Park, and the month July."],
    ["my uncle james lives in santa fe.", "My Uncle James lives in Santa Fe.", "Capitalize the first word, Uncle when it is part of the name Uncle James, and the city Santa Fe."],
    ["the debate club meets on wednesday.", "The debate club meets on Wednesday.", "Capitalize the first word and the day Wednesday. Do not capitalize debate when it is a general activity."],
    ["i am taking algebra 2 and french.", "I am taking Algebra 2 and French.", "Capitalize I, the numbered course title Algebra 2, and the language French."],
    ["we drove north toward lake superior.", "We drove north toward Lake Superior.", "Do not capitalize north when it is a direction. Capitalize the proper noun Lake Superior."],
    ["she wrote about the great depression in history class.", "She wrote about the Great Depression in history class.", "Capitalize the historical name Great Depression. Do not capitalize the general subject history."],
    ["mayor chen spoke on veterans day.", "Mayor Chen spoke on Veterans Day.", "Capitalize a title directly before a name and the holiday Veterans Day."],
    ["the mayor spoke on a monday.", "The mayor spoke on a Monday.", "Do not capitalize mayor when no name follows it. Capitalize the day Monday."],
    ["on labor day the pool was closed.", "On Labor Day the pool was closed.", "Capitalize the holiday Labor Day."],
    ["luis said, \"the gel cracked.\"", "Luis said, \"The gel cracked.\"", "Capitalize a name and the first word of a quoted sentence."],
    ["the novel animal farm is in room 4.", "The novel *Animal Farm* is in room 4.".replace("*Animal Farm*", "Animal Farm"), "Capitalize the first word and the main words of a title. This item asks only for capitals, so Animal Farm is capitalized and not italicized here."],
    ["please send the form to 14 maple street.", "Please send the form to 14 Maple Street.", "Capitalize the first word and the parts of the street name."],
    ["dear members of the yearbook staff:", "Dear Members of the Yearbook Staff:", "In a greeting, capitalize the first word and the main words."],
    ["sincerely yours,", "Sincerely yours,", "Capitalize the first word of a closing. Do not capitalize yours."],
    ["the appalachian mountains are east of the river.", "The Appalachian Mountains are east of the river.", "Capitalize the proper noun Appalachian Mountains. Do not capitalize east as a direction."],
    ["we observed saturn on friday.", "We observed Saturn on Friday.", "Capitalize the planet and the day."],
    ["dr. shah opened the greenhouse.", "Dr. Shah opened the greenhouse.", "Capitalize the abbreviated title and the name."],
    ["the doctor opened the greenhouse.", "The doctor opened the greenhouse.", "Do not capitalize doctor when no name follows it."],
    ["our school celebrates juneteenth in june.", "Our school celebrates Juneteenth in June.", "Capitalize the holiday and the month."],
    ["i asked, \"where is room 204?\"", "I asked, \"Where is room 204?\"", "Capitalize I and the first word of the quoted question."],
  ]),
];

const SMALL_NUMBERS: Array<[number, string, string]> = [
  [2, "two", "clipboards"],
  [3, "three", "music stands"],
  [4, "four", "fossil casts"],
  [5, "five", "extension cords"],
  [6, "six", "safety goggles"],
  [7, "seven", "spare reeds"],
  [8, "eight", "folding tables"],
  [9, "nine", "meter sticks"],
];

const LARGE_NUMBERS: Array<[string, string, string]> = [
  ["fifteen", "15", "cameras"],
  ["eighteen", "18", "programs"],
  ["twenty", "20", "risers"],
  ["twenty-four", "24", "chairs"],
  ["thirty", "30", "folders"],
  ["forty-two", "42", "samples"],
];

const START_NUMBERS: Array<[string, string]> = [
  ["12 volunteers signed the sheet.", "Twelve volunteers signed the sheet."],
  ["15 cameras were checked out.", "Fifteen cameras were checked out."],
  ["18 programs arrived late.", "Eighteen programs arrived late."],
  ["20 risers belong in the gym.", "Twenty risers belong in the gym."],
  ["11 students missed the bus.", "Eleven students missed the bus."],
  ["40 samples need new labels.", "Forty samples need new labels."],
];

const TIMES: Array<[string, string, string]> = [
  ["Choir call is at six thirty p.m.", "Choir call is at 6:30 p.m.", "Use numerals for a time with p.m."],
  ["The lab opens at nine fifteen a.m.", "The lab opens at 9:15 a.m.", "Use numerals for a time with a.m."],
  ["The bus leaves at seven forty-five a.m.", "The bus leaves at 7:45 a.m.", "Use numerals for a time with a.m."],
  ["Rehearsal starts at four p.m. on Thursday.", "Rehearsal starts at 4:00 p.m. on Thursday.", "Include minutes when you write a time with p.m."],
  ["The box office closes at ten p.m.", "The box office closes at 10:00 p.m.", "Use a numeral with minutes for a time followed by p.m."],
  ["Homeroom begins at eight a.m.", "Homeroom begins at 8:00 a.m.", "Use a numeral with minutes for a time followed by a.m."],
];

export const extraNumbers: Pattern[] = [
  pattern({
    id: "numbers-more",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence using the classroom number rules.",
    lines: 1,
    build: (rng) => {
      const small = SMALL_NUMBERS.map(([digit, word, noun]) => [
        `The supply cart holds ${digit} ${noun}.`,
        `The supply cart holds ${word} ${noun}.`,
        `Spell out ${word}, a number from one through nine.`,
      ]);
      const large = LARGE_NUMBERS.map(([word, digit, noun]) => [
        `The library loaned ${word} ${noun}.`,
        `The library loaned ${digit} ${noun}.`,
        `Use numerals for 10 and above when the number does not begin the sentence.`,
      ]);
      const starts = START_NUMBERS.map(([stimulus, answer]) => [
        stimulus,
        answer,
        "Spell out a number that begins a sentence.",
      ]);
      const times = TIMES.map(([stimulus, answer, why]) => [stimulus, answer, why]);
      const [stimulus, answer, explanation] = rng.pick([...small, ...large, ...starts, ...times]);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
];

export const extraRegister: Pattern[] = [
  pattern({
    id: "register-more",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence in a formal academic register. Keep the meaning.",
    lines: 2,
    build: (rng) => {
      const rows = [
        ["The lab write-up was a mess because the group kinda guessed the units.", "The lab report was unclear because the group estimated the units.", "Formal writing replaces a mess and kinda guessed with precise wording."],
        ["A bunch of readers think the ending is super abrupt.", "Many readers find the ending abrupt.", "Replace a bunch of and super with more exact wording."],
        ["The author is basically saying that the town is stuck.", "The author argues that the town is stuck.", "Basically saying is too casual for a literary claim."],
        ["This source is awesome since it has a ton of charts.", "This source is useful because it includes many charts.", "Awesome and a ton of are slang."],
        ["We gotta label the samples or the data's gonna be useless.", "We must label the samples, or the data will be useless.", "Gotta and gonna are informal."],
        ["The map is okay, but the legend is sort of confusing.", "The map is adequate, but the legend is confusing.", "Okay and sort of weaken a formal description."],
        ["At the end of the day, the experiment didn't prove much.", "Ultimately, the experiment was inconclusive.", "Replace the cliché and name the result more precisely."],
        ["The narrator is totally obsessed with the clock.", "The narrator is preoccupied with the clock.", "Totally obsessed is more casual than the claim needs to be."],
        ["I feel like the theme is basically loyalty.", "The theme is loyalty.", "I feel like and basically can be cut from a formal claim."],
        ["The trial got messed up when somebody forgot to write stuff down.", "The trial failed because the observations were not recorded.", "Name the error instead of using messed up and stuff."],
        ["This line really hits because it shows the kid's guilt.", "This line is effective because it shows the child's guilt.", "Really hits and kid are informal."],
        ["The results were pretty bad, so we did the whole thing over.", "The results were unreliable, so we repeated the procedure.", "Pretty bad and did over are less precise than unreliable and repeated."],
        ["The article talks about how the bridge is a big deal.", "The article explains why the bridge matters.", "Talks about and a big deal are informal."],
        ["You shouldn't just skip the counterargument.", "Writers should address the counterargument.", "You is conversational here. A formal sentence can name writers."],
        ["Lots of people won't buy the conclusion.", "Some readers may reject the conclusion.", "Lots of people won't buy is conversational."],
        ["So yeah, the graph backs up the claim.", "The graph supports the claim.", "So yeah and backs up are informal. Supports is the careful verb."],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return {
        stimulus,
        answer,
        explanation: `${explanation} Answers may vary; the key shows one strong revision.`,
        key: stimulus,
      };
    },
  }),
  mc("register-choice-more", all, "Which wording is the most formal?", [
    ["Choose the most formal way to describe an unclear result.", "The result is inconclusive.", ["The result is kind of a mess.", "The result is super unclear.", "The result is not that great."], "Inconclusive is precise and formal."],
    ["Choose the most formal noun for the people in a class.", "the students", ["the kids", "the guys", "a bunch of kids"], "Students is the formal noun."],
    ["Choose the most formal verb.", "demonstrates", ["kinda shows", "is basically like", "goes on about"], "Demonstrates is precise."],
    ["Choose the most formal request.", "Please submit the revision by Monday.", ["Can you get me the revision by Monday?", "I need that revision ASAP.", "Drop the revision off whenever."], "The formal request is specific and free of texting abbreviations."],
    ["Choose the most formal phrase for more evidence.", "additional evidence", ["a lot more stuff", "extra junk to look at", "tons more proof"], "Additional evidence is the standard academic phrase."],
    ["Choose the most formal way to name a disagreement.", "The data do not support that conclusion.", ["The data don't really prove it.", "Nobody's gonna buy that.", "That conclusion is kind of wrong."], "Do not support is measured and formal."],
    ["Choose the most formal word for a child in a report.", "the child", ["the kid", "the kiddie", "the little guy"], "Child is the formal noun."],
    ["Choose the most formal closing.", "The quotation supports the claim.", ["So yeah, the quote proves it.", "The quote totally backs this up.", "That's basically the proof."], "Supports the claim is formal. A single quotation rarely proves a claim by itself."],
  ]),
];

export const extraPrepositions: Pattern[] = [
  mc(
    "prep-more",
    all,
    "Which word is a preposition?",
    (
      [
        ["The passes are inside the folder.", "inside", ["passes", "are", "folder"]],
        ["A ladder leans against the wall.", "against", ["ladder", "leans", "wall"]],
        ["We walked past the trophy case.", "past", ["walked", "trophy", "case"]],
        ["The note slipped behind the piano.", "behind", ["note", "slipped", "piano"]],
        ["Hang the gels below the work light.", "below", ["Hang", "gels", "light"]],
        ["The path continues beyond the gate.", "beyond", ["path", "continues", "gate"]],
        ["They practiced during the storm.", "during", ["practiced", "storm", "They"]],
        ["The quotation comes from the novel.", "from", ["quotation", "comes", "novel"]],
        ["Set the beaker upon the stand.", "upon", ["Set", "beaker", "stand"]],
        ["The choir stood among the risers.", "among", ["choir", "stood", "risers"]],
        ["We met outside the auditorium.", "outside", ["met", "auditorium", "We"]],
        ["The key is underneath the mat.", "underneath", ["key", "is", "mat"]],
        ["A vine grew around the railing.", "around", ["vine", "grew", "railing"]],
        ["The bus leaves before sunset.", "before", ["bus", "leaves", "sunset"]],
        ["She stored the camera within the case.", "within", ["stored", "camera", "case"]],
        ["The mural stretches across the lobby.", "across", ["mural", "stretches", "lobby"]],
      ] as const
    ).map(([stimulus, answer, distractors]) => [
      stimulus,
      answer,
      distractors,
      `${answer.charAt(0).toUpperCase()}${answer.slice(1)} relates its object to another word in the sentence, so it is a preposition.`,
    ]),
  ),
];

export const extraAdjectives: Pattern[] = [
  mc("adj-adv-more", all, "Choose the adjective or adverb that correctly completes the sentence.", [
    ["The choir sang the last chord (good / well).", "well", ["good"], "Well is the adverb that modifies the action verb sang. Good is an adjective."],
    ["The last chord sounded (good / well).", "good", ["well"], "Sounded is a linking verb. Good is a predicate adjective describing chord."],
    ["Maya answered the question (bad / badly).", "badly", ["bad"], "Badly modifies the action verb answered."],
    ["The answer was (bad / badly).", "bad", ["badly"], "Was links answer to the adjective bad."],
    ["The hinge is (real / really) loose.", "really", ["real"], "Really is an adverb modifying the adjective loose."],
    ["The loose hinge is a (real / really) problem.", "real", ["really"], "Real is an adjective modifying the noun problem."],
    ["Copy the formula (easy / easily).", "easily", ["easy"], "Easily modifies the action verb copy."],
    ["The formula looks (easy / easily).", "easy", ["easily"], "Looks is a linking verb. Easy describes formula."],
    ["He closed the case (soft / softly).", "softly", ["soft"], "Softly modifies the action verb closed."],
    ["The cloth feels (soft / softly).", "soft", ["softly"], "Feels is linking here. Soft describes cloth."],
    ["The alarm rang (loud / loudly).", "loudly", ["loud"], "Loudly modifies the action verb rang."],
    ["The alarm was (loud / loudly).", "loud", ["loudly"], "Was links alarm to the adjective loud."],
    ["Label the samples (quick / quickly).", "quickly", ["quick"], "Quickly modifies the action verb label."],
    ["Be (quick / quickly) with the labels.", "quick", ["quickly"], "Be is a linking verb. Quick describes the understood subject you."],
    ["She finished the scale (complete / completely).", "completely", ["complete"], "Completely modifies the action verb finished."],
    ["The scale is (complete / completely).", "complete", ["completely"], "Is links scale to the adjective complete."],
    ["Check the units (careful / carefully) before you publish.", "carefully", ["careful"], "Carefully modifies the action verb check."],
    ["A (careful / carefully) check saved the graph.", "careful", ["carefully"], "Careful is an adjective modifying the noun check."],
  ]),
];

export const extraInterjections: Pattern[] = [
  mc(
    "interjection-more",
    all,
    "Which word is an interjection?",
    (
      [
        ["Gee, that solution turned pink.", "Gee", ["solution", "turned", "pink"]],
        ["Aha! The missing stamp was under the blotter.", "Aha", ["stamp", "blotter", "missing"]],
        ["Phew, the backdrop fits the frame.", "Phew", ["backdrop", "fits", "frame"]],
        ["Ew, the culture spilled on the bench.", "Ew", ["culture", "spilled", "bench"]],
        ["Shh, the recording has started.", "Shh", ["recording", "started", "has"]],
        ["Gosh, the auditorium is already full.", "Gosh", ["auditorium", "already", "full"]],
        ["Rats, the battery is dead.", "Rats", ["battery", "dead", "is"]],
        ["Oops, the totals do not match.", "Oops", ["totals", "match", "do"]],
        ["Whoa, the labels are switched.", "Whoa", ["labels", "switched", "are"]],
        ["Yes! The second trial matched the first.", "Yes", ["trial", "matched", "first"]],
        ["No, the samples are not ready.", "No", ["samples", "ready", "are"]],
        ["Hello, is the microphone on?", "Hello", ["microphone", "is", "on"]],
        ["Darn, the printer jammed again.", "Darn", ["printer", "jammed", "again"]],
        ["Wow, the echo in the stairwell is huge.", "Wow", ["echo", "stairwell", "huge"]],
      ] as const
    ).map(([stimulus, answer, distractors]) => [
      stimulus,
      answer,
      distractors,
      `${answer} expresses feeling and is grammatically separate from the rest of the sentence, so it is an interjection.`,
    ]),
  ),
];

export const extraCommas: Pattern[] = [
  pattern({
    id: "comma-address",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence, adding commas to set off a name used in direct address.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const rows = [
        [`${name} please return the beakers.`, `${name}, please return the beakers.`, `A comma sets off ${name} when the name addresses someone directly.`],
        [`Please return the beakers ${name}.`, `Please return the beakers, ${name}.`, `A comma sets off a name used in direct address at the end of the sentence.`],
        [`The beakers ${name} belong in the cabinet.`, `The beakers, ${name}, belong in the cabinet.`, `Commas set off a name that interrupts the sentence to address someone.`],
        [`${name} the cue is in ten seconds.`, `${name}, the cue is in ten seconds.`, `A comma follows a name used to get someone's attention.`],
        [`I need the spare key ${name} before the scene.`, `I need the spare key, ${name}, before the scene.`, `Commas set off the name because it is direct address, not the owner of the key.`],
        [`Thank you ${name} for labeling the samples.`, `Thank you, ${name}, for labeling the samples.`, `Commas set off the name of the person being thanked.`],
        [`${name} did you check the units?`, `${name}, did you check the units?`, `A comma sets off a name before a question addressed to that person.`],
        [`Can you hear the cue ${name}?`, `Can you hear the cue, ${name}?`, `A comma sets off the name at the end of a question.`],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
  rewrites("comma-place-date", all, "rewrite", "Rewrite the sentence, adding commas where a date or a place name needs them.", [
    ["The concert is on Friday May 2.", "The concert is on Friday, May 2.", "A comma separates the day of the week from the date."],
    ["The concert is on Friday May 2 2026 in the gym.", "The concert is on Friday, May 2, 2026, in the gym.", "Use commas between the weekday and the date, between the date and the year, and after the year when the sentence continues."],
    ["We visited Denver Colorado in April.", "We visited Denver, Colorado, in April.", "A comma separates a city from its state, and another comma follows the state when the sentence continues."],
    ["Send the form to 14 Oak Street Denver Colorado 80202 before Friday.", "Send the form to 14 Oak Street, Denver, Colorado 80202, before Friday.", "Commas separate the street, the city, and the state. A comma also follows the ZIP code when the sentence continues. Do not put a comma between the state and the ZIP code."],
    ["The letter came from Austin Texas on Monday.", "The letter came from Austin, Texas, on Monday.", "A comma separates the city and the state, and a comma follows the state because the sentence continues."],
    ["Her birthday is March 14 2011.", "Her birthday is March 14, 2011.", "A comma separates the day from the year. Do not put a comma between the month and the day."],
    ["On March 14 2011 the lab opened.", "On March 14, 2011, the lab opened.", "A comma separates the day and the year, and a comma follows the year when the sentence continues."],
    ["The museum is in Santa Fe New Mexico.", "The museum is in Santa Fe, New Mexico.", "A comma separates the city from the state. No comma follows the state when the state ends the sentence."],
    ["They moved to Portland Oregon in June 2019.", "They moved to Portland, Oregon, in June 2019.", "A comma separates the city and the state, and a comma follows the state. Do not put a comma between the month and the year when no day is given."],
    ["The conference runs from Monday June 3 through Thursday June 6.", "The conference runs from Monday, June 3, through Thursday, June 6.", "A comma separates each weekday from its date."],
    ["Meet us in room 12 on Tuesday April 8.", "Meet us in room 12 on Tuesday, April 8.", "A comma separates the day of the week from the month and date."],
    ["The return address is 9 River Road Bend Oregon 97701.", "The return address is 9 River Road, Bend, Oregon 97701.", "Commas separate the street, the city, and the state. No comma belongs between the state and the ZIP code, and none follows the ZIP code at the end of the sentence."],
    ["She was born in Nairobi Kenya.", "She was born in Nairobi, Kenya.", "A comma separates a city from its country."],
    ["The flight leaves Dallas Texas at noon.", "The flight leaves Dallas, Texas, at noon.", "A comma separates the city and the state, and a comma follows the state because the sentence continues."],
  ]),
];

export const extraVerbs: Pattern[] = [
  mc("verb-kind-more", all, "The italicized verb is best labeled:", [
    ["The milk *turned* sour overnight.", "linking", ["action", "helping"], "Turned links milk to the description sour. It means became."],
    ["The cook *turned* the pancakes.", "action", ["linking", "helping"], "Turned tells what the cook did to the pancakes, which are the direct object."],
    ["The actors *were* nervous before the cue.", "linking", ["action", "helping"], "Were links actors to the description nervous."],
    ["The actors *were* waiting in the wings.", "helping", ["action", "linking"], "Were helps the main verb waiting."],
    ["The door *remained* open.", "linking", ["action", "helping"], "Remained links door to the description open."],
    ["The toast *smelled* burnt.", "linking", ["action", "helping"], "Smelled links toast to burnt. There is no direct object."],
    ["The cook *smelled* the soup.", "action", ["linking", "helping"], "Smelled shows an action the cook performed on the soup."],
    ["The candle *burned* until midnight.", "action", ["linking", "helping"], "Burned tells what the candle did. Until midnight is not a subject complement."],
    ["The soloist *might* forget the cue.", "helping", ["action", "linking"], "Might is a modal helping verb before the main verb forget."],
    ["The team *has* scored in the first minute.", "helping", ["action", "linking"], "Has helps the main verb scored."],
  ]),
];

export const EXTRA_PATTERNS: Record<string, Pattern[]> = {
  verbs: extraVerbs,
  conjunctions: extraConjunctions,
  "pronoun-antecedent": extraAntecedents,
  "verb-tense": extraTense,
  "verb-mood": extraMoods,
  clauses: extraClauses,
  "sentence-types": extraSentenceTypes,
  phrases: extraPhrases,
  fragments: extraFragments,
  "semicolons-colons": extraSemicolons,
  apostrophes: extraApostrophes,
  "hyphens-dashes": extraHyphens,
  titles: extraTitles,
  "comparative-superlative": extraComparisons,
  capitalization: extraCapitalization,
  "numbers-abbreviations": extraNumbers,
  "formal-informal": extraRegister,
  prepositions: extraPrepositions,
  "adjectives-adverbs": extraAdjectives,
  interjections: extraInterjections,
  commas: extraCommas,
};
