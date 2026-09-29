import { NAMES } from "./names";
import { BAND, choicePattern, pattern, revisionPattern, type Pattern } from "./engine";

const ENDINGS: Array<[string, string, string]> = [
  ["Where did {name} leave the permission slip", "?", "This is a direct question."],
  ["{name} asked where the permission slip was", ".", "An indirect question states that a question was asked, so it ends with a period."],
  ["Return the permission slip tomorrow", ".", "This is a command, so it ends with a period."],
  ["Watch out for the broken glass", "!", "The sentence expresses a strong warning, so an exclamation point fits."],
  ["The broken glass is in the sink", ".", "This is a statement."],
  ["Who has the spare key", "?", "This is a direct question."],
  ["I wonder who has the spare key", ".", "I wonder introduces an indirect question."],
  ["Please stack the chairs", ".", "A polite command ends with a period."],
  ["The choir finally nailed the ending", ".", "This is a statement, so it ends with a period."],
  ["Did {name} check the units", "?", "This is a direct yes-or-no question."],
  ["{name} wondered whether the units were consistent", ".", "Whether introduces an indirect question."],
  ["Look out below", "!", "This is a shouted warning, so it ends with an exclamation point."],
  ["The museum opens at noon", ".", "This is a statement."],
  ["What time does the museum open", "?", "This is a direct question."],
  ["Tell me what time the museum opens", ".", "Tell me what... is a command containing an indirect question."],
  ["Would you please pass the beaker", ".", "This is a polite request, not a question the speaker expects to be answered with yes or no."],
  ["Are the beakers back in the cabinet", "?", "This is a direct question."],
  ["{name} wants to know if the beakers are back", ".", "If the beakers are back is an indirect question."],
  ["Congratulations on the encore", "!", "The sentence expresses strong feeling."],
  ["The encore was well deserved", ".", "This is a calmer statement, so use a period."],
  ["How did the backdrop get torn", "?", "This is a direct question."],
  ["Ask how the backdrop got torn", ".", "Ask how... is a command, and the question is indirect."],
  ["Leave the wet paint alone", ".", "This is a command."],
  ["The field is too muddy for practice", ".", "This is a statement."],
  ["Can you believe the size of that backdrop", "?", "This is a direct question, even if it is rhetorical."],
  ["{name} could not believe the size of the backdrop", ".", "This is a statement."],
  ["Hand me the goggles", ".", "This is a command."],
  ["Where are the goggles", "?", "This is a direct question."],
];

export const endPunctuationPatterns: Pattern[] = [
  pattern({
    id: "end-mark",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Which end mark belongs at the end of the sentence?",
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [stem, answer, why] = rng.pick(ENDINGS);
      const stimulus = `${stem.replaceAll("{name}", name)}___`;
      return {
        stimulus,
        answer,
        choices: [".", "?", "!"],
        explanation: why.replaceAll("{name}", name),
        key: stimulus,
      };
    },
  }),
];

function commaRewrite(
  id: string,
  prompt: string,
  rows: Array<[string, string, string]>,
): Pattern {
  return pattern({
    id,
    difficulties: BAND.all,
    type: "rewrite",
    prompt,
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [bad, good, why] = rng.pick(rows);
      const fill = (text: string) => text.replaceAll("{name}", name);
      return {
        stimulus: fill(bad),
        answer: fill(good),
        explanation: fill(why),
        key: fill(bad),
      };
    },
  });
}

