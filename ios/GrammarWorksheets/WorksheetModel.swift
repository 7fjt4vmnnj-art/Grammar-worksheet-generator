import Foundation
import GrammarCore
import Observation

@MainActor
@Observable
final class WorksheetModel {
    var grade: Grade = .seven
    var selectedSkillIDs: Set<String> = Set(QuickStart.all[0].skillIDs)
    var questionCount = 15
    var difficulty: Difficulty = .developing
    var difficultyFollowsGrade = true
    var includeDirections = true
    var titleState = WorksheetTitleState(grade: .seven, skills: WorksheetModel.openingSkills())
    var teacher = ""
    var className = ""
    var date = Date()
    var includeDate = true
    var recommendedOnly = true
    var category: CategoryId?
    var query = ""
    var worksheet: Worksheet?
    var errorMessage: String?
    var showingPreview = false

    private static func openingSkills() -> [Skill] {
        let ids = Set(QuickStart.all[0].skillIDs)
        return Catalog.skills.filter { ids.contains($0.id) }
    }

    var selectedInCatalogOrder: [String] {
        Catalog.skills.map(\.id).filter { selectedSkillIDs.contains($0) }
    }

    var selectedSkills: [Skill] {
        selectedInCatalogOrder.compactMap { Catalog.skill(id: $0) }
    }

    /// Heading used on the preview and in the PDF. Blank typed titles fall back to the grade and skills.
    var displayTitle: String {
        titleState.resolved(grade: grade, skills: selectedSkills)
    }

    var visibleSkills: [Skill] {
        let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return Catalog.skills.filter { skill in
            if let category, skill.category != category { return false }
            let recommended = Catalog.isRecommended(skill, grade: grade)
            if recommendedOnly && !recommended && !selectedSkillIDs.contains(skill.id) {
                return false
            }
            if needle.isEmpty { return true }
            let haystack = ([skill.name, skill.summary] + skill.keywords).joined(separator: " ").lowercased()
            return haystack.contains(needle)
        }
    }

    func chooseGrade(_ next: Grade) {
        grade = next
        if difficultyFollowsGrade {
            difficulty = next.defaultDifficulty
        }
        refreshTitleForSelection()
    }

    func toggleSkill(_ id: String) {
        if selectedSkillIDs.contains(id) {
            selectedSkillIDs.remove(id)
        } else {
            selectedSkillIDs.insert(id)
        }
        refreshTitleForSelection()
    }

    func selectRecommended() {
        selectedSkillIDs = Set(
            Catalog.skills.filter { Catalog.isRecommended($0, grade: grade) }.map(\.id)
        )
        recommendedOnly = true
        category = nil
        query = ""
        refreshTitleForSelection()
    }

    func clearSkills() {
        selectedSkillIDs.removeAll()
        refreshTitleForSelection()
    }

    func apply(_ start: QuickStart) {
        grade = start.grade
        difficulty = start.grade.defaultDifficulty
        difficultyFollowsGrade = true
        selectedSkillIDs = Set(start.skillIDs)
        questionCount = start.questions
        recommendedOnly = false
        category = nil
        query = ""
        errorMessage = nil
        refreshTitleForSelection()
    }

    func setCustomTitle(_ newValue: String) {
        titleState.userEdited(newValue, grade: grade, skills: selectedSkills)
        pushTitleToWorksheet()
    }

    func generate() {
        if titleState.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            titleState.selectionChanged(grade: grade, skills: selectedSkills)
        }
        let iso: String
        if includeDate {
            let formatter = DateFormatter()
            formatter.calendar = Calendar(identifier: .gregorian)
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "yyyy-MM-dd"
            iso = formatter.string(from: date)
        } else {
            iso = ""
        }
        var seed = UInt32.random(in: 1...UInt32.max)
        if seed == 0 { seed = 1 }
        let input = GenerateInput(
            grade: grade,
            skillIds: selectedInCatalogOrder,
            questionCount: questionCount,
            difficulty: difficulty,
            includeDirections: includeDirections,
            title: displayTitle,
            teacher: teacher,
            className: className,
            date: iso,
            seed: seed
        )
        do {
            worksheet = try generateWorksheet(input)
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// The worksheet currently shown, with the live title applied so save, share, and print match the form.
    func worksheetForExport() -> Worksheet? {
        worksheet?.withHeader(title: displayTitle, grade: grade)
    }

    private func refreshTitleForSelection() {
        titleState.selectionChanged(grade: grade, skills: selectedSkills)
        pushTitleToWorksheet()
    }

    private func pushTitleToWorksheet() {
        guard let worksheet else { return }
        let next = displayTitle
        let presented = worksheet.withHeader(title: next, grade: grade)
        guard presented != worksheet else { return }
        self.worksheet = presented
    }
}
