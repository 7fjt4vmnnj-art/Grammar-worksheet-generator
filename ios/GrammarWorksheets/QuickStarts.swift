import GrammarCore

struct QuickStart: Identifiable {
    let id: String
    let title: String
    let detail: String
    let grade: Grade
    let skillIDs: [String]
    let questions: Int

    static let all: [QuickStart] = [
        QuickStart(
            id: "grade-7-core",
            title: "Grade 7 core",
            detail: "Nouns, agreement, fragments, commas, confused words",
            grade: .seven,
            skillIDs: ["nouns", "subject-verb-agreement", "fragments", "commas", "confused-words"],
            questions: 15
        ),
        QuickStart(
            id: "grade-10-sentences",
            title: "Grade 10 sentences",
            detail: "Clauses, sentence types, modifiers, parallel structure, semicolons",
            grade: .ten,
            skillIDs: ["clauses", "sentence-types", "modifiers", "parallel-structure", "semicolons-colons"],
            questions: 15
        ),
        QuickStart(
            id: "grade-12-editing",
            title: "Grade 12 editing",
            detail: "Mood, modifiers, dashes, register, commas",
            grade: .twelve,
            skillIDs: ["verb-mood", "modifiers", "hyphens-dashes", "formal-informal", "commas"],
            questions: 15
        ),
    ]
}