export const commaPatterns: Pattern[] = [
  commaRewrite("comma-list", "Rewrite the sentence with commas where they are needed. Use the Oxford comma.", [
    ["{name} packed pencils a notebook and a calculator.", "{name} packed pencils, a notebook, and a calculator.", "Separate three items in a series, including a comma before and."],
    ["{name} borrowed goggles a beaker and a thermometer.", "{name} borrowed goggles, a beaker, and a thermometer.", "Three items in a series need commas, including the Oxford comma before and."],
    ["The club ordered posters programs and tickets.", "The club ordered posters, programs, and tickets.", "Use commas between items in a series."],
    ["We visited the lab the library and the greenhouse.", "We visited the lab, the library, and the greenhouse.", "Three places in a series need commas."],
    ["{name} studies biology geometry and orchestra.", "{name} studies biology, geometry, and orchestra.", "Three equal items need commas."],
    ["Bring tape scissors and a ruler.", "Bring tape, scissors, and a ruler.", "Use the Oxford comma before the last item."],
    ["The stew contained carrots potatoes and onions.", "The stew contained carrots, potatoes, and onions.", "Commas separate the items in the list."],
    ["{name} invited Omar Lena and Priya.", "{name} invited Omar, Lena, and Priya.", "Commas separate three names. The comma before and is the Oxford comma."],
  ]),
  commaRewrite("comma-intro", "Rewrite the sentence, adding a comma after the introductory element.", [
    ["After the storm the field was muddy.", "After the storm, the field was muddy.", "A comma follows an introductory dependent clause or a long introductory phrase. After the storm is introductory."],
    ["Yes I turned in the form.", "Yes, I turned in the form.", "A comma sets off an introductory yes."],
    ["In the science lab goggles are required.", "In the science lab, goggles are required.", "A comma follows an introductory prepositional phrase."],
    ["When the bell rang the students stood up.", "When the bell rang, the students stood up.", "A comma follows an introductory dependent clause."],
    ["However the graph still needs a source.", "However, the graph still needs a source.", "A comma sets off an introductory conjunctive adverb."],
    ["Running for the bus Maya dropped the folder.", "Running for the bus, Maya dropped the folder.", "A comma follows an introductory participial phrase."],
    ["By the end of the period the solution had cooled.", "By the end of the period, the solution had cooled.", "A comma follows a longer introductory phrase."],
    ["No the samples are not labeled yet.", "No, the samples are not labeled yet.", "A comma sets off an introductory no."],
    ["If the paint is wet leave the mural alone.", "If the paint is wet, leave the mural alone.", "A comma follows an introductory dependent clause."],
    ["Well the second trial looks cleaner.", "Well, the second trial looks cleaner.", "A comma sets off the mild introductory word well."],
  ]),
  commaRewrite("comma-compound", "Rewrite the sentence, adding a comma only if one is needed before the coordinating conjunction.", [
    ["The bell rang and the hallway filled.", "The bell rang, and the hallway filled.", "Use a comma before and when it joins two independent clauses."],
    ["The printer jammed so Maya checked the paper tray.", "The printer jammed, so Maya checked the paper tray.", "So joins two independent clauses and needs a comma before it."],
    ["I studied the map but the trail still confused me.", "I studied the map, but the trail still confused me.", "But joins two independent clauses."],
    ["The lab was closed yet the partners finished the report.", "The lab was closed, yet the partners finished the report.", "Yet joins two independent clauses."],
    ["The paint was wet so nobody touched the mural.", "The paint was wet, so nobody touched the mural.", "A comma belongs before so."],
    ["{name} found the key but the auditorium stayed dark.", "{name} found the key, but the auditorium stayed dark.", "But joins two independent clauses."],
    ["The solo ended and the audience stayed quiet.", "The solo ended, and the audience stayed quiet.", "And joins two independent clauses, so use a comma."],
    ["Bring a pencil or borrow one from the front desk.", "Bring a pencil, or borrow one from the front desk.", "Or joins two commands, which are independent clauses."],
  ]),
  commaRewrite("comma-nonrestrictive", "Rewrite the sentence. Add commas only where they are needed. If none are needed, write correct.", [
    ["{name} who plays first violin missed the bus.", "{name}, who plays first violin, missed the bus.", "The who-clause adds extra information about a person already named, so it is nonrestrictive and needs commas."],
    ["The student who plays first violin missed the bus.", "correct", "The who-clause tells which student, so it is restrictive and takes no commas."],
    ["The Oakdale Times which comes out on Friday printed the photo.", "The Oakdale Times, which comes out on Friday, printed the photo.", "The newspaper is already identified, so the which-clause is extra information."],
    ["The newspaper that printed the photo comes out on Friday.", "correct", "The that-clause tells which newspaper, so no commas are needed."],
    ["My oldest brother who lives in Denver is visiting.", "My oldest brother, who lives in Denver, is visiting.", "Oldest already identifies the brother, so the who-clause is extra information and needs commas."],
    ["Students who finish early may start the bonus set.", "correct", "The who-clause tells which students, so it is restrictive."],
    ["The greenhouse which the club built last spring needs a new latch.", "The greenhouse, which the club built last spring, needs a new latch.", "There is one greenhouse in this context, so the clause is nonrestrictive."],
    ["The beaker that cracked is in the sink.", "correct", "The that-clause identifies which beaker."],
  ]),
  commaRewrite("comma-appositive", "Rewrite the sentence, adding commas around a nonrestrictive appositive. If the sentence needs no comma, write correct.", [
    ["Ms. Alvarez our biology teacher opened the greenhouse.", "Ms. Alvarez, our biology teacher, opened the greenhouse.", "Our biology teacher renames Ms. Alvarez and is extra information, so commas set it off."],
    ["The poet Rita Dove visited the library.", "correct", "Rita Dove identifies which poet, so the appositive is restrictive and takes no commas."],
    ["We met Coach Rahman the new track coach.", "We met Coach Rahman, the new track coach.", "The new track coach renames Coach Rahman."],
    ["My cousin Jordan plays first violin.", "correct", "Jordan identifies which cousin and is a restrictive appositive in this short sentence."],
    ["The tool a digital caliper gives a more exact measurement.", "The tool, a digital caliper, gives a more exact measurement.", "A digital caliper renames the tool and should be set off."],
    ["Everyone congratulated Imani captain of the team.", "Everyone congratulated Imani, captain of the team.", "Captain of the team is a nonrestrictive appositive."],
    ["The river a slow brown ribbon curved past the field.", "The river, a slow brown ribbon, curved past the field.", "The appositive adds a description and needs commas."],
    ["The novel The Giver is on the ninth-grade list.", "correct", "The title identifies which novel, so no commas are used around this restrictive appositive."],
  ]),
  commaRewrite("comma-trap", "Add commas only where they are needed. If the sentence is already correct, write correct.", [
    ["The stack of essays on the desk belongs to {name}.", "correct", "Do not put a comma between a subject and its verb, even when a phrase comes between them."],
    ["{name} carried a small red notebook.", "correct", "Small and red are cumulative adjectives, not a coordinate pair, so no comma belongs between them."],
    ["It was a long tiring rehearsal.", "It was a long, tiring rehearsal.", "Long and tiring are coordinate adjectives. You could say tiring and long, so a comma belongs between them."],
    ["We waited for the bus but missed the curtain.", "correct", "But does not join two independent clauses here. The subject we is shared, so no comma is needed."],
    ["The loud sudden crash stopped the rehearsal.", "The loud, sudden crash stopped the rehearsal.", "Loud and sudden are coordinate adjectives and need a comma."],
    ["{name} bought two new glass beakers.", "correct", "Two, new, and glass are cumulative. They do not take commas."],
    ["After lunch we started the lab.", "After lunch, we started the lab.", "A comma follows the short introductory phrase After lunch."],
    ["The students in the front row have the handouts.", "correct", "No comma belongs between the subject and have."],
  ]),
];

