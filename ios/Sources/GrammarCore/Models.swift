import Foundation

public enum Grade: Int, CaseIterable, Identifiable, Codable, Sendable {
    case seven = 7
    case eight = 8
    case nine = 9
    case ten = 10
    case eleven = 11
    case twelve = 12

    public var id: Int { rawValue }

    public var band: GradeBand {
        switch self {
        case .seven, .eight:
            return .grades7to8
        case .nine, .ten:
            return .grades9to10
        case .eleven, .twelve:
            return .grades11to12
        }
    }

    public var defaultDifficulty: Difficulty {
        switch self {
        case .seven, .eight:
            return .developing
        case .nine, .ten:
            return .proficient
        case .eleven, .twelve:
            return .advanced
        }
    }
}

public enum GradeBand: String, Codable, Hashable, Sendable {
    case grades7to8 = "7-8"
    case grades9to10 = "9-10"
    case grades11to12 = "11-12"
}

public enum Difficulty: String, CaseIterable, Identifiable, Codable, Hashable, Sendable {
    case developing
    case proficient
    case advanced

    public var id: String { rawValue }

    public var label: String {
        switch self {
        case .developing: return "Developing"
        case .proficient: return "Proficient"
        case .advanced: return "Advanced"
        }
    }

    public var blurb: String {
        switch self {
        case .developing:
            return "Shorter sentences and more direct tasks."
        case .proficient:
            return "Grade 9–10 depth, with closer distractors."
        case .advanced:
            return "Denser sentences, traps, and more revision."
        }
    }
}

public enum CategoryId: String, CaseIterable, Identifiable, Codable, Hashable, Sendable {
    case partsOfSpeech
    case agreement
    case sentenceStructure
    case punctuation
    case usage

    public var id: String { rawValue }
}

public enum ItemType: String, Codable, Hashable, Sendable {
    case multipleChoice = "multiple-choice"
    case identify
    case fillIn = "fill-in"
    case rewrite
    case edit
}

/// Written responses get one ruled line. Choice items stay at zero.
public func answerLineCount(type: ItemType, lines: Int) -> Int {
    if type == .multipleChoice || lines <= 0 { return 0 }
    return 1
}

public enum DocumentKind: String, Codable, Hashable, Sendable {
    case worksheet
    case answerKey = "answer-key"
}

public struct Category: Identifiable, Hashable, Sendable {
    public let id: CategoryId
    public let name: String
    public let blurb: String

    public init(id: CategoryId, name: String, blurb: String) {
        self.id = id
        self.name = name
        self.blurb = blurb
    }
}

public struct Skill: Identifiable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let category: CategoryId
    public let summary: String
    public let directions: String
    public let gradeBands: [GradeBand]
    public let keywords: [String]

    public init(
        id: String,
        name: String,
        category: CategoryId,
        summary: String,
        directions: String,
        gradeBands: [GradeBand],
        keywords: [String]
    ) {
        self.id = id
        self.name = name
        self.category = category
        self.summary = summary
        self.directions = directions
        self.gradeBands = gradeBands
        self.keywords = keywords
    }
}

public struct WorksheetItem: Identifiable, Equatable, Sendable {
    public let number: Int
    public let skillId: String
    public let skillName: String
    public let type: ItemType
    public let prompt: String
    public let stimulus: String?
    public let choices: [String]?
    public let lines: Int
    public let answer: String
    public let explanation: String?

    public var id: Int { number }
}

public struct WorksheetSection: Identifiable, Equatable, Sendable {
    public let skillId: String
    public let skillName: String
    public let directions: String
    public let items: [WorksheetItem]

    public var id: String { skillId }
}

public struct WorksheetMeta: Equatable, Sendable {
    public var title: String
    public var grade: Grade
    public let difficulty: Difficulty
    public let teacher: String
    public let className: String
    public let date: String
    public let seed: UInt32
    public let includeDirections: Bool
    public let skillNames: [String]
}

public struct Worksheet: Equatable, Sendable {
    public var meta: WorksheetMeta
    public let warning: String?
    public let sections: [WorksheetSection]

