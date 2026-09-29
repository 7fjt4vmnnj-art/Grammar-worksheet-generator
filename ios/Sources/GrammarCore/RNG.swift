import Foundation

/// Seedable mulberry32 generator. The same seed yields the same sequence as the web app.
public struct Rng: Sendable {
    private var state: UInt32

    public init(seed: UInt32) {
        state = seed
    }

    public mutating func next() -> Double {
        state = state &+ 0x6D2B79F5
        var t = state
        t = imul(t ^ (t >> 15), t | 1)
        t ^= t &+ imul(t ^ (t >> 7), t | 61)
        let mixed = t ^ (t >> 14)
        return Double(mixed) / 4_294_967_296
    }

    public mutating func int(_ max: Int) -> Int {
        precondition(max > 0, "int() requires a positive bound")
        return Int(next() * Double(max))
    }

    public mutating func pick<T>(_ items: [T]) -> T {
        precondition(!items.isEmpty, "Cannot pick from an empty list")
        return items[int(items.count)]
    }

    public mutating func shuffle<T>(_ items: [T]) -> [T] {
        var copy = items
        if copy.count < 2 { return copy }
        var index = copy.count - 1
        while index > 0 {
            let swapIndex = int(index + 1)
            copy.swapAt(index, swapIndex)
            index -= 1
        }
        return copy
    }

    private func imul(_ a: UInt32, _ b: UInt32) -> UInt32 {
        a &* b
    }
}