export const semicolonColonPatterns: Pattern[] = [
  choicePattern("semi-colon-choice", BAND.all, "Choose the punctuation that belongs in the blank.", [
    { stimulus: "The trail was steep____ we kept climbing.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "Both sides are independent clauses with no coordinating conjunction, so use a semicolon." },
    { stimulus: "The lab was closed____ therefore, we worked at home.", answer: "semicolon", distractors: ["comma", "colon", "period and a lowercase letter"], explanation: "Use a semicolon before a conjunctive adverb such as therefore when it joins two independent clauses." },
    { stimulus: "Bring the following____ pencils, tape, and scissors.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "Bring the following is a complete sentence introducing a list, so a colon is correct." },
    { stimulus: "The supplies are____ pencils, tape, and scissors.", answer: "no extra mark", distractors: ["colon", "semicolon", "comma"], explanation: "Do not use a colon after a verb that the list completes. The supplies are pencils, tape, and scissors." },
    { stimulus: "She had one goal____ finish the mural before Friday.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "A colon can introduce an explanation after a complete sentence." },
    { stimulus: "The printer jammed____ Maya checked the paper tray.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "These are two independent clauses. A comma alone would be a comma splice." },
    { stimulus: "The partners agreed on one plan____ rerun the trial.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "Rerun the trial is not an independent clause, so a semicolon would be wrong. A colon introduces the plan after a complete sentence." },
    { stimulus: "I need three colors____ blue, gold, and white.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "I need three colors is a complete sentence before the list." },
    { stimulus: "The colors are blue, gold____ and white.", answer: "comma", distractors: ["colon", "semicolon", "no extra mark"], explanation: "This is an ordinary series. The Oxford comma, not a colon, belongs before and." },
    { stimulus: "The caption was missing____ the graph could not be published.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "Two independent clauses need a semicolon, a period, or a comma plus a conjunction." },
    { stimulus: "Please bring____ a pencil, a notebook, and a calculator.", answer: "no extra mark", distractors: ["colon", "semicolon", "comma"], explanation: "Do not put a colon between a verb and the list that completes it." },
    { stimulus: "Maya checked the units____ the mass still looked wrong.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "These are two independent clauses, so a semicolon can join them. A comma alone would be a comma splice." },
    { stimulus: "The rule is simple____ label every sample.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "The colon introduces an explanation of the rule." },
    { stimulus: "We stayed late____ but the backdrop was still damp.", answer: "comma", distractors: ["semicolon", "colon", "no extra mark"], explanation: "Use a comma before but when it joins two independent clauses." },
    { stimulus: "The sky darkened____ however, practice continued.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "However cannot join clauses by itself. Use a semicolon before it." },
    { stimulus: "Only one student remembered a pencil____ Maya.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "The colon introduces the name that explains one student. The first part is a complete sentence." },
    { stimulus: "The partners agreed on a plan____ they would rerun the trial.", answer: "colon", distractors: ["comma", "no extra mark", "question mark"], explanation: "A colon introduces the explanation that follows a complete sentence. A comma alone would create a comma splice." },
    { stimulus: "Label the samples____ before you leave the lab.", answer: "no extra mark", distractors: ["colon", "semicolon", "comma"], explanation: "Before you leave the lab is a dependent clause at the end of a command. No colon or semicolon belongs there." },
    { stimulus: "The bus was late____ rehearsal started without the set.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "A comma alone would create a comma splice." },
    { stimulus: "We packed fruit, bread____ and water.", answer: "comma", distractors: ["colon", "semicolon", "no extra mark"], explanation: "The blank is the Oxford comma in a series." },
    { stimulus: "The director made the decision____ cancel the matinee.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "A colon introduces the decision after a complete sentence." },
    { stimulus: "The roads are closed____ therefore, the matinee is canceled.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "Use a semicolon before the conjunctive adverb therefore. A comma alone would create a comma splice." },
    { stimulus: "The tools include a wrench a hammer and a level.", answer: "This sentence needs commas, not a colon or semicolon.", distractors: ["colon after include", "semicolon after wrench", "colon after tools"], explanation: "Include should not be followed by a colon. The series needs commas: a wrench, a hammer, and a level." },
    { stimulus: "At last the glue dried____ we could hang the backdrop.", answer: "semicolon", distractors: ["comma", "colon", "no extra mark"], explanation: "At last the glue dried is an independent clause, and so is the second part." },
    { stimulus: "Remember this advice____ measure twice.", answer: "colon", distractors: ["semicolon", "comma", "no extra mark"], explanation: "The colon introduces the advice after a complete sentence." },
    { stimulus: "Measure twice____ cut once.", answer: "semicolon", distractors: ["colon", "comma", "no extra mark"], explanation: "These are two short independent clauses. A semicolon joins them. A comma alone would be a splice." },
  ]),
];

export const apostrophePatterns: Pattern[] = [
  choicePattern("apostrophe-possession", BAND.all, "Choose the form that shows possession correctly. Read the hint in parentheses.", [
    { stimulus: "The (student's / students') lockers were all repainted. (More than one student owns them.)", answer: "students'", distractors: ["student's", "students", "student"], explanation: "Students is already plural. Add the apostrophe after the s." },
    { stimulus: "The (student's / students') locker was repainted. (One student owns it.)", answer: "student's", distractors: ["students'", "students", "student"], explanation: "A singular noun takes apostrophe + s." },
    { stimulus: "The (child's / children's) books are due today. (More than one child.)", answer: "children's", distractors: ["child's", "childrens", "childrens'"], explanation: "Children is plural but does not end in s, so add 's." },
    { stimulus: "The (child's / children's) book is due today. (One child.)", answer: "child's", distractors: ["children's", "childs", "childs'"], explanation: "One child takes child's." },
    { stimulus: "The (woman's / women's) choir rehearses at noon. (More than one woman.)", answer: "women's", distractors: ["woman's", "womens", "womens'"], explanation: "Women is a plural that does not end in s." },
    { stimulus: "The (man / man's) coat is on the chair. (One man.)", answer: "man's", distractors: ["man", "mens", "men's"], explanation: "One man takes man's." },
    { stimulus: "Both (player's / players') uniforms are muddy.", answer: "players'", distractors: ["player's", "players", "player"], explanation: "Both tells you the noun is plural: players'." },
    { stimulus: "One (player's / players') uniform is muddy.", answer: "player's", distractors: ["players'", "players", "player"], explanation: "One player takes player's." },
    { stimulus: "The (class's / classes') project won a prize. (One class.)", answer: "class's", distractors: ["classes'", "class'", "classes"], explanation: "The singular noun class takes 's." },
    { stimulus: "The two (class's / classes') projects were displayed.", answer: "classes'", distractors: ["class's", "classes", "class"], explanation: "The plural classes already ends in s, so add an apostrophe after it." },
    { stimulus: "That seat is (yours / your's).", answer: "yours", distractors: ["your's", "yours'", "your"], explanation: "Possessive pronouns such as yours, hers, ours, and theirs never take an apostrophe." },
    { stimulus: "The decision was (theirs / their's).", answer: "theirs", distractors: ["their's", "theirs'", "their"], explanation: "Theirs is a possessive pronoun and takes no apostrophe." },
    { stimulus: "The microscope lost (its / it's) lens cap.", answer: "its", distractors: ["it's", "its'", "it"], explanation: "Its is the possessive pronoun. It's means it is." },
    { stimulus: "(Its / It's) too late to start a new trial.", answer: "It's", distractors: ["Its", "Its'", "It"], explanation: "It's is the contraction of it is." },
    { stimulus: "(Who's / Whose) goggles are on the counter?", answer: "Whose", distractors: ["Who's", "Whos", "Who"], explanation: "Whose is possessive and modifies goggles. Who's means who is." },
    { stimulus: "(Who's / Whose) ready for the cue?", answer: "Who's", distractors: ["Whose", "Whos", "Who"], explanation: "Who's stands for who is." },
    { stimulus: "The (dog's / dogs') bowls are full. (Two dogs.)", answer: "dogs'", distractors: ["dog's", "dogs", "dog"], explanation: "The plural dogs takes an apostrophe after the s." },
    { stimulus: "The (dog's / dogs') bowl is full. (One dog.)", answer: "dog's", distractors: ["dogs'", "dogs", "dog"], explanation: "One dog takes dog's." },
  ]),
  revisionPattern("apostrophe-contraction", BAND.all, "rewrite", "Rewrite the sentence, replacing the underlined words with a contraction.", [
    { stimulus: "They are waiting in the lobby.", answer: "They're waiting in the lobby.", explanation: "They are contracts to they're." },
    { stimulus: "Please do not touch the wet paint.", answer: "Please don't touch the wet paint.", explanation: "Do not contracts to don't." },
    { stimulus: "She cannot find the spare key.", answer: "She can't find the spare key.", explanation: "Cannot contracts to can't." },
    { stimulus: "We will start when the lights warm up.", answer: "We'll start when the lights warm up.", explanation: "We will contracts to we'll." },
    { stimulus: "It is too late to start a new trial.", answer: "It's too late to start a new trial.", explanation: "It is contracts to it's." },
    { stimulus: "You are on the cue after the solo.", answer: "You're on the cue after the solo.", explanation: "You are contracts to you're." },
    { stimulus: "I have finished the graph.", answer: "I've finished the graph.", explanation: "I have contracts to I've." },
    { stimulus: "They will not miss the bus.", answer: "They won't miss the bus.", explanation: "Will not contracts to won't." },
    { stimulus: "Let us begin the warm-up.", answer: "Let's begin the warm-up.", explanation: "Let us contracts to let's." },
    { stimulus: "Who is in charge of the props?", answer: "Who's in charge of the props?", explanation: "Who is contracts to who's." },
    { stimulus: "We are ready for the cue.", answer: "We're ready for the cue.", explanation: "We are contracts to we're." },
    { stimulus: "That is the beaker from yesterday.", answer: "That's the beaker from yesterday.", explanation: "That is contracts to that's." },
  ]),
];

const QUOTE_FRAMES: Array<[string, string, string]> = [
  ["{name} said I finished the lab.", '{name} said, "I finished the lab."', "Use a comma before a quotation that follows a speaker tag, and put the period inside the closing quotation mark."],
  ["I finished the lab {name} said.", '"I finished the lab," {name} said.', "When the tag follows a quoted statement, the period becomes a comma inside the quotation marks."],
  ["Where is the beaker {name} asked.", '"Where is the beaker?" {name} asked.', "A question mark that belongs to the quotation stays inside the quotation marks, and no comma is added."],
  ["{name} asked where is the beaker.", '{name} asked, "Where is the beaker?"', "The tag comes first, so use a comma before the quoted question."],
  ["If we leave now {name} said we can catch the bus.", '"If we leave now," {name} said, "we can catch the bus."', "An interrupted quotation uses commas around the speaker tag. The second part of the quotation is not a new sentence, so we stays lowercase."],
  ["The ending works {name} said but the title does not.", '"The ending works," {name} said, "but the title does not."', "Commas set off the interrupting tag, and the period stays inside the closing quotation mark."],
  ["{name} whispered don't touch the wet paint.", '{name} whispered, "Don\'t touch the wet paint."', "A comma introduces the quotation, and the period belongs inside the quotation marks."],
  ["Stop {name} yelled.", '"Stop!" {name} yelled.', "An exclamation point that belongs to the quotation stays inside, and the tag is not followed by a comma before the closing mark."],
];

const QUOTE_ADVANCED: Array<[string, string, string]> = [
  ["Did {name} say I finished the lab", 'Did {name} say, "I finished the lab"?', "The whole sentence is the question, not the words inside the quotation. The question mark goes outside the closing quotation mark."],
  ["{name} called the result a happy accident.", '{name} called the result a "happy accident."', "A quoted phrase at the end of a statement keeps the period inside the closing quotation mark."],
  ["Who wrote the story The Lottery {name} asked.", 'Who wrote the story "The Lottery"? {name} asked.', "The story title takes quotation marks. The question mark belongs to the whole sentence, so it stays outside the title."],
  ["The article uses the phrase measure twice.", 'The article uses the phrase "measure twice."', "Put a short quoted phrase in quotation marks, with the period inside."],
];

export const quotationPatterns: Pattern[] = [
  pattern({
    id: "quote-basic",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence with correct dialogue punctuation.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [bad, good, why] = rng.pick(QUOTE_FRAMES);
      const fill = (text: string) => text.replaceAll("{name}", name);
      return { stimulus: fill(bad), answer: fill(good), explanation: why, key: `${name}|${bad}` };
    },
  }),
  pattern({
    id: "quote-advanced",
    difficulties: BAND.upper,
    type: "rewrite",
    prompt: "Rewrite the sentence with correct quotation punctuation.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [bad, good, why] = rng.pick(QUOTE_ADVANCED);
      const fill = (text: string) => text.replaceAll("{name}", name);
      return { stimulus: fill(bad), answer: fill(good), explanation: why, key: `${name}|${bad}` };
    },
  }),
];

export const hyphenPatterns: Pattern[] = [
  choicePattern("hyphen-choice", BAND.all, "Choose the sentence that uses the hyphen, dash, or parentheses correctly.", [
    { stimulus: "Which sentence hyphenates the compound modifier correctly?", answer: "We interviewed a well-known author.", distractors: ["We interviewed a well known-author.", "We interviewed a well-known-author.", "We interviewed a well known author in the formal headline."], explanation: "Hyphenate well-known when it comes before the noun author." },
    { stimulus: "Which sentence leaves the compound modifier unhyphenated for a good reason?", answer: "The author we interviewed is well known.", distractors: ["The author we interviewed is well-known.", "The well known author visited.", "The author is well-known in the phrase before a noun."], explanation: "After the noun, well known is not hyphenated. Before a noun, well-known would take a hyphen." },
    { stimulus: "Which sentence is punctuated correctly?", answer: "The result — a cracked beaker — stopped the lab.", distractors: ["The result-a cracked beaker-stopped the lab.", "The result, a cracked beaker stopped the lab.", "The result a cracked beaker stopped the lab."], explanation: "Em dashes set off a sharp interruption. Hyphens are too small for that break, and one comma is not enough." },
    { stimulus: "Which sentence uses parentheses for a quiet aside?", answer: "The samples (all six of them) belong in the cabinet.", distractors: ["The samples -all six of them- belong in the cabinet.", "The samples all six of them belong in the cabinet.", "The samples, all six of them belong in the cabinet."], explanation: "Parentheses mark a quiet aside. The commas would also be possible around an appositive, but this item asks for parentheses, and the broken comma version is missing the second comma." },
    { stimulus: "Which compound modifier is correct?", answer: "a tenth-grade project", distractors: ["a tenth grade-project", "a tenth-grade-project", "a grade-tenth project"], explanation: "Hyphenate the compound modifier tenth-grade before the noun project." },
    { stimulus: "Which sentence is correct?", answer: "The project is for the tenth grade.", distractors: ["The project is for the tenth-grade.", "The project is tenth-grade for.", "The tenth-grade is project."], explanation: "Do not hyphenate tenth grade when grade is a noun rather than part of a modifier before another noun." },
    { stimulus: "Which sentence uses the dash correctly?", answer: "Maya finally found it — the missing key.", distractors: ["Maya finally found it- the missing key.", "Maya finally found it, — the missing key.", "Maya finally found it the missing key."], explanation: "An em dash introduces a dramatic explanation. Do not combine it with a comma." },
    { stimulus: "Which sentence is correct?", answer: "The up-to-date roster is on the door.", distractors: ["The up to date-roster is on the door.", "The up-to-date-roster is on the door.", "The up to-date roster is on the door."], explanation: "Hyphenate the whole compound modifier up-to-date before the noun." },
    { stimulus: "Which sentence is correct?", answer: "Please keep the roster up to date.", distractors: ["Please keep the roster up-to-date.", "Please keep the up-to date roster.", "Please keep-the roster up to date."], explanation: "Up to date needs no hyphens when it follows the noun." },
    { stimulus: "Which sentence is correct?", answer: "The self-correcting quiz gives instant feedback.", distractors: ["The self correcting-quiz gives instant feedback.", "The self-correcting-quiz gives instant feedback.", "The self correcting quiz-gives instant feedback."], explanation: "Hyphenate self-correcting before the noun quiz." },
    { stimulus: "Which sentence is correct?", answer: "A twenty-minute warm-up is enough.", distractors: ["A twenty minute-warm-up is enough.", "A twenty-minute-warm-up is enough.", "A twentyminute warm-up is enough."], explanation: "Hyphenate the number-plus-noun modifier twenty-minute. Warm-up is a compound noun." },
    { stimulus: "Which sentence is correct?", answer: "The warm-up lasts twenty minutes.", distractors: ["The warm-up lasts twenty-minutes.", "The warm up lasts twenty-minutes.", "The warm-up-lasts twenty minutes."], explanation: "Twenty minutes is not a modifier before a noun, so do not hyphenate it." },
    { stimulus: "Which sentence is correct?", answer: "The decision — if we can call it that — surprised everyone.", distractors: ["The decision (if we can call it that — surprised everyone.", "The decision — if we can call it that, surprised everyone.", "The decision if we can call it that surprised everyone."], explanation: "Use a pair of em dashes, not a mix of dash and comma or parenthesis." },
    { stimulus: "Which sentence is correct?", answer: "Three students (Maya, Luis, and Priya) stayed to clean up.", distractors: ["Three students (Maya, Luis, and Priya stayed to clean up.", "Three students Maya, Luis, and Priya) stayed to clean up.", "Three students — Maya, Luis, and Priya) stayed to clean up."], explanation: "Parentheses must come in a pair." },
    { stimulus: "Which sentence is correct?", answer: "We need a well-lighted path to the gym.", distractors: ["We need a well lighted-path to the gym.", "We need a well-lighted-path to the gym.", "We need a lighted-well path to the gym."], explanation: "Well-lighted is a compound modifier before path." },
    { stimulus: "Which sentence is correct?", answer: "The path to the gym is well lighted.", distractors: ["The path to the gym is well-lighted.", "The path to the gym is well-lighted-path.", "The well lighted is the path."], explanation: "No hyphen is needed after the noun. Some style guides hyphenate well-lighted in both positions; this worksheet follows the rule that the hyphen is required before the noun." },
    { stimulus: "Which break is the sharpest and most emphatic?", answer: "The ending — and only the ending — needs to be cut.", distractors: ["The ending, and only the ending, needs to be cut.", "The ending (and only the ending) needs to be cut.", "The ending and only the ending needs to be cut."], explanation: "All three marked versions can be grammatical, but the em dashes create the sharpest break. The item asks for the most emphatic option." },
    { stimulus: "Which aside is the quietest?", answer: "The ending (see page 4) needs a source.", distractors: ["The ending — see page 4 — needs a source.", "The ending, see page 4, needs a source.", "The ending: see page 4 needs a source."], explanation: "Parentheses are the quietest way to add a brief aside. The comma version is not a complete interruption." },
    { stimulus: "Which sentence is correct?", answer: "A first-year student led the tour.", distractors: ["A first year-student led the tour.", "A first-year-student led the tour.", "A year-first student led the tour."], explanation: "Hyphenate first-year before student." },
    { stimulus: "Which sentence is correct?", answer: "She is in her first year.", distractors: ["She is in her first-year.", "She is in her first-year student.", "She is-in her first year."], explanation: "First year is not hyphenated when year is the noun." },
    { stimulus: "Which sentence is correct?", answer: "The long-term plan is posted.", distractors: ["The long term-plan is posted.", "The long-term-plan is posted.", "The term-long plan is posted."], explanation: "Hyphenate long-term before plan." },
    { stimulus: "Which sentence is correct?", answer: "We discussed the plan over the long term.", distractors: ["We discussed the plan over the long-term.", "We discussed the long-term over plan.", "We discussed-the plan over the long term."], explanation: "No hyphen is needed when long term follows the preposition and is not placed before a noun." },
    { stimulus: "Which sentence is correct?", answer: "The editor made a last-minute change.", distractors: ["The editor made a last minute-change.", "The editor made a last-minute-change.", "The editor made a minute-last change."], explanation: "Hyphenate last-minute before change." },
    { stimulus: "Which sentence is correct?", answer: "The change was made at the last minute.", distractors: ["The change was made at the last-minute.", "The change was made-at the last minute.", "The last-minute was the change."], explanation: "Last minute is not hyphenated in the phrase at the last minute." },
    { stimulus: "Which sentence is correct?", answer: "Old-fashioned manners still matter in a thank-you note.", distractors: ["Old fashioned-manners still matter in a thank you-note.", "Old-fashioned-manners still matter.", "Thank-you manners are old fashioned-notes."], explanation: "Hyphenate old-fashioned before manners and thank-you before note." },
    { stimulus: "Which sentence is correct?", answer: "The ex-president of the club introduced the speaker.", distractors: ["The expresident of the club introduced the speaker.", "The ex president of the club introduced the speaker.", "The president-ex of the club introduced the speaker."], explanation: "The prefix ex- meaning former is hyphenated." },
  ]),
];

const TITLES: Array<[string, string, string]> = [
  ["We read The Giver last month.", "We read *The Giver* last month.", "Book titles are italicized. Underline them when you are handwriting."],
  ["The class is discussing Of Mice and Men.", "The class is discussing *Of Mice and Men*.", "The title of a book is italicized."],
  ["Hidden Figures is the film we watched in history.", "Hidden Figures is the film we watched in history.".replace("Hidden Figures", "*Hidden Figures*"), "Film titles are italicized."],
  ["Her letter was printed in The New York Times.", "Her letter was printed in *The New York Times*.", "Newspaper titles are italicized."],
  ["I borrowed a copy of National Geographic.", "I borrowed a copy of *National Geographic*.", "Magazine titles are italicized."],
  ["The choir listened to Abbey Road.", "The choir listened to *Abbey Road*.", "Album titles are italicized."],
  ["Our class read Hamlet aloud.", "Our class read *Hamlet* aloud.", "Play titles are italicized."],
  ["The Outsiders is on the eighth-grade list.", "The Outsiders is on the eighth-grade list.".replace("The Outsiders", "*The Outsiders*"), "A book title is italicized even when it looks like a plural noun."],
  ["Her favorite poem is The Road Not Taken.", 'Her favorite poem is "The Road Not Taken."', "Poem titles go in quotation marks. The period belongs inside the closing quotation mark."],
  ["We discussed the story The Tell-Tale Heart.", 'We discussed the story "The Tell-Tale Heart."', "Short-story titles go in quotation marks."],
  ["The article City Council Votes needs a stronger lead.", 'The article "City Council Votes" needs a stronger lead.', "Article titles go in quotation marks."],
  ["Please read the chapter The River before Friday.", 'Please read the chapter "The River" before Friday.', "Chapter titles go in quotation marks."],
  ["The episode The Empty House is the one to watch.", 'The episode "The Empty House" is the one to watch.', "Episode titles of a series go in quotation marks. The series title itself would be italicized."],
  ["Her song Landslide closed the concert.", 'Her song "Landslide" closed the concert.', "Song titles go in quotation marks."],
  ["The poem Oranges fits this unit.", 'The poem "Oranges" fits this unit.', "A poem title takes quotation marks."],
  ["Have you read the story Thank You, M'am?", 'Have you read the story "Thank You, M\'am"?', "The story title takes quotation marks. The question mark belongs to the whole sentence, so it stays outside the closing quotation mark."],
  ["The book The Giver contains the chapter The Ceremony.", 'The book *The Giver* contains the chapter "The Ceremony."', "Italicize the book and put quotation marks around the chapter. The period goes inside the closing quotation mark."],
  ["We compared the poem The Road Not Taken with the film Dead Poets Society.", 'We compared the poem "The Road Not Taken" with the film *Dead Poets Society*.', "The poem takes quotation marks, and the film title is italicized."],
  ["The newspaper headline sat above an article called Budget Vote Delayed.", 'The newspaper headline sat above an article called "Budget Vote Delayed."', "Article titles go in quotation marks, and the period belongs inside the closing mark."],
  ["Please review the short story Harrison Bergeron.", 'Please review the short story "Harrison Bergeron."', "Short-story titles go in quotation marks."],
  ["The play A Raisin in the Sun is this semester's production.", "The play *A Raisin in the Sun* is this semester's production.", "Play titles are italicized."],
  ["We analyzed the speech I Have a Dream.", 'We analyzed the speech "I Have a Dream."', "The title of a speech is placed in quotation marks."],
  ["The podcast episode City in the Rain is worth the time.", 'The podcast episode "City in the Rain" is worth the time.', "Episode titles go in quotation marks."],
  ["Her essay quotes the poem Still I Rise.", 'Her essay quotes the poem "Still I Rise."', "Poem titles go in quotation marks."],
  ["The film The Breadwinner is on reserve at the library.", "The film *The Breadwinner* is on reserve at the library.", "Film titles are italicized."],
  ["Read the chapter Nightfall before the quiz.", 'Read the chapter "Nightfall" before the quiz.', "Chapter titles go in quotation marks."],
];

export const titlePatterns: Pattern[] = [
  pattern({
    id: "titles-punctuate",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence, punctuating the title correctly. Use *asterisks* to show italics.",
    lines: 2,
    build: (rng) => {
      const [stimulus, answer, explanation] = rng.pick(TITLES);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
];
