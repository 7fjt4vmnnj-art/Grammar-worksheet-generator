import { NAMES } from "./names";
import {
  BAND,
  choicePattern,
  pattern,
  revisionPattern,
  type Pattern,
} from "./engine";

function agree(
  id: string,
  difficulties: Pattern["difficulties"],
  rows: Array<{ subject: string; singular: string; plural: string; rest: string; answer: "singular" | "plural"; why: string }>,
): Pattern {
  return pattern({
    id,
    difficulties,
    type: "fill-in",
    prompt: "Choose the verb in parentheses that agrees with the subject.",
    build: (rng) => {
      const row = rng.pick(rows);
      const answer = row.answer === "singular" ? row.singular : row.plural;
      return {
        stimulus: `${row.subject} (${row.singular} / ${row.plural}) ${row.rest}.`,
        answer,
        explanation: row.why,
        key: `${id}|${row.subject}|${row.rest}`,
      };
    },
  });
}

const basicPeople: Array<{ subject: string; singular: string; plural: string; rest: string; answer: "singular" | "plural"; why: string }> =
  [
    ["Maya", "s"],
    ["The student", "s"],
    ["My cousin", "s"],
    ["The librarian", "s"],
    ["The soloist", "s"],
    ["Noah", "s"],
    ["The sophomores", "p"],
    ["The artists", "p"],
    ["The players", "p"],
    ["The editors", "p"],
    ["The volunteers", "p"],
    ["The drummers", "p"],
  ].flatMap(([subject, number]) => {
    const verbs = [
      ["writes", "write", "in a journal every evening"],
      ["walks", "walk", "across the courtyard before lunch"],
      ["has", "have", "a question about the lab"],
      ["is", "are", "ready for rehearsal"],
      ["does", "do", "the warm-up quietly"],
      ["needs", "need", "more time on the essay"],
      ["practices", "practice", "the solo after school"],
      ["arrives", "arrive", "before the first bell"],
      ["carries", "carry", "the backdrop to the stage"],
      ["opens", "open", "the greenhouse before class"],
      ["finishes", "finish", "the warm-up early"],
      ["keeps", "keep", "a spare key in the drawer"],
      ["studies", "study", "the map before the hike"],
      ["returns", "return", "the camera after school"],
    ] as const;
    return verbs.map(([singular, plural, rest]) => ({
      subject,
      singular,
      plural,
      rest,
      answer: number === "s" ? ("singular" as const) : ("plural" as const),
      why:
        number === "s"
          ? `${subject} is singular, so the verb is ${singular}.`
          : `${subject} is plural, so the verb is ${plural}.`,
    }));
  });

