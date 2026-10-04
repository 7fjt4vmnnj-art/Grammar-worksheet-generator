import XCTest
@testable import GrammarCore

final class WorksheetTests: XCTestCase {
    func testCatalogCoversThirtyFourSkills() {
        XCTAssertEqual(Catalog.skills.count, 34)
        XCTAssertEqual(Set(Catalog.skills.map(\.id)).count, 34)
        XCTAssertEqual(Catalog.categories.count, 5)
        for skill in Catalog.skills {
            XCTAssertFalse(skill.name.isEmpty, skill.id)
            XCTAssertGreaterThan(skill.directions.count, 20, skill.id)
            XCTAssertFalse(skill.gradeBands.isEmpty, skill.id)
            XCTAssertFalse(skill.summary.isEmpty, skill.id)
            let deep = ["commas", "subject-verb-agreement", "confused-words"]
            for difficulty in Difficulty.allCases {
                let bank = ItemBank.items(skillId: skill.id, difficulty: difficulty)
                let minimum = deep.contains(skill.id) ? 80 : 40
                XCTAssertGreaterThanOrEqual(bank.count, minimum, "\(skill.id) \(difficulty.rawValue)")
            }
        }
    }

    func testEverySkillGeneratesTwentyFiveCoherentItems() throws {
        let placeholder = try NSRegularExpression(pattern: #"\{[a-zA-Z0-9_]+\}"#)
        let stub = try NSRegularExpression(pattern: #"\b(TODO|lorem ipsum|placeholder|stub item)\b"#, options: [.caseInsensitive])
        for skill in Catalog.skills {
            for difficulty in Difficulty.allCases {
                let sheet = try generateWorksheet(
                    GenerateInput(
                        grade: .ten,
                        skillIds: [skill.id],
                        questionCount: 25,
                        difficulty: difficulty,
                        includeDirections: true,
                        title: skill.name,
                        teacher: "",
                        className: "",
                        date: "",
                        seed: 20_260_929
                    )
                )
                let items = worksheetItems(sheet)
                XCTAssertEqual(items.count, 25, skill.id)
                var seen = Set<String>()
                for item in items {
                    let blob = [item.prompt, item.stimulus ?? "", item.answer, item.explanation ?? ""]
                        .joined(separator: "\n") + (item.choices ?? []).joined(separator: "\n")
                    XCTAssertFalse(matches(placeholder, blob), blob)
                    XCTAssertFalse(matches(stub, blob), blob)
                    XCTAssertFalse(item.prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    XCTAssertFalse(item.answer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    let fingerprint = [item.prompt, item.stimulus ?? "", item.answer].joined(separator: "|")
                    XCTAssertTrue(seen.insert(fingerprint).inserted, "\(skill.id) duplicate \(fingerprint)")
                    if item.type == .multipleChoice {
                        let choices = try XCTUnwrap(item.choices, skill.id)
                        XCTAssertGreaterThanOrEqual(choices.count, 2)
                        let parts = item.answer.split(separator: " ", maxSplits: 1, omittingEmptySubsequences: false)
                        XCTAssertEqual(parts.count, 2, item.answer)
                        let letter = String(parts[0]).dropLast()
                        XCTAssertEqual(letter.count, 1)
                        let index = Int(letter.unicodeScalars.first?.value ?? 0) - 65
                        XCTAssertEqual(choices[index], String(parts[1]), "\(skill.id) \(item.answer)")
                    } else {
                        XCTAssertNil(item.choices)
                        XCTAssertEqual(item.lines, 1)
                    }
                    if item.type == .rewrite || item.type == .edit {
                        XCTAssertGreaterThan(item.explanation?.count ?? 0, 12, skill.id)
                    }
                }
            }
        }
    }

    func testSameSeedRebuildsTheSameWorksheet() throws {
        let first = worksheetItems(try generateWorksheet(sampleInput()))
        let second = worksheetItems(try generateWorksheet(sampleInput()))
        XCTAssertEqual(first.map(\.prompt), second.map(\.prompt))
        XCTAssertEqual(first.map(\.stimulus), second.map(\.stimulus))
        XCTAssertEqual(first.map(\.answer), second.map(\.answer))
        XCTAssertEqual(first.map(\.choices), second.map(\.choices))
        var other = sampleInput()
        other.seed = 43
        let changed = worksheetItems(try generateWorksheet(other))
        XCTAssertNotEqual(first.map(\.answer), changed.map(\.answer))
    }

    func testContinuousNumbersAndSkippedSkillWarning() throws {
        var input = sampleInput()
        input.questionCount = 5
        input.skillIds = ["nouns", "verbs", "commas", "fragments", "run-ons", "titles"]
        let sheet = try generateWorksheet(input)
        XCTAssertEqual(worksheetItems(sheet).map(\.number), [1, 2, 3, 4, 5])
        XCTAssertTrue(sheet.warning?.localizedCaseInsensitiveContains("titles") == true)
        XCTAssertFalse(sheet.sections.contains { $0.skillId == "titles" })
        XCTAssertEqual(sheet.meta.date, "September 29, 2026")
        XCTAssertEqual(sheet.meta.teacher, "Ms. Okonkwo")
        XCTAssertEqual(fileSlug(title: sheet.meta.title, grade: .seven, kind: .worksheet), "grade-7-grade-7-core-worksheet.pdf")
        XCTAssertEqual(fileSlug(title: sheet.meta.title, grade: .seven, kind: .answerKey), "grade-7-grade-7-core-answer-key.pdf")
    }

    func testActivePassiveItemsIdentifyAndRewriteOppositeVoice() throws {
        let skill = try XCTUnwrap(Catalog.skill(id: "active-passive"))
        XCTAssertTrue(skill.directions.localizedCaseInsensitiveContains("opposite voice"))
        XCTAssertTrue(skill.summary.localizedCaseInsensitiveContains("opposite voice"))
        for difficulty in Difficulty.allCases {
            let sheet = try generateWorksheet(
                GenerateInput(
                    grade: .ten,
                    skillIds: ["active-passive"],
                    questionCount: 25,
                    difficulty: difficulty,
                    includeDirections: true,
                    title: "Active vs. passive voice",
                    teacher: "",
                    className: "",
                    date: "",
                    seed: 7
                )
            )
            let items = worksheetItems(sheet)
            XCTAssertEqual(items.count, 25)
            for item in items {
                XCTAssertEqual(item.type, .rewrite)
                XCTAssertEqual(item.lines, 1)
                XCTAssertNil(item.choices)
                XCTAssertTrue(item.prompt.localizedCaseInsensitiveContains("rewrite"), item.prompt)
                let asksForOpposite = item.prompt.localizedCaseInsensitiveContains("opposite voice")
                    || item.prompt.localizedCaseInsensitiveContains("other voice")
                XCTAssertTrue(asksForOpposite, item.prompt)
                XCTAssertTrue(
                    item.prompt.localizedCaseInsensitiveContains("active or passive")
                        || item.prompt.localizedCaseInsensitiveContains("the voice"),
                    item.prompt
                )
                XCTAssertTrue(item.answer.hasPrefix("Active. ") || item.answer.hasPrefix("Passive. "), item.answer)
                let rewrite = item.answer.hasPrefix("Active. ")
                    ? String(item.answer.dropFirst("Active. ".count))
                    : String(item.answer.dropFirst("Passive. ".count))
                XCTAssertNotEqual(rewrite, item.stimulus)
                if item.answer.hasPrefix("Active. ") {
                    XCTAssertFalse(item.stimulus?.contains(" by ") == true, item.stimulus ?? "")
                    XCTAssertTrue(rewrite.contains(" by "), rewrite)
                } else {
                    XCTAssertTrue(item.stimulus?.contains(" by ") == true, item.stimulus ?? "")
                    XCTAssertFalse(rewrite.contains(" by "), rewrite)
                }
            }
        }
    }

    func testRecommendedBandsAndDifficultyDefaults() throws {
        let nouns = try XCTUnwrap(Catalog.skill(id: "nouns"))
        XCTAssertTrue(nouns.gradeBands.contains(.grades7to8))
        XCTAssertTrue(Catalog.isRecommended(nouns, grade: .seven))
        XCTAssertEqual(Grade.twelve.defaultDifficulty, .advanced)
        XCTAssertEqual(Grade.nine.defaultDifficulty, .proficient)
        XCTAssertEqual(Grade.seven.band, .grades7to8)
    }

    func testRngMatchesWebGenerator() {
        var rng = Rng(seed: 42)
        let expected = [
            0.6011037519, 0.4482905590, 0.8524657935, 0.6697340414,
            0.1748138987, 0.5265925422, 0.2732279943, 0.6247446539,
        ]
        for value in expected {
            XCTAssertEqual(rng.next(), value, accuracy: 0.000000001)
        }
        XCTAssertEqual(rng.int(7), 6)
        XCTAssertEqual(rng.int(7), 3)
        XCTAssertEqual(rng.int(3), 0)
        var shuffle = Rng(seed: 99)
        XCTAssertEqual(shuffle.shuffle(["a", "b", "c", "d", "e"]), ["a", "c", "e", "d", "b"])
    }

    func testRichTextMarkup() {
        let spans = parseRich("See *The Giver* and **both**.")
        XCTAssertEqual(
            spans,
            [
                RichSpan(text: "See ", style: .regular),
                RichSpan(text: "The Giver", style: .italic),
                RichSpan(text: " and ", style: .regular),
                RichSpan(text: "both", style: .bold),
                RichSpan(text: ".", style: .regular),
            ]
        )
    }

    func testSuggestedTitleFollowsGradeAndSkills() throws {
        let nouns = try XCTUnwrap(Catalog.skill(id: "nouns"))
        let commas = try XCTUnwrap(Catalog.skill(id: "commas"))
        let skills = [nouns, commas]
        XCTAssertEqual(
            suggestedWorksheetTitle(grade: .eight, skills: skills),
            "Grade 8: \(skills[0].name), \(skills[1].name)"
        )
        XCTAssertEqual(suggestedWorksheetTitle(grade: .ten, skills: []), "Grade 10 Grammar")
        XCTAssertEqual(
            suggestedWorksheetTitle(grade: .twelve, skills: [skills[0]]),
            "Grade 12: \(skills[0].name)"
        )
        let crowded = suggestedWorksheetTitle(grade: .nine, skills: Catalog.skills)
        XCTAssertTrue(crowded.hasPrefix("Grade 9:"))
        XCTAssertTrue(crowded.contains("more"))
        XCTAssertLessThanOrEqual(crowded.count, 140)
        XCTAssertFalse(crowded.localizedCaseInsensitiveContains("core"))
    }

    func testTitleStateRefreshesWhenSelectionChanges() {
        let nouns = Catalog.skill(id: "nouns")!
        let commas = Catalog.skill(id: "commas")!
        var state = WorksheetTitleState(grade: .seven, skills: [nouns, commas])
        XCTAssertTrue(state.followsSelection)
        XCTAssertTrue(state.title.hasPrefix("Grade 7:"))
        state.userEdited("Friday quiz", grade: .seven, skills: [nouns, commas])
        XCTAssertFalse(state.followsSelection)
        XCTAssertEqual(state.resolved(grade: .seven, skills: [nouns, commas]), "Friday quiz")
        state.selectionChanged(grade: .eleven, skills: [nouns])
        XCTAssertTrue(state.followsSelection)
        XCTAssertEqual(state.title, "Grade 11: \(nouns.name)")
        XCTAssertNotEqual(state.title, "Grade 7 core")
        state.userEdited("   ", grade: .eleven, skills: [nouns])
        XCTAssertEqual(state.resolved(grade: .eleven, skills: [nouns]), "Grade 11: \(nouns.name)")
    }

    func testEmptyTitleUsesGradeAndSkills() throws {
        var input = sampleInput()
        input.title = "   "
        input.grade = .ten
        input.skillIds = ["verbs"]
        let sheet = try generateWorksheet(input)
        let verbs = try XCTUnwrap(Catalog.skill(id: "verbs"))
        XCTAssertEqual(sheet.meta.title, "Grade 10: \(verbs.name)")
    }

    func testWithTitleKeepsTheQuestions() throws {
        let sheet = try generateWorksheet(sampleInput())
        let renamed = sheet.withTitle("Unit review")
        XCTAssertEqual(renamed.meta.title, "Unit review")
        XCTAssertEqual(renamed.meta.grade, sheet.meta.grade)
        let regraded = sheet.withHeader(title: "Grade 10: Nouns", grade: .ten)
        XCTAssertEqual(regraded.meta.grade, .ten)
        XCTAssertEqual(regraded.meta.title, "Grade 10: Nouns")
        XCTAssertEqual(worksheetItems(renamed).map(\.answer), worksheetItems(sheet).map(\.answer))
        XCTAssertEqual(sheet.meta.title, "Grade 7 core")
    }

    func testRejectsEmptySelectionAndBadCounts() {
        XCTAssertThrowsError(try generateWorksheet(sampleInput(skillIds: [], questionCount: 10))) { error in
            XCTAssertEqual(error as? GenerateError, .noSkills)
        }
        XCTAssertThrowsError(try generateWorksheet(sampleInput(questionCount: 4))) { error in
            XCTAssertEqual(error as? GenerateError, .questionCount)
        }
    }

    private func sampleInput(skillIds: [String]? = nil, questionCount: Int? = nil) -> GenerateInput {
        GenerateInput(
            grade: .seven,
            skillIds: skillIds ?? ["nouns", "subject-verb-agreement", "fragments", "commas", "confused-words"],
            questionCount: questionCount ?? 15,
            difficulty: .developing,
            includeDirections: true,
            title: "Grade 7 core",
            teacher: "Ms. Okonkwo",
            className: "English 7",
            date: "2026-09-29",
            seed: 42
        )
    }

    private func matches(_ regex: NSRegularExpression, _ text: String) -> Bool {
        let range = NSRange(text.startIndex..., in: text)
        return regex.firstMatch(in: text, range: range) != nil
    }
}
