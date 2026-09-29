import { NAMES } from "./names";
import { BAND, choicePattern, pattern, revisionPattern, type Pattern } from "./engine";
import type { Difficulty } from "../types";

const dev: Difficulty[] = ["developing"];
const prof: Difficulty[] = ["proficient"];
const adv: Difficulty[] = ["advanced"];
const all = [...dev, ...prof, ...adv];
const upper = [...prof, ...adv];

type WordItem = {
  levels: Difficulty[];
  stimulus: string;
  answer: string;
  distractors: string[];
  explanation: string;
};

function word(
  levels: Difficulty[],
  stimulus: string,
  answer: string,
  distractors: string[],
  explanation: string,
): WordItem {
  return { levels, stimulus, answer, distractors, explanation };
}

const WORDS: WordItem[] = [
  word(all, "The rain will ____ our plans for the field trip.", "affect", ["effect"], "Affect is the verb meaning to influence. Effect is usually a noun meaning result."),
  word(all, "The ____ of the new rule was immediate.", "effect", ["affect"], "Effect is the noun meaning result."),
  word(all, "Staying up late can ____ your score on the quiz.", "affect", ["effect"], "Affect is the verb."),
  word(all, "One ____ of practice is a steadier bow arm.", "effect", ["affect"], "Effect is the noun."),
  word(all, "The microscope lost ____ lens cap.", "its", ["it's"], "Its is the possessive pronoun. It's means it is."),
  word(all, "____ too late to start a new trial.", "It's", ["Its"], "It's means it is."),
  word(all, "The tree dropped ____ leaves.", "its", ["it's"], "Its shows possession."),
  word(all, "____ going to rain before the match.", "It's", ["Its"], "It's means it is."),
  word(all, "The students left ____ posters in the hall.", "their", ["there", "they're"], "Their shows possession."),
  word(all, "____ is a quiet room beside the library.", "There", ["Their", "They're"], "There points to a place or introduces the sentence."),
  word(all, "____ waiting for the late bus.", "They're", ["Their", "There"], "They're means they are."),
  word(all, "Put the beakers ____ on the cart.", "there", ["their", "they're"], "There means in that place."),
  word(all, "____ project is due Friday.", "Your", ["You're"], "Your is possessive."),
  word(all, "____ on the cue after the solo.", "You're", ["Your"], "You're means you are."),
  word(all, "Is this ____ folder?", "your", ["you're"], "Your is possessive."),
  word(all, "____ the first group to present.", "You're", ["Your"], "You're means you are."),
  word(all, "We need ____ more beakers, not one.", "two", ["to", "too"], "Two is the number."),
  word(all, "This soup is ____ salty.", "too", ["to", "two"], "Too means excessively."),
  word(all, "Walk ____ the greenhouse after class.", "to", ["too", "two"], "To introduces the phrase."),
  word(all, "Maya wants to go, ____.", "too", ["to", "two"], "Too means also."),
  word(all, "Finish the graph, and ____ write the caption.", "then", ["than"], "Then shows time order."),
  word(all, "This draft is clearer ____ the first one.", "than", ["then"], "Than is used in comparisons."),
  word(all, "We rehearsed, and ____ we set the cues.", "then", ["than"], "Then means next."),
  word(all, "A ruler is longer ____ a pencil.", "than", ["then"], "Than completes the comparison."),
  word(upper, "Please ____ the award on behalf of the club.", "accept", ["except"], "Accept means to receive. Except means excluding."),
  word(upper, "Everyone ____ Maya has a pass.", "except", ["accept"], "Except means excluding."),
  word(upper, "The director will ____ no late entries.", "accept", ["except"], "Accept means to receive or allow."),
  word(upper, "The lab is open every day ____ Sunday.", "except", ["accept"], "Except means other than."),
  word(upper, "____ students joined the choir this year.", "Fewer", ["Less"], "Fewer is for countable nouns such as students."),
  word(upper, "There is ____ time than we expected.", "less", ["fewer"], "Less is for noncount nouns such as time."),
  word(upper, "We have ____ beakers than yesterday.", "fewer", ["less"], "Beakers can be counted, so use fewer."),
  word(upper, "The new pump uses ____ water.", "less", ["fewer"], "Water is noncount here, so use less."),
  word(upper, "The choice is ____ the two endings.", "between", ["among"], "Between is for two."),
  word(upper, "Share the copies ____ the four partners.", "among", ["between"], "Among is for three or more."),
  word(upper, "Stand ____ Maya and Luis.", "between", ["among"], "Between is for two people."),
  word(upper, "The rumor spread ____ the cast.", "among", ["between"], "The cast is a group of more than two."),
  word(upper, "The ____ of the school signed the form.", "principal", ["principle"], "Principal is the person who leads a school. Principle is a rule."),
  word(upper, "Fairness is the guiding ____.", "principle", ["principal"], "Principle means a basic rule or belief."),
  word(upper, "The ____ reason for the delay was the weather.", "principal", ["principle"], "Principal can mean main or most important."),
  word(upper, "We memorized the ____ of conservation of mass.", "principle", ["principal"], "A scientific rule is a principle."),
  word(upper, "____ goggles are on the counter?", "Whose", ["Who's"], "Whose is possessive."),
  word(upper, "____ ready for the cue?", "Who's", ["Whose"], "Who's means who is."),
  word(upper, "Don't ____ the lens cap.", "lose", ["loose"], "Lose means to misplace. Loose means not tight."),
  word(upper, "The latch is too ____.", "loose", ["lose"], "Loose means not firmly fastened."),
  word(adv, "Yesterday I ____ on the couch for an hour.", "lay", ["laid", "lie"], "The past tense of lie, meaning to recline, is lay."),
  word(adv, "Yesterday I ____ the book on the desk.", "laid", ["lay", "lain"], "The past tense of lay, meaning to put something down, is laid."),
  word(adv, "Please ____ the posters on the table.", "lay", ["lie", "laid"], "Lay means to put something down. It needs an object, posters."),
  word(adv, "The dust has ____ on the backdrop for a week.", "lain", ["laid", "lay"], "Lain is the past participle of lie, meaning to recline."),
  word(adv, "The ending ____ that the narrator is unreliable.", "implies", ["infers"], "A text implies. A reader infers."),
  word(adv, "From the ending, we ____ that the narrator is unreliable.", "infer", ["imply"], "Readers infer a conclusion from evidence."),
  word(adv, "The poem makes an ____ to the myth of Icarus.", "allusion", ["illusion"], "An allusion is an indirect reference. An illusion is a false appearance."),
  word(adv, "The mirror created an ____ of a longer hallway.", "illusion", ["allusion"], "An illusion is something that appears real but is not."),
  word(adv, "The survey was designed to ____ honest answers.", "elicit", ["illicit"], "Elicit means to draw out. Illicit means illegal."),
  word(adv, "The film depicts an ____ market.", "illicit", ["elicit"], "Illicit means forbidden by law."),
  word(adv, "Please be ____ about the surprise rehearsal.", "discreet", ["discrete"], "Discreet means tactful. Discrete means separate."),
  word(adv, "The data fall into three ____ groups.", "discrete", ["discreet"], "Discrete means individually separate."),
  word(adv, "An ____ storm warning scrolled across the screen.", "imminent", ["eminent"], "Imminent means about to happen."),
  word(adv, "The ____ biologist visited the lab.", "eminent", ["imminent"], "Eminent means distinguished."),
  word(adv, "____ the article in your bibliography.", "Cite", ["Site", "Sight"], "Cite means to quote or credit a source."),
  word(adv, "The dig ____ is closed to visitors.", "site", ["cite", "sight"], "A site is a place."),
  word(adv, "The mural was a welcome ____.", "sight", ["site", "cite"], "Sight means something seen."),
  word(adv, "A short introduction should ____ the results.", "precede", ["proceed"], "Precede means to come before."),
  word(adv, "After the warning, we may ____ with the trial.", "proceed", ["precede"], "Proceed means to go forward."),
  word(adv, "The compliment was a nice ____ to her speech.", "complement", ["compliment"], "A complement completes something. A compliment is praise."),
  word(adv, "She received a sincere ____ after the solo.", "compliment", ["complement"], "A compliment is an expression of praise."),
  word(adv, "The library is ____ down the hall.", "farther", ["further"], "Farther refers to physical distance."),
  word(adv, "We need ____ evidence before we publish.", "further", ["farther"], "Further refers to additional degree or amount, not distance."),
  word(adv, "The state ____ meets on Thursday.", "capitol", ["capital"], "Capitol is the building where a legislature meets."),
  word(adv, "Begin the sentence with a ____ letter.", "capital", ["capitol"], "Capital describes an uppercase letter."),
  word(adv, "Save room for ____.", "dessert", ["desert"], "Dessert is the sweet course."),
  word(adv, "The class crossed a model of the ____.", "desert", ["dessert"], "A desert is dry land."),
  word(all, "____ did you ask for help?", "Whom", ["Who"], "Whom is the object of ask. You is the subject."),
  word(all, "____ left the lights on?", "Who", ["Whom"], "Who is the subject of left."),
  word(upper, "The advice will ____ that the units are consistent.", "ensure", ["insure", "assure"], "Ensure means to make certain. Insure refers to insurance. Assure means to tell someone confidently."),
  word(upper, "I can ____ you that the samples are labeled.", "assure", ["ensure", "insure"], "Assure means to give a person confidence."),
  word(adv, "Please ____ the cast before the audition.", "counsel", ["council"], "Counsel means to advise. A council is a group of people."),
  word(adv, "The student ____ meets on Thursday.", "council", ["counsel"], "A council is a group that meets. Counsel means advice or to advise."),
];

