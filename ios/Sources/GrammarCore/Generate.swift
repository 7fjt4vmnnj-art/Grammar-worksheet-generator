import Foundation

public func defaultTitle(skills: [Skill]) -> String {
    if skills.count == 1 { return skills[0].name }
    if skills.count > 1 && skills.count <= 3 {
        return skills.map(\.name).joined(separator: ", ")
    }
    return "Grammar Practice"
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
    let resolvedTitle = title.isEmpty ? defaultTitle(skills: used) : title
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
        picked.append(pool[index])
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