export const subjectVerbPatterns: Pattern[] = [
  agree("sva-basic", BAND.all, basicPeople),
  agree("sva-intervening", BAND.all, [
    { subject: "The stack of old newspapers", singular: "sits", plural: "sit", rest: "beside the recycling bin", answer: "singular", why: "The subject is the singular noun stack. Of old newspapers is a prepositional phrase and does not change the verb." },
    { subject: "The bouquet of yellow roses", singular: "is", plural: "are", rest: "on the front table", answer: "singular", why: "The subject is bouquet, which is singular. Of yellow roses is a prepositional phrase." },
    { subject: "The teachers in the science wing", singular: "has", plural: "have", rest: "a meeting after school", answer: "plural", why: "The subject is the plural noun teachers. In the science wing is an intervening phrase." },
    { subject: "The boxes under the stairs", singular: "belongs", plural: "belong", rest: "to the drama club", answer: "plural", why: "The subject is boxes, which is plural." },
    { subject: "The sound of the trumpets", singular: "fills", plural: "fill", rest: "the auditorium", answer: "singular", why: "The subject is the singular noun sound." },
    { subject: "The captain, as well as the coaches,", singular: "expects", plural: "expect", rest: "a full practice", answer: "singular", why: "Phrases beginning with as well as do not create a compound subject. The subject is the singular noun captain." },
    { subject: "The murals on the west wall", singular: "needs", plural: "need", rest: "a fresh coat of sealant", answer: "plural", why: "The subject is the plural noun murals." },
    { subject: "One of the violins", singular: "is", plural: "are", rest: "out of tune", answer: "singular", why: "The subject is the singular pronoun one. Of the violins is a prepositional phrase." },
    { subject: "The pair of scissors", singular: "is", plural: "are", rest: "in the top drawer", answer: "singular", why: "The subject is the singular noun pair." },
    { subject: "The students in the front row", singular: "has", plural: "have", rest: "the handouts", answer: "plural", why: "The subject is the plural noun students." },
    { subject: "The book of poems", singular: "belongs", plural: "belong", rest: "to the library", answer: "singular", why: "The subject is the singular noun book." },
    { subject: "The lights above the stage", singular: "needs", plural: "need", rest: "a new gel", answer: "plural", why: "The subject is the plural noun lights." },
    { subject: "The director, together with the cast,", singular: "is", plural: "are", rest: "waiting in the wings", answer: "singular", why: "Together with does not make the subject plural. Director is singular." },
    { subject: "The results of the experiment", singular: "is", plural: "are", rest: "posted on the board", answer: "plural", why: "The subject is the plural noun results." },
    { subject: "The stack of programs", singular: "is", plural: "are", rest: "on the ticket table", answer: "singular", why: "The subject is the singular noun stack. Of programs is a prepositional phrase." },
    { subject: "The box of tickets", singular: "belongs", plural: "belong", rest: "in the office", answer: "singular", why: "The subject is the singular noun box." },
    { subject: "The list of names", singular: "includes", plural: "include", rest: "every understudy", answer: "singular", why: "The subject is the singular noun list." },
    { subject: "The row of chairs", singular: "blocks", plural: "block", rest: "the aisle", answer: "singular", why: "The subject is the singular noun row." },
    { subject: "The students in the back row", singular: "has", plural: "have", rest: "the extra scripts", answer: "plural", why: "The subject is the plural noun students." },
    { subject: "The pile of folders", singular: "needs", plural: "need", rest: "a rubber band", answer: "singular", why: "The subject is the singular noun pile." },
    { subject: "The set of drums", singular: "is", plural: "are", rest: "still in the truck", answer: "singular", why: "The subject is the singular noun set." },
    { subject: "The lines of the poem", singular: "is", plural: "are", rest: "on the board", answer: "plural", why: "The subject is the plural noun lines." },
    { subject: "The coach, along with the managers,", singular: "arrives", plural: "arrive", rest: "before warm-ups", answer: "singular", why: "Along with does not create a compound subject. Coach is singular." },
    { subject: "The editor, as well as the photographers,", singular: "wants", plural: "want", rest: "a later deadline", answer: "singular", why: "As well as does not make editor plural." },
  ]),
  agree("sva-indefinite", BAND.all, [
    { subject: "Everyone in the choir", singular: "is", plural: "are", rest: "on the risers", answer: "singular", why: "Everyone is a singular indefinite pronoun." },
    { subject: "Each of the swimmers", singular: "has", plural: "have", rest: "a lane assignment", answer: "singular", why: "Each is singular. Of the swimmers is a prepositional phrase." },
    { subject: "Neither of the answers", singular: "is", plural: "are", rest: "fully correct", answer: "singular", why: "Neither is singular." },
    { subject: "Somebody in the lab", singular: "needs", plural: "need", rest: "a new beaker", answer: "singular", why: "Somebody is singular." },
    { subject: "Nobody on the bus", singular: "wants", plural: "want", rest: "to miss the curtain", answer: "singular", why: "Nobody is singular." },
    { subject: "Both of the experiments", singular: "is", plural: "are", rest: "ready to present", answer: "plural", why: "Both is a plural indefinite pronoun." },
    { subject: "Many of the essays", singular: "needs", plural: "need", rest: "a clearer thesis", answer: "plural", why: "Many is plural." },
    { subject: "Several of the posters", singular: "has", plural: "have", rest: "a spelling error", answer: "plural", why: "Several is plural." },
    { subject: "Few of the tickets", singular: "remains", plural: "remain", rest: "for Friday's show", answer: "plural", why: "Few is plural." },
    { subject: "Everything in the cabinet", singular: "belongs", plural: "belong", rest: "to the science department", answer: "singular", why: "Everything is singular." },
    { subject: "Everybody in the cast", singular: "knows", plural: "know", rest: "the new cue", answer: "singular", why: "Everybody is singular." },
    { subject: "Either of the endings", singular: "works", plural: "work", rest: "for this scene", answer: "singular", why: "Either is singular." },
    { subject: "Anyone in the lobby", singular: "needs", plural: "need", rest: "a pass", answer: "singular", why: "Anyone is a singular indefinite pronoun." },
    { subject: "No one on the committee", singular: "wants", plural: "want", rest: "to delay the vote", answer: "singular", why: "No one is singular." },
    { subject: "Nothing in the drawer", singular: "matches", plural: "match", rest: "the missing key", answer: "singular", why: "Nothing is singular." },
    { subject: "Something in the oven", singular: "smells", plural: "smell", rest: "burnt", answer: "singular", why: "Something is singular." },
    { subject: "Each of the tickets", singular: "has", plural: "have", rest: "a seat number", answer: "singular", why: "Each is singular. Of the tickets is a prepositional phrase." },
    { subject: "One of the maps", singular: "shows", plural: "show", rest: "the creek trail", answer: "singular", why: "One is singular." },
    { subject: "Both of the buses", singular: "is", plural: "are", rest: "ready to load", answer: "plural", why: "Both is plural." },
    { subject: "Many of the samples", singular: "needs", plural: "need", rest: "a second label", answer: "plural", why: "Many is plural." },
    { subject: "Others in the cast", singular: "has", plural: "have", rest: "already left", answer: "plural", why: "Others is plural." },
    { subject: "All of the posters", singular: "is", plural: "are", rest: "dry", answer: "plural", why: "Posters is plural, so all is plural." },
    { subject: "None of the glue", singular: "is", plural: "are", rest: "left in the bottle", answer: "singular", why: "Glue is noncount, so none is singular here." },
  ]),
  agree("sva-compound-and", BAND.all, [
    { subject: "Maya and Luis", singular: "is", plural: "are", rest: "presenting the project", answer: "plural", why: "Two subjects joined by and usually take a plural verb." },
    { subject: "The director and the editor", singular: "has", plural: "have", rest: "a question about the schedule", answer: "plural", why: "Subjects joined by and take a plural verb here." },
    { subject: "The violin and the cello", singular: "is", plural: "are", rest: "out of tune", answer: "plural", why: "Two instruments joined by and take a plural verb." },
    { subject: "Priya and the stage manager", singular: "was", plural: "were", rest: "early to rehearsal", answer: "plural", why: "Compound subjects joined by and are plural." },
    { subject: "The poster and the program", singular: "needs", plural: "need", rest: "a final proofreading", answer: "plural", why: "Two things joined by and take a plural verb." },
    { subject: "Omar and Hana", singular: "walks", plural: "walk", rest: "to school together", answer: "plural", why: "Omar and Hana is a compound subject, so the verb is plural." },
    { subject: "The beaker and the thermometer", singular: "belongs", plural: "belong", rest: "in the acid cabinet", answer: "plural", why: "Subjects joined by and take a plural verb." },
    { subject: "The coach and the captain", singular: "expects", plural: "expect", rest: "a full practice", answer: "plural", why: "Two people joined by and take a plural verb." },
  ]),
  agree("sva-or-nor", BAND.upper, [
    { subject: "Neither the coach nor the players", singular: "is", plural: "are", rest: "late", answer: "plural", why: "With neither/nor, the verb agrees with the nearer subject. Players is plural." },
    { subject: "Neither the players nor the coach", singular: "is", plural: "are", rest: "late", answer: "singular", why: "With neither/nor, the verb agrees with the nearer subject. Coach is singular." },
    { subject: "Either the lamp or the candles", singular: "is", plural: "are", rest: "bright enough", answer: "plural", why: "With either/or, the verb agrees with the nearer subject. Candles is plural." },
    { subject: "Either the candles or the lamp", singular: "is", plural: "are", rest: "bright enough", answer: "singular", why: "The nearer subject, lamp, is singular." },
    { subject: "Neither the soloist nor the dancers", singular: "wants", plural: "want", rest: "to skip the finale", answer: "plural", why: "The nearer subject, dancers, is plural." },
    { subject: "Neither the dancers nor the soloist", singular: "wants", plural: "want", rest: "to skip the finale", answer: "singular", why: "The nearer subject, soloist, is singular." },
    { subject: "Either the editor or the reporters", singular: "has", plural: "have", rest: "the password", answer: "plural", why: "The nearer subject, reporters, is plural." },
    { subject: "Either the reporters or the editor", singular: "has", plural: "have", rest: "the password", answer: "singular", why: "The nearer subject, editor, is singular." },
    { subject: "Neither the map nor the signs", singular: "is", plural: "are", rest: "helpful here", answer: "plural", why: "The nearer subject, signs, is plural." },
    { subject: "Neither the signs nor the map", singular: "is", plural: "are", rest: "helpful here", answer: "singular", why: "The nearer subject, map, is singular." },
  ]),
  agree("sva-there", BAND.all, [
    { subject: "There", singular: "is", plural: "are", rest: "a crack in the beaker", answer: "singular", why: "The subject follows the verb. Crack is singular." },
    { subject: "There", singular: "is", plural: "are", rest: "three reasons to revise the ending", answer: "plural", why: "The subject is the plural noun reasons." },
    { subject: "There", singular: "is", plural: "are", rest: "a nest under the bleachers", answer: "singular", why: "The subject is the singular noun nest." },
    { subject: "There", singular: "is", plural: "are", rest: "two stamps missing from the envelope", answer: "plural", why: "The subject is the plural noun stamps." },
    { subject: "There", singular: "is", plural: "are", rest: "a problem with the projector", answer: "singular", why: "The subject is the singular noun problem." },
    { subject: "There", singular: "is", plural: "are", rest: "several students waiting in the hall", answer: "plural", why: "The subject is the plural noun students." },
    { subject: "There", singular: "is", plural: "are", rest: "a quiet room beside the library", answer: "singular", why: "The subject is the singular noun room." },
    { subject: "There", singular: "is", plural: "are", rest: "five names on the roster", answer: "plural", why: "The subject is the plural noun names." },
  ]),
  agree("sva-collective", BAND.upper, [
    { subject: "The committee", singular: "meets", plural: "meet", rest: "on Tuesday", answer: "singular", why: "The committee is acting as one unit, so American English uses a singular verb." },
    { subject: "The team", singular: "is", plural: "are", rest: "traveling by bus", answer: "singular", why: "The team is acting as one unit, so the verb is singular." },
    { subject: "The family", singular: "has", plural: "have", rest: "a reunion in June", answer: "singular", why: "The family is acting as one group, so the verb is singular." },
    { subject: "The jury", singular: "has", plural: "have", rest: "reached a verdict", answer: "singular", why: "A verdict is a single group action, so jury takes a singular verb." },
    { subject: "The class", singular: "is", plural: "are", rest: "presenting one project", answer: "singular", why: "The class is acting as one unit." },
    { subject: "The audience", singular: "was", plural: "were", rest: "silent at the end", answer: "singular", why: "The audience reacted as one group, so the verb is singular." },
    { subject: "The flock", singular: "is", plural: "are", rest: "heading south", answer: "singular", why: "The flock is moving as one unit." },
    { subject: "The orchestra", singular: "tunes", plural: "tune", rest: "for ten minutes", answer: "singular", why: "The orchestra is treated as one unit." },
  ]),
  choicePattern("sva-special", BAND.adv, "Choose the verb that agrees with the subject.", [
    { stimulus: "Ten dollars (is / are) too much for that snack.", answer: "is", distractors: ["are"], explanation: "An amount of money is treated as one total, so the verb is singular." },
    { stimulus: "Three hours (seems / seem) long for a rehearsal.", answer: "seems", distractors: ["seem"], explanation: "A period of time taken as one amount is singular." },
    { stimulus: "The news (spreads / spread) quickly in the hallway.", answer: "spreads", distractors: ["spread"], explanation: "News is a singular noun." },
    { stimulus: "Mathematics (is / are) offered every term.", answer: "is", distractors: ["are"], explanation: "Mathematics, like many subject names ending in s, is singular." },
    { stimulus: "The scissors (is / are) in the top drawer.", answer: "are", distractors: ["is"], explanation: "Scissors is a plural noun and takes a plural verb." },
    { stimulus: "These pants (needs / need) a patch.", answer: "need", distractors: ["needs"], explanation: "Pants is plural." },
    { stimulus: "The number of volunteers (is / are) higher this year.", answer: "is", distractors: ["are"], explanation: "The number is singular. A number of would be plural." },
    { stimulus: "A number of volunteers (is / are) waiting outside.", answer: "are", distractors: ["is"], explanation: "A number of means several, so the verb is plural." },
    { stimulus: "The United States (is / are) sending a delegate.", answer: "is", distractors: ["are"], explanation: "The name of one country is singular." },
    { stimulus: "*The Outsiders* (is / are) on the reading list.", answer: "is", distractors: ["are"], explanation: "A title is singular even when a word inside the title is plural." },
    { stimulus: "Macaroni and cheese (is / are) on the menu.", answer: "is", distractors: ["are"], explanation: "Macaroni and cheese names one dish, so the verb is singular." },
    { stimulus: "Peanut butter and jelly (is / are) the only sandwich left.", answer: "is", distractors: ["are"], explanation: "The two parts form one item, so the verb is singular." },
    { stimulus: "All of the pie (is / are) gone.", answer: "is", distractors: ["are"], explanation: "Pie is singular here, so all is singular." },
    { stimulus: "All of the pies (is / are) gone.", answer: "are", distractors: ["is"], explanation: "Pies is plural, so all is plural." },
    { stimulus: "Some of the water (is / are) still cold.", answer: "is", distractors: ["are"], explanation: "Water is noncount, so some is singular." },
    { stimulus: "Some of the beakers (is / are) still dirty.", answer: "are", distractors: ["is"], explanation: "Beakers is plural, so some is plural." },
    { stimulus: "Under the desk (is / are) the missing stamp.", answer: "is", distractors: ["are"], explanation: "The subject is the singular noun stamp, which comes after the verb." },
    { stimulus: "Under the desk (is / are) the missing stamps.", answer: "are", distractors: ["is"], explanation: "The subject is the plural noun stamps." },
    { stimulus: "Across the hall (stands / stand) the old clock.", answer: "stands", distractors: ["stand"], explanation: "The subject is the singular noun clock." },
    { stimulus: "Across the hall (stands / stand) the old clocks.", answer: "stand", distractors: ["stands"], explanation: "The subject is the plural noun clocks." },
  ]),
  revisionPattern(
    "sva-edit",
    BAND.all,
    "edit",
    "Rewrite the passage so every verb agrees with its subject.",
    [
      { stimulus: "Yesterday the club meet in room 12. Nobody were ready to start. The stack of sheet music were still in the office.", answer: "Yesterday the club met in room 12. Nobody was ready to start. The stack of sheet music was still in the office.", explanation: "Club is singular and needs the past-tense verb met. Nobody is singular and takes was. Stack is singular and takes was." },
      { stimulus: "Each of the posters have a typo. The editor, as well as the writers, are checking them now.", answer: "Each of the posters has a typo. The editor, as well as the writers, is checking them now.", explanation: "Each is singular. As well as does not make editor plural." },
      { stimulus: "There is three reasons to revise. The results of the trial is incomplete.", answer: "There are three reasons to revise. The results of the trial are incomplete.", explanation: "The subject reasons is plural, and the subject results is plural." },
      { stimulus: "Neither the map nor the compass are in the pack. Everybody have a different theory.", answer: "Neither the map nor the compass is in the pack. Everybody has a different theory.", explanation: "The nearer subject compass is singular. Everybody is singular." },
      { stimulus: "The team are traveling at noon, and both of the buses is full.", answer: "The team is traveling at noon, and both of the buses are full.", explanation: "Team is one unit, so it is singular. Both is plural." },
      { stimulus: "Mathematics are first period. A number of students arrives late when the bus do.", answer: "Mathematics is first period. A number of students arrive late when the bus does.", explanation: "Mathematics is singular. A number of is plural. Bus is singular." },
      { stimulus: "The pair of goggles are missing. One of the drawers have the spare pair.", answer: "The pair of goggles is missing. One of the drawers has the spare pair.", explanation: "Pair and one are the singular subjects. The prepositional phrases do not change the verbs." },
      { stimulus: "Ten dollars are due, and the news about the trip are alarming.", answer: "Ten dollars is due, and the news about the trip is alarming.", explanation: "An amount of money is singular. News is a singular noun, so the verb is is." },
    ],
    4,
  ),
];

