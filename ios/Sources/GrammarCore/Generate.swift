import Foundation

public func defaultTitle(skills: [Skill]) -> String {
    if skills.count == 1 { return skills[0].name }
    if skills.count > 1 && skills.count <= 3 {
        return skills.map(\.name).joined(separator: ", ")
    }
    return "Grammar Practice"
}

/// Title shown on the worksheet and in the PDF header. It names the grade and the selected skills.
public func suggestedWorksheetTitle(grade: Grade, skills: [Skill]) -> String {
    let prefix = "Grade \(grade.rawValue)"
    if skills.isEmpty {
        return "\(prefix) Grammar"
    }
    if skills.count == 1 {
        return "\(prefix): \(skills[0].name)"
    }
    let names = skills.map(\.name)
    let full = "\(prefix): \(names.joined(separator: ", "))"
    if full.count <= 140 {
        return full
    }
    var kept: [String] = []
    for name in names {
        let next = kept + [name]
        let extra = names.count - next.count
        let candidate = extra == 0
            ? "\(prefix): \(next.joined(separator: ", "))"
            : "\(prefix): \(next.joined(separator: ", ")), and \(extra) more"
        if candidate.count > 140 && !kept.isEmpty {
            break
        }
        kept = next
    }
    let extra = names.count - kept.count
    if kept.isEmpty {
        return "\(prefix) Grammar Practice"
    }
    if extra == 0 {
        return "\(prefix): \(kept.joined(separator: ", "))"
    }
    return "\(prefix): \(kept.joined(separator: ", ")), and \(extra) more"
}

/// Tracks the worksheet title so grade, skill, and quick-start changes replace a stale heading,
/// while a typed title is kept until the next one of those changes.
public struct WorksheetTitleState: Equatable, Sendable {
    public private(set) var title: String
    public private(set) var followsSelection: Bool

    public init(grade: Grade, skills: [Skill]) {
        title = suggestedWorksheetTitle(grade: grade, skills: skills)
        followsSelection = true
    }

    public mutating func selectionChanged(grade: Grade, skills: [Skill]) {
        followsSelection = true
        title = suggestedWorksheetTitle(grade: grade, skills: skills)
    }

    public mutating func userEdited(_ newValue: String, grade: Grade, skills: [Skill]) {
        title = newValue
        let trimmed = newValue.trimmingCharacters(in: .whitespacesAndNewlines)
        let suggested = suggestedWorksheetTitle(grade: grade, skills: skills)
        followsSelection = trimmed.isEmpty || trimmed == suggested
    }

    public func resolved(grade: Grade, skills: [Skill]) -> String {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            return suggestedWorksheetTitle(grade: grade, skills: skills)
        }
        return trimmed
    }
}

public func formatLongDate(_ iso: String) -> String {
    let trimmed = iso.trimmingCharacters(in: .whitespacesAndNewlines)
    let parts = trimmed.split(separator: "-").map(String.init)
    guard parts.count == 3, let year = Int(parts[0]), let month = Int(parts[1]), let day = Int(parts[2]) else {
        return trimmed
    }
    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = TimeZone(secondsFromGMT: 0) ?? .current
    var components = DateComponents()
    components.calendar = calendar
    components.timeZone = calendar.timeZone
    components.year = year
    components.month = month
    components.day = day
    guard let date = calendar.date(from: components) else { return trimmed }
    let check = calendar.dateComponents([.year, .month, .day], from: date)
    guard check.year == year, check.month == month, check.day == day else { return trimmed }
    let formatter = DateFormatter()
    formatter.locale = Locale(identifier: "en_US")
    formatter.timeZone = calendar.timeZone
    formatter.dateFormat = "MMMM d, yyyy"
    return formatter.string(from: date)
}

public func fileSlug(title: String, grade: Grade, kind: DocumentKind) -> String {
    let base = slug(title).prefix(48)
    let trimmed = String(base).trimmingCharacters(in: CharacterSet(charactersIn: "-"))
    let stem = trimmed.isEmpty ? "grammar" : trimmed
    return "grade-\(grade.rawValue)-\(stem)-\(kind.rawValue).pdf"
}

public func worksheetItems(_ worksheet: Worksheet) -> [WorksheetItem] {
    worksheet.sections.flatMap(\.items)
}

