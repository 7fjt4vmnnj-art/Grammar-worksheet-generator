import Foundation

public enum Catalog {
    public static func skill(id: String) -> Skill? {
        skills.first { $0.id == id }
    }

    public static func isRecommended(_ skill: Skill, grade: Grade) -> Bool {
        skill.gradeBands.contains(grade.band)
    }

    public static func skills(in category: CategoryId) -> [Skill] {
        skills.filter { $0.category == category }
    }
}