export const confusedWordPatterns: Pattern[] = [
  pattern({
    id: "confused-words",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Choose the word that correctly completes the sentence.",
    build: (rng, difficulty) => {
      const pool = WORDS.filter((item) => item.levels.includes(difficulty));
      const item = rng.pick(pool);
      return {
        stimulus: item.stimulus,
        answer: item.answer,
        distractors: item.distractors,
        explanation: item.explanation,
        key: `${item.stimulus}|${item.answer}`,
      };
    },
  }),
];

export const doubleNegativePatterns: Pattern[] = [
  pattern({
    id: "double-negative",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence so it has only one negative and keeps the same meaning.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const rows = [
        [`${name} doesn't have no pencil.`, `${name} doesn't have a pencil.`, "Doesn't is already negative, so use a instead of no."],
        [`${name} didn't see nobody in the lab.`, `${name} didn't see anybody in the lab.`, "Didn't is negative, so use anybody instead of nobody."],
        [`${name} can't find no goggles.`, `${name} can't find any goggles.`, "Can't is negative, so use any instead of no."],
        [`${name} hasn't never missed a cue.`, `${name} hasn't ever missed a cue.`, "Hasn't is negative, so use ever instead of never."],
        [`${name} won't ask nobody for help.`, `${name} won't ask anybody for help.`, "Won't is negative, so use anybody."],
        [`${name} didn't do nothing wrong.`, `${name} didn't do anything wrong.`, "Didn't is negative, so use anything."],
        ["There isn't no time left.", "There isn't any time left.", "Isn't is negative, so use any."],
        ["The choir couldn't hardly hear the cue.", "The choir could hardly hear the cue.", "Hardly already has a negative meaning, so drop couldn't."],
        [`${name} can't scarcely read the label.`, `${name} can scarcely read the label.`, "Scarcely should not be paired with can't."],
        ["We weren't barely ready.", "We were barely ready.", "Barely should not be paired with a second negative."],
        [`${name} doesn't want nothing from the concession stand.`, `${name} doesn't want anything from the concession stand.`, "Doesn't is negative, so use anything."],
        ["There wasn't nobody at the bus stop.", "There wasn't anybody at the bus stop.", "Wasn't is negative, so use anybody."],
        [`${name} hasn't got no pass.`, `${name} hasn't got a pass.`, "Hasn't is negative, so use a instead of no."],
        ["I can't hardly see the cue from this seat.", "I can hardly see the cue from this seat.", "Use hardly without can't."],
        [`${name} didn't tell nobody the score.`, `${name} didn't tell anybody the score.`, "Didn't is negative, so use anybody."],
        ["The latch won't never stay closed.", "The latch won't ever stay closed.", "Won't is negative, so use ever."],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
];

const COMPARE: Array<[string, string, string, string]> = [
  ["Of the two labs, this one is ____.", "brighter", "brightest", "Two things call for the comparative brighter."],
  ["Of the three labs, this one is ____.", "brightest", "brighter", "Three or more call for the superlative brightest."],
  ["This solo is ____ than the first one.", "longer", "longest", "Than signals a comparison of two, so use the comparative longer."],
  ["This is the ____ solo in the concert.", "longest", "longer", "The concert contains more than two solos, so use the superlative."],
  ["Of the two drafts, this thesis is ____.", "clearer", "clearest", "Two drafts call for the comparative."],
  ["Of all the drafts, this thesis is the ____.", "clearest", "clearer", "All the drafts means more than two, so use the superlative."],
  ["This ending is ____ than the earlier one.", "better", "best", "Better is the comparative form of good. It compares two endings."],
  ["This is the ____ ending in the set.", "best", "better", "Best is the superlative form of good."],
  ["Yesterday's rehearsal was ____ than today's.", "worse", "worst", "Worse is the comparative form of bad."],
  ["That was the ____ rehearsal of the week.", "worst", "worse", "Worst is the superlative form of bad."],
  ["The ridge trail is ____ than the creek trail.", "farther", "farthest", "Two trails call for the comparative farther."],
  ["The ridge trail is the ____ of the four routes.", "farthest", "farther", "Four routes call for the superlative farthest."],
  ["Maya has ____ errors than Luis.", "fewer", "fewest", "Two writers call for the comparative fewer."],
  ["Maya has the ____ errors in the class.", "fewest", "fewer", "A whole class is more than two, so use fewest."],
  ["This problem is ____ than the last one.", "harder", "hardest", "Than compares two problems."],
  ["This is the ____ problem on the page.", "hardest", "harder", "The page has more than two problems."],
  ["Of the two paints, this one is ____.", "redder", "reddest", "Two paints call for the comparative."],
  ["Of the five paints, this one is the ____.", "reddest", "redder", "Five items call for the superlative."],
];

export const comparativePatterns: Pattern[] = [
  pattern({
    id: "compare-choice",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Choose the comparative or superlative form that fits.",
    build: (rng) => {
      const [stimulus, answer, wrong, why] = rng.pick(COMPARE);
      return { stimulus, answer, distractors: [wrong], explanation: why, key: stimulus };
    },
  }),
  revisionPattern("compare-double", BAND.all, "rewrite", "Rewrite the sentence so the comparison is grammatical.", [
    { stimulus: "This draft is more better than the last one.", answer: "This draft is better than the last one.", explanation: "Better is already comparative. Do not add more." },
    { stimulus: "She is the most tallest player on the team.", answer: "She is the tallest player on the team.", explanation: "Tallest is already superlative. Do not add most." },
    { stimulus: "This trail is more steeper than the other one.", answer: "This trail is steeper than the other one.", explanation: "Steeper is already the comparative form." },
    { stimulus: "Of the two solos, this one is the best.", answer: "Of the two solos, this one is better.", explanation: "Use the comparative, better, when exactly two things are compared." },
    { stimulus: "Of the three solos, this one is better.", answer: "Of the three solos, this one is the best.", explanation: "Use the superlative, best, when more than two things are compared." },
    { stimulus: "He is more happier today.", answer: "He is happier today.", explanation: "Happier is already comparative." },
    { stimulus: "That was her most worst performance.", answer: "That was her worst performance.", explanation: "Worst is already superlative." },
    { stimulus: "This beaker is more fuller than that one.", answer: "This beaker is fuller than that one.", explanation: "Fuller is the comparative. Do not add more." },
    { stimulus: "She is the most carefulest editor in the room.", answer: "She is the most careful editor in the room.", explanation: "Careful forms its superlative with most, not with both most and -est." },
    { stimulus: "Of the two plans, this one is the easiest.", answer: "Of the two plans, this one is easier.", explanation: "Two plans call for the comparative easier." },
    { stimulus: "This solution is less clearer than the first.", answer: "This solution is less clear than the first.", explanation: "Less already makes the comparison. Use the positive form clear." },
    { stimulus: "The ridge is the most farthest point on the map.", answer: "The ridge is the farthest point on the map.", explanation: "Farthest is already superlative." },
  ]),
];

const CAPS: Array<[string, string, string]> = [
  ["we visited the lincoln memorial in april.", "We visited the Lincoln Memorial in April.", "Capitalize the first word, the proper noun Lincoln Memorial, and the month April."],
  ["my aunt rosa lives in denver.", "My aunt Rosa lives in Denver.", "Capitalize the first word, the name Rosa, and the city Denver. Do not capitalize aunt when it is not used as a title directly before the name... Actually Aunt Rosa as a name is capitalized when aunt replaces a name. Here 'my aunt Rosa' capitalizes Rosa only in many style guides, but school worksheets often capitalize Aunt when it is part of the name. Use: My Aunt Rosa lives in Denver."],
  ["the science club meets on tuesday.", "The science club meets on Tuesday.", "Capitalize the first word and the day Tuesday. Do not capitalize science when it is a general subject."],
  ["i am taking biology 2 and spanish.", "I am taking Biology 2 and Spanish.", "Capitalize I, the course title Biology 2, and the language Spanish. A numbered course title is capitalized."],
  ["we drove south toward the mississippi river.", "We drove south toward the Mississippi River.", "Do not capitalize south when it is a direction. Capitalize the proper noun Mississippi River."],
  ["she read about the civil war in history class.", "She read about the Civil War in history class.", "Capitalize the historical name Civil War. Do not capitalize the general subject history."],
  ["principal singh announced the spring concert.", "Principal Singh announced the spring concert.", "Capitalize a title directly before a name. Do not capitalize the season spring."],
  ["the principal announced a concert in the spring.", "The principal announced a concert in the spring.", "Do not capitalize principal when it is not used before a name, and do not capitalize the season."],
  ["on memorial day we visited a museum.", "On Memorial Day we visited a museum.", "Capitalize the holiday Memorial Day."],
  ["maya said, \"the beaker cracked.\"", "Maya said, \"The beaker cracked.\"", "Capitalize a name and the first word of a quoted sentence."],
  ["the book the giver is in room 12.", "The book The Giver is in room 12.", "Capitalize the first word and the main words of the book title."],
  ["students from lincoln middle school toured the capitol.", "Students from Lincoln Middle School toured the capitol.", "Capitalize the proper noun Lincoln Middle School. Capitol, the building, is not in this sentence; capitol as a common noun for a building type stays lowercase only if it is not the proper name. This sentence uses capitol as a common noun."],
  ["dear members of the club:", "Dear Members of the Club:", "In a greeting, capitalize the first word and the main words."],
  ["yours truly,", "Yours truly,", "Capitalize the first word of a closing. Do not capitalize truly."],
  ["the rocky mountains are west of here.", "The Rocky Mountains are west of here.", "Capitalize the proper noun Rocky Mountains. Do not capitalize west as a direction."],
  ["we studied jupiter on monday.", "We studied Jupiter on Monday.", "Capitalize the planet and the day."],
  ["coach rahman posted the roster.", "Coach Rahman posted the roster.", "Capitalize the title and the name."],
  ["the coach posted the roster.", "The coach posted the roster.", "Do not capitalize coach when no name follows it."],
  ["our family celebrates thanksgiving in november.", "Our family celebrates Thanksgiving in November.", "Capitalize the holiday and the month."],
  ["i asked, \"where is the spare key?\"", "I asked, \"Where is the spare key?\"", "Capitalize I and the first word of the quoted question."],
  ["the nile river flows north.", "The Nile River flows north.", "Capitalize the proper noun. Do not capitalize the direction north."],
  ["she is taking english, algebra, and art.", "She is taking English, algebra, and art.", "Capitalize the language English. Do not capitalize general subjects such as algebra and art."],
  ["last winter we visited new orleans.", "Last winter we visited New Orleans.", "Capitalize the city. Do not capitalize the season winter."],
  ["the declaration of independence was signed in philadelphia.", "The Declaration of Independence was signed in Philadelphia.", "Capitalize the document and the city."],
  ["please rsvp to ms. alvarez by friday.", "Please RSVP to Ms. Alvarez by Friday.", "Capitalize the abbreviation RSVP, the title Ms., the name, and the day."],
  ["a buddhist temple stands near the park.", "A Buddhist temple stands near the park.", "Capitalize the adjective formed from a religion."],
  ["we hiked in the west for a week.", "We hiked in the West for a week.", "Capitalize West when it names a region rather than a direction."],
  ["turn west at the library.", "Turn west at the library.", "Do not capitalize west when it is a direction. Capitalize the first word."],
];

export const capitalizationPatterns: Pattern[] = [
  revisionPattern(
    "capitalization",
    BAND.all,
    "rewrite",
    "Rewrite the sentence with correct capitalization.",
    CAPS.filter((item) => !item[2].includes("Actually") && !item[2].includes("This sentence uses capitol")).map(
      ([stimulus, answer, explanation]) => ({ stimulus, answer, explanation }),
    ),
  ),
  revisionPattern("capitalization-clean", BAND.all, "rewrite", "Rewrite the sentence with correct capitalization.", [
    { stimulus: "my aunt rosa lives in denver.", answer: "My Aunt Rosa lives in Denver.", explanation: "Capitalize the first word, Aunt when it is part of the name Aunt Rosa, and the city Denver." },
    { stimulus: "students from lincoln middle school toured the state capitol.", answer: "Students from Lincoln Middle School toured the state capitol.", explanation: "Capitalize the school name. The word capitol stays lowercase here because state capitol is not the proper name of one building in this sentence; if a specific building such as the U.S. Capitol were named, it would be capitalized." },
    { stimulus: "the bill of rights protects basic freedoms.", answer: "The Bill of Rights protects basic freedoms.", explanation: "Capitalize the name of the document." },
    { stimulus: "we read about ramadan in world history.", answer: "We read about Ramadan in world history.", explanation: "Capitalize the name of the holiday or observance. Do not capitalize the general subject world history." },
    { stimulus: "senator diaz spoke on labor day.", answer: "Senator Diaz spoke on Labor Day.", explanation: "Capitalize the title before a name and the holiday." },
    { stimulus: "the senator spoke on a holiday.", answer: "The senator spoke on a holiday.", explanation: "Do not capitalize senator when no name follows it." },
    { stimulus: "our address is 14 oak street.", answer: "Our address is 14 Oak Street.", explanation: "Capitalize the parts of a street name." },
    { stimulus: "i love the month of june.", answer: "I love the month of June.", explanation: "Capitalize I and the month." },
  ]),
];

export const numberPatterns: Pattern[] = [
  pattern({
    id: "numbers-small",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence using the classroom number rules.",
    lines: 1,
    build: (rng) => {
      const rows = [
        ["We need 5 volunteers.", "We need five volunteers.", "Spell out numbers from one through nine."],
        ["There are 3 beakers on the cart.", "There are three beakers on the cart.", "Spell out numbers from one through nine."],
        ["The scene has 8 chairs.", "The scene has eight chairs.", "Spell out eight."],
        ["Bring 2 posters.", "Bring two posters.", "Spell out two."],
        ["We saved 9 folders.", "We saved nine folders.", "Spell out nine."],
        ["The lab has 4 sinks.", "The lab has four sinks.", "Spell out four."],
        ["Order 6 samples.", "Order six samples.", "Spell out six."],
        ["There are 7 maps in the drawer.", "There are seven maps in the drawer.", "Spell out seven."],
        ["There are fifteen beakers on the cart.", "There are 15 beakers on the cart.", "Use numerals for 10 and above."],
        ["The club admitted twelve students.", "The club admitted 12 students.", "Use a numeral for 12 when it does not begin the sentence."],
        ["The choir ordered twenty-five programs.", "The choir ordered 25 programs.", "Use numerals for 10 and above."],
        ["We collected forty cans.", "We collected 40 cans.", "Use a numeral for 40."],
        ["12 students joined the club.", "Twelve students joined the club.", "Spell out a number that begins a sentence."],
        ["15 beakers cracked during the move.", "Fifteen beakers cracked during the move.", "Spell out a number that begins a sentence."],
        ["8 chairs belong in the scene shop.", "Eight chairs belong in the scene shop.", "Spell out a number that begins a sentence, even when it is below ten."],
        ["Meet us at three p.m.", "Meet us at 3:00 p.m.", "Use numerals for times with a.m. or p.m."],
        ["The bus leaves at seven a.m.", "The bus leaves at 7:00 a.m.", "Use a numeral with a.m."],
        ["Rehearsal ends at 4 p.m.", "Rehearsal ends at 4:00 p.m.", "Include minutes when you write a time with p.m."],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
  revisionPattern("numbers-abbrev", BAND.all, "rewrite", "Rewrite the sentence so the abbreviations fit formal prose.", [
    { stimulus: "Dr Sanchez will visit rm. 204.", answer: "Dr. Sanchez will visit room 204.", explanation: "Use a period in Dr. Spell out room in formal prose." },
    { stimulus: "The mtg. is in the library.", answer: "The meeting is in the library.", explanation: "Spell out meeting in formal prose." },
    { stimulus: "Ms Alvarez posted the hw.", answer: "Ms. Alvarez posted the homework.", explanation: "Use a period in Ms. and spell out homework." },
    { stimulus: "We need info. about the bus.", answer: "We need information about the bus.", explanation: "Spell out information." },
    { stimulus: "The approx. length is 12 cm.", answer: "The approximate length is 12 cm.", explanation: "Spell out approximate in formal prose. A unit abbreviation such as cm may stay." },
    { stimulus: "Gov Diaz signed the bill.", answer: "Gov. Diaz signed the bill.", explanation: "Use a period in the title abbreviation Gov." },
    { stimulus: "The U.S is sending a delegate.", answer: "The U.S. is sending a delegate.", explanation: "The abbreviation U.S. takes periods." },
    { stimulus: "Pls return the beakers asap.", answer: "Please return the beakers as soon as possible.", explanation: "Spell out texting abbreviations in formal prose." },
    { stimulus: "Prof Kim teaches the lab.", answer: "Prof. Kim teaches the lab.", explanation: "Use a period in the title abbreviation Prof." },
    { stimulus: "The dept. meeting is at noon.", answer: "The department meeting is at noon.", explanation: "Spell out department in formal prose." },
    { stimulus: "We live on Oak St.", answer: "We live on Oak Street.", explanation: "Spell out Street in formal prose." },
    { stimulus: "Jan. is the snowiest month here.", answer: "January is the snowiest month here.", explanation: "Spell out a month when it is not followed by a date." },
  ]),
];

const FORMAL: Array<[string, string, string]> = [
  ["The experiment was a total fail because the kids messed up the measurements.", "The experiment failed because the students recorded the measurements incorrectly.", "Formal writing avoids slang such as total fail and messed up and names the error precisely."],
  ["A lot of kids think the ending is super confusing.", "Many readers find the ending confusing.", "Replace vague, casual wording with a more precise claim."],
  ["The author is kinda saying that memory is unreliable.", "The author suggests that memory is unreliable.", "Kinda saying is too casual for academic writing."],
  ["This source is awesome because it has tons of data.", "This source is useful because it includes extensive data.", "Avoid slang such as awesome and tons of."],
  ["We gotta rerun the trial or the results are gonna be wrong.", "We must rerun the trial, or the results will be inaccurate.", "Gotta and gonna are informal."],
  ["The graph is okay, but the caption is sort of vague.", "The graph is adequate, but the caption is vague.", "Okay and sort of weaken a formal claim."],
  ["In this day and age, kids are always on their phones.", "Students frequently use their phones.", "Replace the cliché and the casual label kids."],
  ["Due to the fact that the bus was late, rehearsal started late.", "Because the bus was late, rehearsal started late.", "Because is more direct than due to the fact that."],
  ["The character is totally obsessed with the river.", "The character is preoccupied with the river.", "Totally obsessed is more casual than the claim needs to be."],
  ["I think the theme is basically freedom.", "The theme is freedom.", "In a formal claim, I think and basically can often be cut."],
  ["The lab got messed up when somebody didn't label stuff.", "The lab procedure failed because the samples were not labeled.", "Name the problem instead of using messed up and stuff."],
  ["This quote really pops because it shows the kid's fear.", "This quotation is effective because it shows the child's fear.", "Pops and kid are informal."],
  ["The results were pretty bad, so we did the experiment over.", "The results were inconclusive, so we repeated the experiment.", "Pretty bad and did over are less precise than inconclusive and repeated."],
  ["At the end of the day, the author wants us to care about the town.", "Ultimately, the author asks readers to care about the town.", "Replace the cliché at the end of the day."],
  ["The article talks about how pollution is a big deal.", "The article explains why pollution is a serious problem.", "Talks about and a big deal are informal."],
  ["You shouldn't just ignore the counterargument.", "Writers should not ignore the counterargument.", "You is conversational here. A formal sentence can address writers in the third person."],
];

export const registerPatterns: Pattern[] = [
  pattern({
    id: "register-rewrite",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence in a formal academic register. Keep the meaning.",
    lines: 2,
    build: (rng) => {
      const [stimulus, answer, explanation] = rng.pick(FORMAL);
      return {
        stimulus,
        answer,
        explanation: `${explanation} Answers may vary; the key shows one strong revision.`,
        key: stimulus,
      };
    },
  }),
  choicePattern("register-choice", BAND.all, "Which wording is the most formal?", [
    { stimulus: "Choose the most formal way to describe a failed experiment.", answer: "The experiment failed.", distractors: ["The experiment was a total fail.", "The experiment got messed up.", "The experiment was kind of a bust."], explanation: "Failed is direct and formal. The other choices use slang." },
    { stimulus: "Choose the most formal subject.", answer: "the students", distractors: ["the kids", "the guys", "a bunch of people"], explanation: "Students is the appropriate formal noun." },
    { stimulus: "Choose the most formal verb phrase.", answer: "suggests", distractors: ["kinda says", "is basically like", "goes on about"], explanation: "Suggests is precise. The other options are conversational." },
    { stimulus: "Choose the most formal transition.", answer: "because", distractors: ["due to the fact that", "on account of the fact that", "seeing as how"], explanation: "Because is concise and formal." },
    { stimulus: "Choose the most formal evaluation.", answer: "The evidence is insufficient.", distractors: ["The evidence is pretty weak.", "The evidence is not that great.", "The evidence is meh."], explanation: "Insufficient is a formal, precise judgment." },
    { stimulus: "Choose the most formal request.", answer: "Please submit the draft by Friday.", distractors: ["Can you get me the draft by Friday?", "I need that draft ASAP.", "Drop the draft off whenever."], explanation: "The formal request is polite, specific, and free of texting abbreviations." },
    { stimulus: "Choose the most formal claim.", answer: "The narrator is unreliable.", distractors: ["The narrator is super shady.", "The narrator is kind of a liar.", "You can't trust this guy."], explanation: "Unreliable is the literary term and does not rely on slang or you." },
    { stimulus: "Choose the most formal phrase for additional research.", answer: "further research", distractors: ["a lot more digging", "extra stuff to look up", "tons more research"], explanation: "Further research is the standard academic phrase." },
    { stimulus: "Choose the most formal way to cite disagreement.", answer: "Some readers may disagree.", distractors: ["Lots of people won't buy this.", "Not everyone is gonna agree.", "You might think this is wrong."], explanation: "Some readers may disagree is measured and formal." },
    { stimulus: "Choose the most formal closing.", answer: "The evidence supports the claim.", distractors: ["So yeah, the evidence proves it.", "The evidence totally backs this up.", "That's basically the proof."], explanation: "Supports the claim is formal. Proves would also be stronger than the evidence usually allows; supports is the careful choice." },
    { stimulus: "Choose the most formal word for children in a news report.", answer: "children", distractors: ["kids", "kiddos", "little guys"], explanation: "Children is the formal noun." },
    { stimulus: "Choose the most formal revision of gonna.", answer: "will", distractors: ["gonna", "going to" , "about to kinda"], explanation: "Will is the most formal of the choices. Going to is acceptable in semiformal prose, but will is more compact and academic." },
  ]),
];
