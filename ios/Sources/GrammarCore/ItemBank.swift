import Foundation

struct BankItem: Decodable, Sendable {
    let patternId: String
    let order: Int
    let type: ItemType
    let prompt: String
    let stimulus: String?
    let choices: [String]?
    let lines: Int
    let answer: String
    let explanation: String?
    let key: String
}

private struct BankFile: Decodable {
    let version: Int
    let items: [String: [String: [BankItem]]]
}

enum ItemBank {
    static let version: Int = storage.version

    static func items(skillId: String, difficulty: Difficulty) -> [BankItem] {
        storage.items[skillId]?[difficulty.rawValue] ?? []
    }

    private static let storage: BankFile = {
        guard let url = Bundle.module.url(forResource: "item-bank", withExtension: "json") else {
            fatalError("item-bank.json is missing from the GrammarCore bundle.")
        }
        do {
            let data = try Data(contentsOf: url)
            let file = try JSONDecoder().decode(BankFile.self, from: data)
            if file.version != 1 {
                fatalError("Unsupported item bank version \(file.version).")
            }
            var unique: [String: [String: [BankItem]]] = [:]
            for (skillId, difficulties) in file.items {
                var byDifficulty: [String: [BankItem]] = [:]
                for (difficulty, items) in difficulties {
                    byDifficulty[difficulty] = dedupe(items)
                }
                unique[skillId] = byDifficulty
            }
            return BankFile(version: file.version, items: unique)
        } catch {
            fatalError("Could not read item-bank.json: \(error)")
        }
    }()

    /// The harvester can store the same sentence twice under different keys.
    /// Keep the first copy so a worksheet never repeats a question.
    private static func dedupe(_ items: [BankItem]) -> [BankItem] {
        var seen = Set<String>()
        return items.filter { item in
            let choices = (item.choices ?? []).joined(separator: "\u{1f}")
            let fingerprint = [item.prompt, item.stimulus ?? "", item.answer, choices].joined(separator: "\u{1e}")
            return seen.insert(fingerprint).inserted
        }
    }
}
