import Foundation

public enum RichStyle: String, Sendable {
    case regular
    case bold
    case italic
    case boldItalic
}

public struct RichSpan: Equatable, Sendable {
    public let text: String
    public let style: RichStyle

    public init(text: String, style: RichStyle) {
        self.text = text
        self.style = style
    }
}

/// Lightweight markup: *italics* and **bold**.
public func parseRich(_ input: String) -> [RichSpan] {
    let pattern = #"\*\*([^*]+)\*\*|\*([^*]+)\*"#
    guard let regex = try? NSRegularExpression(pattern: pattern) else {
        return [RichSpan(text: input, style: .regular)]
    }
    let range = NSRange(input.startIndex..., in: input)
    let matches = regex.matches(in: input, range: range)
    var spans: [RichSpan] = []
    var cursor = input.startIndex
    for match in matches {
        guard let full = Range(match.range, in: input) else { continue }
        if cursor < full.lowerBound {
            spans.append(RichSpan(text: String(input[cursor..<full.lowerBound]), style: .regular))
        }
        if match.range(at: 1).location != NSNotFound, let bold = Range(match.range(at: 1), in: input) {
            spans.append(RichSpan(text: String(input[bold]), style: .bold))
        } else if match.range(at: 2).location != NSNotFound, let italic = Range(match.range(at: 2), in: input) {
            spans.append(RichSpan(text: String(input[italic]), style: .italic))
        }
        cursor = full.upperBound
    }
    if cursor < input.endIndex {
        spans.append(RichSpan(text: String(input[cursor...]), style: .regular))
    }
    if spans.isEmpty {
        spans.append(RichSpan(text: "", style: .regular))
    }
    return spans
}
