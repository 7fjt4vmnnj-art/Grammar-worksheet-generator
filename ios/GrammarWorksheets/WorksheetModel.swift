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
    var title = QuickStart.all[0].title
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

    var selectedInCatalogOrder: [String] {
        Catalog.skills.map(\.id).filter { selectedSkillIDs.contains($0) }
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
    }

    func toggleSkill(_ id: String) {
        if selectedSkillIDs.contains(id) {
            selectedSkillIDs.remove(id)
        } else {
            selectedSkillIDs.insert(id)
        }
    }

    func selectRecommended() {
        selectedSkillIDs = Set(
            Catalog.skills.filter { Catalog.isRecommended($0, grade: grade) }.map(\.id)
        )
        recommendedOnly = true
        category = nil
        query = ""
    }

    func clearSkills() {
        selectedSkillIDs.removeAll()
    }

    func apply(_ start: QuickStart) {
        grade = start.grade
        difficulty = start.grade.defaultDifficulty
        difficultyFollowsGrade = true
        selectedSkillIDs = Set(start.skillIDs)
        questionCount = start.questions
        title = start.title
        recommendedOnly = false
        category = nil
        query = ""
        errorMessage = nil
    }

    func generate() {
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
            title: title,
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
}