    public func withTitle(_ title: String) -> Worksheet {
        var copy = self
        copy.meta.title = title
        return copy
    }

    public func withHeader(title: String, grade: Grade) -> Worksheet {
        var copy = self
        copy.meta.title = title
        copy.meta.grade = grade
        return copy
    }
}

public struct GenerateInput: Equatable, Sendable {
    public var grade: Grade
    public var skillIds: [String]
    public var questionCount: Int
    public var difficulty: Difficulty
    public var includeDirections: Bool
    public var title: String
    public var teacher: String
    public var className: String
    public var date: String
    public var seed: UInt32

    public init(
        grade: Grade,
        skillIds: [String],
        questionCount: Int,
        difficulty: Difficulty,
        includeDirections: Bool,
        title: String,
        teacher: String,
        className: String,
        date: String,
        seed: UInt32
    ) {
        self.grade = grade
        self.skillIds = skillIds
        self.questionCount = questionCount
        self.difficulty = difficulty
        self.includeDirections = includeDirections
        self.title = title
        self.teacher = teacher
        self.className = className
        self.date = date
        self.seed = seed
    }
}

public struct ItemPromptLayout: Equatable, Sendable {
    public var prompt: String
    public var groupPrompt: String

    public init(prompt: String, groupPrompt: String) {
        self.prompt = prompt
        self.groupPrompt = groupPrompt
    }
}

/// Skills whose section directions already tell students what to do on every item.
/// Keep this list in sync with `SHARED_DIRECTION_SKILL_IDS` in lib/catalog.ts.
public let sharedDirectionSkillIds: Set<String> = [
    "active-passive",
    "sentence-types",
    "phrases",
    "end-punctuation",
    "semicolons-colons",
    "titles",
    "confused-words",
    "double-negatives",
    "capitalization",
]

public func directionsCoverItemPrompts(_ skillId: String) -> Bool {
    sharedDirectionSkillIds.contains(skillId)
}

/// Section directions are the skill instruction. When a sentence is already on the item,
/// a prompt shared by the following items is printed once above that run. A prompt with
/// no sentence under it is the question, so it stays on every item.
public func layoutItemPrompts(
    _ items: [(prompt: String, stimulus: String?)],
    includeDirections: Bool,
    directionsCoverItems: Bool
) -> [ItemPromptLayout] {
    let trimmed = items.map { $0.prompt.trimmingCharacters(in: .whitespacesAndNewlines) }
    let hasStimulus = items.map { item in
        guard let stimulus = item.stimulus else { return false }
        return !stimulus.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
    let hideAll = includeDirections && directionsCoverItems
    return items.enumerated().map { index, item in
        let current = trimmed[index]
        if current.isEmpty || hideAll {
            return ItemPromptLayout(prompt: "", groupPrompt: "")
        }
        if !hasStimulus[index] {
            return ItemPromptLayout(prompt: item.prompt, groupPrompt: "")
        }
        let previousSame = index > 0 && hasStimulus[index - 1] && trimmed[index - 1] == current
        if previousSame {
            return ItemPromptLayout(prompt: "", groupPrompt: "")
        }
        let nextSame = index + 1 < items.count && hasStimulus[index + 1] && trimmed[index + 1] == current
        if nextSame {
            return ItemPromptLayout(prompt: "", groupPrompt: item.prompt)
        }
        return ItemPromptLayout(prompt: item.prompt, groupPrompt: "")
    }
}

public enum GenerateError: Error, Equatable {
    case noSkills
    case questionCount
    case unknownSkill(String)
    case shortBank(skill: String, difficulty: Difficulty, available: Int, needed: Int)
}

extension GenerateError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .noSkills:
            return "Select at least one skill."
        case .questionCount:
            return "Choose between 5 and 25 questions."
        case .unknownSkill(let id):
            return "Unknown skill: \(id)."
        case .shortBank(let skill, let difficulty, let available, let needed):
            return "\(skill) only has \(available) \(difficulty.label.lowercased()) items ready, and this worksheet needs \(needed)."
        }
    }
}