export const antecedentPatterns: Pattern[] = [
  choicePattern(
    "antecedent-choice",
    BAND.all,
    "Choose the pronoun that agrees with its antecedent.",
    [
      { stimulus: "The dogs wagged ____ tails when the door opened.", answer: "their", distractors: ["its", "his", "her"], explanation: "Dogs is plural, so the possessive pronoun is their." },
      { stimulus: "The girl left ____ keys in the art room.", answer: "her", distractors: ["his", "their", "its"], explanation: "Girl is a singular noun, so the pronoun is her." },
      { stimulus: "The boy left ____ keys in the art room.", answer: "his", distractors: ["her", "their", "its"], explanation: "Boy is a singular noun, so the pronoun is his." },
      { stimulus: "Lena and Omar forgot ____ tickets on the counter.", answer: "their", distractors: ["her", "his", "its"], explanation: "Two people together form a plural antecedent, so use their." },
      { stimulus: "Each of the books has ____ own index.", answer: "its", distractors: ["their", "his", "her"], explanation: "Each is singular, and the books are things, so the pronoun is its." },
      { stimulus: "The players celebrated ____ victory.", answer: "their", distractors: ["its", "his", "her"], explanation: "Players is plural." },
      { stimulus: "The magazine printed ____ correction on page 4.", answer: "its", distractors: ["their", "his", "her"], explanation: "Magazine is singular." },
      { stimulus: "The sisters forgot ____ lines.", answer: "their", distractors: ["her", "its", "his"], explanation: "Sisters is plural." },
      { stimulus: "The uncle brought ____ camera.", answer: "his", distractors: ["their", "her", "its"], explanation: "Uncle is singular." },
      { stimulus: "The aunts brought ____ cameras.", answer: "their", distractors: ["her", "his", "its"], explanation: "Aunts is plural." },
      { stimulus: "The tree lost ____ leaves in the wind.", answer: "its", distractors: ["their", "his", "her"], explanation: "Tree is singular." },
      { stimulus: "The trees lost ____ leaves in the wind.", answer: "their", distractors: ["its", "his", "her"], explanation: "Trees is plural." },
      { stimulus: "Every beaker should be returned to ____ shelf.", answer: "its", distractors: ["their", "his", "her"], explanation: "Every beaker is singular." },
      { stimulus: "Both of the sisters forgot ____ lines.", answer: "their", distractors: ["her", "its", "his"], explanation: "Both is plural." },
      { stimulus: "The hen led ____ chicks across the path.", answer: "her", distractors: ["his", "its", "their"], explanation: "Hen is a singular noun, so use her." },
      { stimulus: "If the visitors enter the lab, ____ must wear goggles.", answer: "they", distractors: ["you", "he", "it"], explanation: "Visitors is third-person plural, so the pronoun is they. You would shift to second person." },
      { stimulus: "The kittens followed ____ mother across the path.", answer: "their", distractors: ["its", "her", "his"], explanation: "Kittens is plural, so the pronoun is their." },
      { stimulus: "The microscope lost ____ lens cap.", answer: "its", distractors: ["it's", "their", "his"], explanation: "Microscope is singular, so the possessive pronoun is its, with no apostrophe." },
    ],
  ),
  pattern({
    id: "antecedent-rewrite",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence so the pronoun agrees with its antecedent.",
    lines: 2,
    build: (rng) => {
      const rows = [
        ["The dogs wagged its tails when the door opened.", "The dogs wagged their tails when the door opened.", "Dogs is plural, so use their."],
        ["The girl left his keys in the art room.", "The girl left her keys in the art room.", "Girl takes the singular pronoun her."],
        ["The boy left her keys in the art room.", "The boy left his keys in the art room.", "Boy takes the singular pronoun his."],
        ["Lena and Omar forgot her tickets.", "Lena and Omar forgot their tickets.", "The compound antecedent is plural."],
        ["Each of the books has their own index.", "Each of the books has its own index.", "Each is singular, so use its."],
        ["The players celebrated its victory.", "The players celebrated their victory.", "Players is plural."],
        ["The magazine printed their correction on page 4.", "The magazine printed its correction on page 4.", "Magazine is singular."],
        ["When students enter the lab, you must wear goggles.", "When students enter the lab, they must wear goggles.", "Students is third person. You shifts the person; they agrees with students."],
        ["If a visitor wants a pass, you should ask at the desk.", "If a visitor wants a pass, the visitor should ask at the desk.", "The sentence begins in third person. Repeating the visitor keeps the person consistent without choosing a gendered pronoun."],
        ["The sisters forgot its lines.", "The sisters forgot their lines.", "Sisters is plural."],
        ["Every beaker should be returned to their shelf.", "Every beaker should be returned to its shelf.", "Every beaker is singular."],
        ["The tree lost their leaves in the wind.", "The tree lost its leaves in the wind.", "Tree is singular."],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
];

export const casePatterns: Pattern[] = [
  pattern({
    id: "case-i-me",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Choose the pronoun case that the sentence requires.",
    build: (rng) => {
      const name = rng.pick(NAMES);
      const frames = [
        { stimulus: `${name} and ____ finished the model.`, answer: "I", wrong: "me", why: `The pronoun is part of the subject of finished, so use the subjective case I.` },
        { stimulus: `${name} and ____ were early to rehearsal.`, answer: "I", wrong: "me", why: "The pronoun is part of the subject of were, so use I." },
        { stimulus: `____ and ${name} designed the poster.`, answer: "I", wrong: "me", why: "The pronoun is a subject, so use I." },
        { stimulus: `The teacher called ${name} and ____ to the board.`, answer: "me", wrong: "I", why: "The pronoun is a direct object of called, so use the objective case me." },
        { stimulus: `The note was addressed to ${name} and ____.`, answer: "me", wrong: "I", why: "The pronoun is the object of the preposition to, so use me." },
        { stimulus: `Please stand between ${name} and ____.`, answer: "me", wrong: "I", why: "Between is a preposition, so its object is me." },
        { stimulus: `The award surprised ${name} and ____.`, answer: "me", wrong: "I", why: "The pronoun is a direct object of surprised, so use me." },
        { stimulus: `Everyone except ${name} and ____ finished on time.`, answer: "me", wrong: "I", why: "Except is a preposition here, so use the object form me." },
        { stimulus: `The director saved seats for ${name} and ____.`, answer: "me", wrong: "I", why: "For is a preposition, so use me." },
        { stimulus: `${name} and ____ have the only key.`, answer: "I", wrong: "me", why: "The pronoun is part of the subject of have, so use I." },
      ];
      const frame = rng.pick(frames);
      return {
        stimulus: frame.stimulus,
        answer: frame.answer,
        distractors: [frame.wrong, frame.answer === "I" ? "myself" : "mine"],
        explanation: frame.why,
        key: `${frame.stimulus}|${frame.answer}`,
      };
    },
  }),
  choicePattern("case-who", BAND.upper, "Choose the pronoun that fits the grammar of the sentence.", [
    { stimulus: "____ wrote this note?", answer: "Who", distractors: ["Whom", "Whose", "Who's"], explanation: "Who is the subject of wrote." },
    { stimulus: "____ did you call last night?", answer: "Whom", distractors: ["Who", "Whose", "Whoever"], explanation: "Whom is the direct object of call. You is the subject." },
    { stimulus: "To ____ should I address the letter?", answer: "whom", distractors: ["who", "whose", "whoever"], explanation: "Whom is the object of the preposition to." },
    { stimulus: "The soloist ____ missed the cue was nervous.", answer: "who", distractors: ["whom", "whose", "which"], explanation: "Who is the subject of missed." },
    { stimulus: "The soloist ____ the director praised was nervous.", answer: "whom", distractors: ["who", "whose", "which"], explanation: "Whom is the direct object of praised. The director is the subject." },
    { stimulus: "____ do you think will win the match?", answer: "Who", distractors: ["Whom", "Whose", "Whomever"], explanation: "Who is the subject of will win. The words do you think interrupt the clause and do not make who an object." },
    { stimulus: "____ do you think the judges chose?", answer: "Whom", distractors: ["Who", "Whose", "Whoever"], explanation: "Whom is the direct object of chose. The judges is the subject of that verb." },
    { stimulus: "The student with ____ I studied is absent.", answer: "whom", distractors: ["who", "whose", "which"], explanation: "Whom is the object of the preposition with." },
    { stimulus: "We never learned ____ left the lights on.", answer: "who", distractors: ["whom", "whose", "which"], explanation: "Who is the subject of left inside the noun clause." },
    { stimulus: "We never learned ____ the director chose.", answer: "whom", distractors: ["who", "whose", "which"], explanation: "Whom is the object of chose. The director is the subject." },
    { stimulus: "____ goggles are on the counter?", answer: "Whose", distractors: ["Who's", "Whom", "Who"], explanation: "Whose is the possessive form and modifies goggles. Who's would mean who is." },
    { stimulus: "The prize goes to ____ finishes first.", answer: "whoever", distractors: ["whomever", "whom", "whose"], explanation: "Whoever is the subject of finishes. The whole clause is the object of to." },
    { stimulus: "Give the forms to ____ you choose.", answer: "whomever", distractors: ["whoever", "who", "whose"], explanation: "You is the subject of choose, and whomever is the object of choose." },
    { stimulus: "____ students should lead the tour.", answer: "We", distractors: ["Us", "Our", "Ours"], explanation: "We is the subject of should lead. Us students would be wrong in the subject position." },
    { stimulus: "The announcement surprised ____ students.", answer: "us", distractors: ["we", "our", "ours"], explanation: "Us is the object of surprised. Students is an appositive renaming us." },
    { stimulus: "Maya is taller than ____ (am).", answer: "I", distractors: ["me", "myself", "mine"], explanation: "The pronoun is the subject of the implied verb am, so formal writing uses I." },
    { stimulus: "The coach trusts Jordan more than ____ (trusts Jordan).", answer: "she", distractors: ["her", "herself", "hers"], explanation: "The words in parentheses show that the pronoun is a subject, so use she." },
    { stimulus: "The coach trusts Jordan more than (the coach trusts) ____.", answer: "her", distractors: ["she", "herself", "hers"], explanation: "The pronoun is the object of the implied verb trusts, so use her." },
  ]),
];

export const tensePatterns: Pattern[] = [
  choicePattern("tense-choice", BAND.all, "Choose the verb that keeps the tense consistent.", [
    { stimulus: "When the bell rang, the students ____ to their lockers.", answer: "rushed", distractors: ["rush", "will rush", "had rushing"], explanation: "Rang is past tense, so rushed keeps the sentence in the past." },
    { stimulus: "Every morning the editor ____ the headlines before homeroom.", answer: "checks", distractors: ["checked", "will check", "checking"], explanation: "Every morning establishes a present habit, so use checks." },
    { stimulus: "By the time the curtain rose, the crew ____ the backdrop.", answer: "had finished", distractors: ["finished", "has finished", "finishes"], explanation: "The crew finished before the past action rose, so the past perfect had finished is required." },
    { stimulus: "Tomorrow the class ____ the results.", answer: "will present", distractors: ["presented", "presents yesterday", "had presented"], explanation: "Tomorrow calls for the future tense will present." },
    { stimulus: "Last night I ____ the lab report, and I still agree with the conclusion.", answer: "wrote", distractors: ["write", "will write", "writing"], explanation: "Last night places the writing in the past. The second clause can stay present because the agreement is still true." },
    { stimulus: "The chemist heats the solution and then ____ the temperature.", answer: "records", distractors: ["recorded", "will recorded", "had recorded"], explanation: "Heats is present, so records keeps the same tense. This is the historical or habitual present used for a procedure." },
    { stimulus: "While Maya was measuring the salt, the beaker ____.", answer: "cracked", distractors: ["cracks", "will crack", "crack"], explanation: "Was measuring is past, and the interruption cracked is also past." },
    { stimulus: "If the bus arrives late, we ____ in the lobby.", answer: "will wait", distractors: ["waited", "had waited", "waits yesterday"], explanation: "A present-tense condition about the future pairs with will wait." },
    { stimulus: "The author lived in Ohio, and she ____ about the river.", answer: "wrote", distractors: ["writes", "will write", "writing"], explanation: "Lived is past, so wrote stays in the past. A shift to writes would be wrong unless the item were discussing her work as still existing." },
    { stimulus: "By Friday we ____ the first draft.", answer: "will have finished", distractors: ["finished", "finish", "had finish"], explanation: "By Friday looks forward to a time when the draft will already be complete, so use the future perfect." },
    { stimulus: "Yesterday the choir ____ for two hours.", answer: "rehearsed", distractors: ["rehearses", "will rehearse", "rehearse"], explanation: "Yesterday requires the past tense." },
    { stimulus: "Right now the partners ____ the data.", answer: "are checking", distractors: ["checked", "will checked", "had check"], explanation: "Right now calls for the present progressive." },
    { stimulus: "After the rain stopped, we ____ to the field.", answer: "walked", distractors: ["walk", "will walk", "walking"], explanation: "Stopped is past, so walked matches it." },
    { stimulus: "Before she moved to Denver, Lena ____ in the youth orchestra.", answer: "had played", distractors: ["plays", "will play", "has played"], explanation: "The playing happened before the past move, so use the past perfect had played." },
    { stimulus: "The historian explains the map and then ____ a question.", answer: "asks", distractors: ["asked", "will asked", "had ask"], explanation: "Explains is present, so asks keeps that tense." },
    { stimulus: "Next week the museum ____ the new wing.", answer: "opens", distractors: ["opened", "had opened", "open yesterday"], explanation: "Next week is future. The present tense opens can express a scheduled future event." },
  ]),
  revisionPattern("tense-rewrite", BAND.all, "rewrite", "Rewrite the sentence so the verb tense stays consistent.", [
    { stimulus: "When the bell rang, the students rush to their lockers.", answer: "When the bell rang, the students rushed to their lockers.", explanation: "Rang is past tense, so rush should be rushed." },
    { stimulus: "Yesterday the choir rehearses for two hours.", answer: "Yesterday the choir rehearsed for two hours.", explanation: "Yesterday requires the past tense rehearsed." },
    { stimulus: "The chemist heated the solution and then records the temperature.", answer: "The chemist heated the solution and then recorded the temperature.", explanation: "Heated is past, so records should be recorded." },
    { stimulus: "Every morning the editor checked the headlines before homeroom and then starts class.", answer: "Every morning the editor checks the headlines before homeroom and then starts class.", explanation: "Every morning describes a habit. Both verbs should be present: checks and starts." },
    { stimulus: "While Maya was measuring the salt, the beaker cracks.", answer: "While Maya was measuring the salt, the beaker cracked.", explanation: "The measuring is past, so the cracking should be cracked." },
    { stimulus: "By the time the curtain rose, the crew finishes the backdrop.", answer: "By the time the curtain rose, the crew had finished the backdrop.", explanation: "The finishing happened before the past action rose, so use had finished." },
    { stimulus: "Next week the museum opened the new wing.", answer: "Next week the museum opens the new wing.", explanation: "Next week is future. A scheduled event can use the present tense opens, or will open. The key uses opens." },
    { stimulus: "The author lived in Ohio and writes about the river in this memoir.", answer: "The author lived in Ohio and wrote about the river in this memoir.", explanation: "If both actions belong to the author's life in the past, wrote matches lived. Keep writes only if you mean the book as a present text; this item asks for consistency with lived." },
    { stimulus: "Before she moved to Denver, Lena plays in the youth orchestra.", answer: "Before she moved to Denver, Lena had played in the youth orchestra.", explanation: "The playing came before the past move, so use had played." },
    { stimulus: "Right now the partners checked the data.", answer: "Right now the partners are checking the data.", explanation: "Right now calls for the present progressive." },
    { stimulus: "After the rain stopped, we walk to the field.", answer: "After the rain stopped, we walked to the field.", explanation: "Stopped is past, so walk should be walked." },
    { stimulus: "Tomorrow the class presented the results.", answer: "Tomorrow the class will present the results.", explanation: "Tomorrow requires a future form." },
  ]),
];

const MOODS = [
  ["The choir practices on Tuesdays.", "indicative", "This sentence states a fact, so the mood is indicative."],
  ["Did the beaker crack during the trial?", "indicative", "A question about a fact is still indicative."],
  ["The committee meets at noon.", "indicative", "This states a fact."],
  ["The results show a clear pattern.", "indicative", "This states a fact."],
  ["She was the first violinist.", "indicative", "This reports a fact in the past."],
  ["The bus arrives at 7:40.", "indicative", "This states a scheduled fact."],
  ["Revise the ending before Friday.", "imperative", "The sentence gives a command. The subject you is understood."],
  ["Please return the beakers to the cart.", "imperative", "This is a request addressed to you."],
  ["Stop at the crosswalk.", "imperative", "This is a command."],
  ["Open your notebooks to page 12.", "imperative", "This tells the listener what to do."],
  ["Label every sample before you leave.", "imperative", "The base verb label gives a command."],
  ["Do not touch the wet paint.", "imperative", "This is a negative command."],
  ["I wish I were taller.", "subjunctive", "Were expresses a wish contrary to fact, so the mood is subjunctive."],
  ["If I were the director, I would dim the lights.", "subjunctive", "Were states a hypothetical condition, not a fact about the present."],
  ["The coach insists that every player be on time.", "subjunctive", "After a verb of demand such as insists, use the base form be."],
  ["I recommend that the rule be changed.", "subjunctive", "Recommend triggers the mandative subjunctive be."],
  ["She asked that he arrive early.", "subjunctive", "Asked that introduces a demand, so arrive stays in the base form."],
  ["He acts as if he were the director.", "subjunctive", "Were shows a comparison that is not literally true."],
  ["If she were here, she would know the cue.", "subjunctive", "The condition is contrary to fact."],
  ["The committee requested that the vote be delayed.", "subjunctive", "Requested that is followed by the base form be."],
  ["I suggest that she be included.", "subjunctive", "Suggest that is followed by the subjunctive base form be."],
        ["The director asked that the scene remain in the play.", "subjunctive", "Asked that is followed by the base form remain, not remains."],
  ["The greenhouse stays humid in July.", "indicative", "This sentence states a fact."],
  ["Close the cabinet when you leave.", "imperative", "This is a command with an understood subject, you."],
  ["Leave the samples on the counter.", "imperative", "This tells the listener what to do."],
  ["The partners agree about the conclusion.", "indicative", "This reports a fact."],
  ["I wish the ending were quieter.", "subjunctive", "Were expresses a wish that is not a fact."],
] as const;

export const moodPatterns: Pattern[] = [
  pattern({
    id: "mood-identify",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "What mood is the main verb?",
    build: (rng) => {
      const row = rng.pick(MOODS);
      return {
        stimulus: row[0],
        answer: row[1],
        choices: ["indicative", "imperative", "subjunctive"],
        explanation: row[2],
        key: row[0],
      };
    },
  }),
  revisionPattern("mood-rewrite", BAND.upper, "rewrite", "Rewrite the sentence in the mood the meaning requires.", [
    { stimulus: "If I was the director, I would dim the lights.", answer: "If I were the director, I would dim the lights.", explanation: "A hypothetical condition contrary to fact uses the subjunctive were, not was." },
    { stimulus: "I wish I was taller.", answer: "I wish I were taller.", explanation: "Wishes contrary to fact take were." },
    { stimulus: "The coach insists that every player is on time.", answer: "The coach insists that every player be on time.", explanation: "A demand after insists that uses the subjunctive base form be." },
    { stimulus: "I recommend that the rule is changed.", answer: "I recommend that the rule be changed.", explanation: "Recommend that is followed by be, not is." },
    { stimulus: "She asked that he arrives early.", answer: "She asked that he arrive early.", explanation: "After asked that, use the base form arrive." },
    { stimulus: "He acts as if he was the director.", answer: "He acts as if he were the director.", explanation: "A contrary-to-fact comparison uses were." },
    { stimulus: "If she was here, she would know the cue.", answer: "If she were here, she would know the cue.", explanation: "The condition is hypothetical, so use were." },
    { stimulus: "The committee requested that the vote is delayed.", answer: "The committee requested that the vote be delayed.", explanation: "Requested that takes the subjunctive be." },
    { stimulus: "I suggest that she is included.", answer: "I suggest that she be included.", explanation: "Suggest that is followed by be." },
    { stimulus: "The director asked that the scene remains in the play.", answer: "The director asked that the scene remain in the play.", explanation: "Use the base form remain after asked that." },
    { stimulus: "If I was you, I would check the units.", answer: "If I were you, I would check the units.", explanation: "If I were you is the subjunctive form for advice." },
    { stimulus: "The teacher requires that every draft has a title.", answer: "The teacher requires that every draft have a title.", explanation: "Requires that is followed by the base form have, not has." },
  ]),
];

const VOICE = [
  ["painted the mural in the lobby", "The mural in the lobby was painted by"],
  ["discovered the error in the data", "The error in the data was discovered by"],
  ["delivered the speech at noon", "The speech was delivered at noon by"],
  ["repaired the cracked beaker", "The cracked beaker was repaired by"],
  ["wrote the opening paragraph", "The opening paragraph was written by"],
  ["directed the one-act play", "The one-act play was directed by"],
  ["found the missing key", "The missing key was found by"],
  ["organized the costume rack", "The costume rack was organized by"],
  ["measured the salt twice", "The salt was measured twice by"],
  ["posted the roster before lunch", "The roster was posted before lunch by"],
] as const;

export const voicePatterns: Pattern[] = [
  pattern({
    id: "voice-identify",
    difficulties: BAND.all,
    type: "multiple-choice",
    prompt: "Is the sentence in active voice or passive voice?",
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [activeVerb, passiveStart] = rng.pick(VOICE);
      const active = `${name} ${activeVerb}.`;
      const passive = `${passiveStart} ${name}.`;
      const usePassive = rng.next() < 0.5;
      return {
        stimulus: usePassive ? passive : active,
        answer: usePassive ? "passive" : "active",
        choices: ["active", "passive"],
        explanation: usePassive
          ? `The subject receives the action, and the doer appears in a by-phrase, so the voice is passive.`
          : `${name} performs the action, so the voice is active.`,
        key: usePassive ? passive : active,
      };
    },
  }),
  pattern({
    id: "voice-to-passive",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence in the passive voice. Keep the same tense.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [activeVerb, passiveStart] = rng.pick(VOICE);
      return {
        stimulus: `${name} ${activeVerb}.`,
        answer: `${passiveStart} ${name}.`,
        explanation: `The original object becomes the subject, and ${name} moves into a by-phrase. The tense stays past.`,
        key: `${name}|${activeVerb}|passive`,
      };
    },
  }),
  pattern({
    id: "voice-to-active",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence in the active voice. Keep the same tense.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const [activeVerb, passiveStart] = rng.pick(VOICE);
      return {
        stimulus: `${passiveStart} ${name}.`,
        answer: `${name} ${activeVerb}.`,
        explanation: `${name} is the doer, so ${name} becomes the subject of the active sentence.`,
        key: `${name}|${activeVerb}|active`,
      };
    },
  }),
  choicePattern("voice-choice", BAND.adv, "Which sentence is the better choice for the situation?", [
    { stimulus: "The writer does not know who cracked the beaker. Which sentence fits?", answer: "The beaker was cracked during second period.", distractors: ["Someone cracked the beaker during second period.", "The beaker cracked someone during second period.", "Cracking the beaker was during second period."], explanation: "Passive voice is useful when the doer is unknown. The active sentence has to invent a vague someone." },
    { stimulus: "The writer wants to emphasize Maya, who found the key. Which sentence fits?", answer: "Maya found the missing key.", distractors: ["The missing key was found by Maya.", "The missing key was found.", "Found by Maya the key was."], explanation: "Active voice puts the doer, Maya, in the subject position." },
    { stimulus: "The writer wants to emphasize the mural rather than the painter. Which sentence fits?", answer: "The mural was painted over the weekend.", distractors: ["Jordan painted the mural over the weekend.", "The mural painted Jordan over the weekend.", "Painting was the mural."], explanation: "Passive voice makes the mural the subject." },
    { stimulus: "The lab report should sound direct and name the researchers. Which sentence fits?", answer: "The researchers heated the solution to 60 degrees.", distractors: ["The solution was heated to 60 degrees by the researchers.", "The solution was heated.", "Heated the solution the researchers."], explanation: "When the doer matters, active voice is more direct." },
    { stimulus: "A process description should focus on the steps, not on who did them. Which sentence fits?", answer: "The solution is heated to 60 degrees.", distractors: ["We heat the solution to 60 degrees.", "The solution heats us to 60 degrees.", "Heating we the solution."], explanation: "Passive voice keeps the focus on the solution and the step." },
    { stimulus: "The writer knows the agent and wants a strong subject. Which sentence fits?", answer: "The jury reached a verdict.", distractors: ["A verdict was reached by the jury.", "A verdict reached the jury.", "Reached a verdict was."], explanation: "Active voice gives the sentence a clear, strong subject." },
  ]),
];

export const parallelPatterns: Pattern[] = [
  pattern({
    id: "parallel-series",
    difficulties: BAND.all,
    type: "rewrite",
    prompt: "Rewrite the sentence so the items in the series are parallel.",
    lines: 2,
    build: (rng) => {
      const name = rng.pick(NAMES);
      const rows = [
        [`${name} likes hiking, to swim, and bikes.`, `${name} likes hiking, swimming, and biking.`, "Hiking, swimming, and biking are all gerunds."],
        [`${name} likes to hike, swimming, and to bike.`, `${name} likes to hike, to swim, and to bike.`, "All three items should be infinitives."],
        [`The coach told the team to stretch, hydrating, and that they should listen.`, "The coach told the team to stretch, to hydrate, and to listen.", "Items in the series should all be infinitives."],
        [`The internship requires filing, to answer phones, and how you greet visitors.`, "The internship requires filing, answering phones, and greeting visitors.", "All three items should be gerunds."],
        [`The speech was clear, it had logic, and persuasive.`, "The speech was clear, logical, and persuasive.", "Clear, logical, and persuasive are all adjectives after was."],
        [`${name} wanted a partner who was patient, with kindness, and someone who works hard.`, `${name} wanted a partner who was patient, kind, and hardworking.`, "The three modifiers of partner should share adjective form."],
        [`We can meet in the library, at the lab, or going to the auditorium.`, "We can meet in the library, at the lab, or in the auditorium.", "All three places should be prepositional phrases."],
        [`The goals are to measure the salt, recording the temperature, and a graph of the results.`, "The goals are to measure the salt, to record the temperature, and to graph the results.", "All three goals should be infinitive phrases."],
        [`${name} is responsible for the lights, running the sound board, and to lock the doors.`, `${name} is responsible for the lights, the sound board, and the doors.`, "All three objects of for should be nouns."],
        [`The trail was steep, rocky, and it frightened the new hikers.`, "The trail was steep, rocky, and frightening.", "Three adjectives should follow was."],
        ["Remember your pencil, your notebook, and to arrive on time.", "Remember your pencil, your notebook, and your start time.", "A series after remember should be nouns. Your start time keeps the idea of arriving on time."],
        ["She wrote quickly, with care, and accurate.", "She wrote quickly, carefully, and accurately.", "All three modifiers of wrote should be adverbs."],
        ["The club offers hiking, to paint, and music lessons.", "The club offers hiking, painting, and music lessons.", "Hiking, painting, and music lessons can share noun form. Painting is a gerund used as a noun."],
        [`${name} hopes to win, that the team will cheer, and celebrating.`, `${name} hopes to win, to hear the team cheer, and to celebrate.`, "All three objects of hopes should be infinitive phrases."],
        ["The room was bright, it was wide, and clean.", "The room was bright, wide, and clean.", "Bright, wide, and clean are all adjectives."],
        ["Please walk quietly, with a smile, and polite.", "Please walk quietly, cheerfully, and politely.", "The three modifiers of walk should be adverbs."],
        ["Our tasks were washing beakers, to label slides, and the inventory.", "Our tasks were washing beakers, labeling slides, and taking inventory.", "All three tasks should be gerund phrases."],
        ["The guide spoke slowly, clear, and with patience.", "The guide spoke slowly, clearly, and patiently.", "Slowly, clearly, and patiently are all adverbs."],
      ] as const;
      const [stimulus, answer, explanation] = rng.pick(rows);
      return { stimulus, answer, explanation, key: stimulus };
    },
  }),
  choicePattern("parallel-choice", BAND.all, "Choose the revision that makes the sentence parallel.", [
    { stimulus: "The internship requires filing, to answer phones, and how you greet visitors.", answer: "The internship requires filing, answering phones, and greeting visitors.", distractors: ["The internship requires to file, answering phones, and how you greet visitors.", "The internship requires filing, to answer phones, and greeting.", "The internship requires file, answer, and how you greet visitors."], explanation: "Filing, answering, and greeting match as gerunds." },
    { stimulus: "Maya likes hiking, to swim, and bikes.", answer: "Maya likes hiking, swimming, and biking.", distractors: ["Maya likes to hike, swimming, and bikes.", "Maya likes hiking, to swim, and biking.", "Maya likes hike, swim, and bikes."], explanation: "Three gerunds make the series parallel." },
    { stimulus: "The speech was not only clear but also it was persuasive.", answer: "The speech was not only clear but also persuasive.", distractors: ["The speech was not only clear but also it persuaded people.", "The speech not only was clear but also it was persuasive.", "Not only the speech was clear but also persuasive it was."], explanation: "Not only / but also should join matching adjective complements: clear and persuasive." },
    { stimulus: "Either we will start on time or waiting in the hall.", answer: "Either we will start on time or we will wait in the hall.", distractors: ["Either we will start on time or to wait in the hall.", "Either starting on time or we will wait in the hall.", "Either we will start on time or the hall."], explanation: "Either / or should join two independent clauses here." },
    { stimulus: "The goals are measuring the salt, to record the temperature, and a graph.", answer: "The goals are to measure the salt, to record the temperature, and to graph the results.", distractors: ["The goals are measuring the salt, to record the temperature, and graphing.", "The goals are measure, recording, and to graph.", "The goals are the salt, record, and a graph."], explanation: "Three infinitives match." },
    { stimulus: "She wrote quickly, with care, and accurate.", answer: "She wrote quickly, carefully, and accurately.", distractors: ["She wrote quick, with care, and accurately.", "She wrote quickly, careful, and with accuracy.", "She wrote quick, carefully, and accurate."], explanation: "Quickly, carefully, and accurately are all adverbs." },
    { stimulus: "He promised to study, that he would rest, and eating a real lunch.", answer: "He promised to study, to rest, and to eat a real lunch.", distractors: ["He promised studying, to rest, and that he would eat.", "He promised to study, resting, and a real lunch.", "He promised study, rest, and eating a real lunch."], explanation: "Three infinitives follow promised in parallel." },
    { stimulus: "The film was long, it was slow, and disappointing.", answer: "The film was long, slow, and disappointing.", distractors: ["The film was long, it was slow, and it disappointed.", "The film was long, slowly, and disappointing.", "The film long, slow, and was disappointing."], explanation: "Long, slow, and disappointing are all adjectives." },
  ]),
  revisionPattern("parallel-correlative", BAND.upper, "rewrite", "Rewrite the sentence so the correlative conjunction joins parallel forms.", [
    { stimulus: "The speech was not only clear but also it was persuasive.", answer: "The speech was not only clear but also persuasive.", explanation: "Not only and but also should be followed by matching adjectives." },
    { stimulus: "She not only likes biology but also she is liking chemistry.", answer: "She likes not only biology but also chemistry.", explanation: "Not only / but also should join the two noun objects, biology and chemistry." },
    { stimulus: "Either the partners will revise the graph or waiting until Monday.", answer: "Either the partners will revise the graph or they will wait until Monday.", explanation: "Either / or should join two clauses with the same structure." },
    { stimulus: "Neither the lighting was ready nor the microphones.", answer: "Neither the lighting nor the microphones were ready.", explanation: "Neither / nor should join the two noun subjects." },
    { stimulus: "Both hiking and to swim are offered on Friday.", answer: "Both hiking and swimming are offered on Friday.", explanation: "Both / and should join two gerunds." },
    { stimulus: "The review was neither fair nor it was specific.", answer: "The review was neither fair nor specific.", explanation: "Neither / nor should join two adjectives." },
    { stimulus: "Not only did the beaker crack but also spilling the solution.", answer: "Not only did the beaker crack, but the solution also spilled.", explanation: "Both sides of not only / but also should be clauses. Answers may vary slightly; the key shows one balanced revision." },
    { stimulus: "We will either meet in the library or the lab is where we can meet.", answer: "We will meet either in the library or in the lab.", explanation: "Either / or should join two prepositional phrases." },
  ]),
];