public func generateWorksheet(_ input: GenerateInput) throws -> Worksheet {
    if input.skillIds.isEmpty {
        throw GenerateError.noSkills
    }
    if input.questionCount < 5 || input.questionCount > 25 {
        throw GenerateError.questionCount
    }
    var seenSkillIds = Set<String>()
    let skillIds = input.skillIds.filter { seenSkillIds.insert($0).inserted }
    let skills = try skillIds.map { id in
        guard let skill = Catalog.skill(id: id) else { throw GenerateError.unknownSkill(id) }
        return skill
    }
    let counts = distribute(skillCount: skills.count, questions: input.questionCount)
    var rng = Rng(seed: input.seed)
    var sections: [WorksheetSection] = []
    var skipped: [String] = []
    var number = 1
    for (index, skill) in skills.enumerated() {
        let count = counts[index]
        if count == 0 {
            skipped.append(skill.name)
            continue
        }
        let bank = ItemBank.items(skillId: skill.id, difficulty: input.difficulty)
        let picked = try selectItems(
            from: bank,
            count: count,
            skillName: skill.name,
            difficulty: input.difficulty,
            rng: &rng
        )
        let items = picked.map { item -> WorksheetItem in
            let current = number
            number += 1
            return WorksheetItem(
                number: current,
                skillId: skill.id,
                skillName: skill.name,
                type: item.type,
                prompt: item.prompt,
                stimulus: item.stimulus,
                choices: item.choices,
                lines: item.lines,
                answer: item.answer,
                explanation: item.explanation
            )
        }
        sections.append(
            WorksheetSection(
                skillId: skill.id,
                skillName: skill.name,
                directions: skill.directions,
                items: items
            )
        )
    }
    let used = zip(skills, counts).compactMap { skill, count in count > 0 ? skill : nil }
    let title = input.title.trimmingCharacters(in: .whitespacesAndNewlines)
    let resolvedTitle = title.isEmpty ? suggestedWorksheetTitle(grade: input.grade, skills: used) : title
    let warning: String?
    if skipped.isEmpty {
        warning = nil
    } else {
        let noun = used.count == 1 ? "skill" : "skills"
        warning = "Only the first \(used.count) \(noun) fit into \(input.questionCount) questions. Raise the question count or select fewer skills to include \(skipped.joined(separator: ", "))."
    }
    return Worksheet(
        meta: WorksheetMeta(
            title: resolvedTitle,
            grade: input.grade,
            difficulty: input.difficulty,
            teacher: input.teacher.trimmingCharacters(in: .whitespacesAndNewlines),
            className: input.className.trimmingCharacters(in: .whitespacesAndNewlines),
            date: formatLongDate(input.date),
            seed: input.seed,
            includeDirections: input.includeDirections,
            skillNames: used.map(\.name)
        ),
        warning: warning,
        sections: sections
    )
}

func distribute(skillCount: Int, questions: Int) -> [Int] {
    guard skillCount > 0 else { return [] }
    let base = questions / skillCount
    var remainder = questions % skillCount
    return (0..<skillCount).map { _ in
        let extra = remainder > 0 ? 1 : 0
        remainder -= extra
        return base + extra
    }
}

private func selectItems(
    from bank: [BankItem],
    count: Int,
    skillName: String,
    difficulty: Difficulty,
    rng: inout Rng
) throws -> [BankItem] {
    if bank.count < count {
        throw GenerateError.shortBank(
            skill: skillName,
            difficulty: difficulty,
            available: bank.count,
            needed: count
        )
    }
    var grouped: [Int: [BankItem]] = [:]
    for item in bank {
        grouped[item.order, default: []].append(item)
    }
    let orders = grouped.keys.sorted()
    var pools: [Int: [BankItem]] = [:]
    for order in orders {
        pools[order] = rng.shuffle(grouped[order] ?? [])
    }
    var cursors = Dictionary(uniqueKeysWithValues: orders.map { ($0, 0) })
    var picked: [BankItem] = []
    var guardCount = 0
    var slot = 0
    let maxAttempts = max(400, count * 80)
    while picked.count < count && guardCount < maxAttempts {
        if orders.isEmpty { break }
        let order = orders[slot % orders.count]
        slot += 1
        guardCount += 1
        let index = cursors[order] ?? 0
        let pool = pools[order] ?? []
        if index >= pool.count { continue }
        cursors[order] = index + 1
        picked.append(withShuffledChoices(pool[index], rng: &rng))
    }
    if picked.count < count {
        throw GenerateError.shortBank(
            skill: skillName,
            difficulty: difficulty,
            available: picked.count,
            needed: count
        )
    }
    return picked.enumerated()
        .sorted { lhs, rhs in
            if lhs.element.order != rhs.element.order {
                return lhs.element.order < rhs.element.order
            }
            return lhs.offset < rhs.offset
        }
        .map(\.element)
}

/// Choice order is part of the seed, not part of the stored bank, so a new seed
/// can ask the same question with the options in a different order.
private func withShuffledChoices(_ item: BankItem, rng: inout Rng) -> BankItem {
    guard item.type == .multipleChoice, let choices = item.choices, choices.count > 1 else {
        return item
    }
    let parts = item.answer.split(separator: " ", maxSplits: 1, omittingEmptySubsequences: false)
    guard parts.count == 2 else { return item }
    let correct = String(parts[1])
    guard choices.contains(correct) else { return item }
    let shuffled = rng.shuffle(choices)
    guard let index = shuffled.firstIndex(of: correct), index < 26 else { return item }
    let letter = Character(Unicode.Scalar(UInt8(65 + index)))
    return BankItem(
        patternId: item.patternId,
        order: item.order,
        type: item.type,
        prompt: item.prompt,
        stimulus: item.stimulus,
        choices: shuffled,
        lines: item.lines,
        answer: "\(letter). \(correct)",
        explanation: item.explanation,
        key: item.key
    )
}

private func slug(_ title: String) -> String {
    var result = ""
    var pendingDash = false
    for scalar in title.lowercased().unicodeScalars {
        let value = scalar.value
        let isDigit = value >= 48 && value <= 57
        let isLetter = value >= 97 && value <= 122
        if isDigit || isLetter {
            if pendingDash && !result.isEmpty {
                result.append("-")
            }
            pendingDash = false
            result.unicodeScalars.append(scalar)
        } else if !result.isEmpty {
            pendingDash = true
        }
    }
    while result.last == "-" {
        result.removeLast()
    }
    return result
}
