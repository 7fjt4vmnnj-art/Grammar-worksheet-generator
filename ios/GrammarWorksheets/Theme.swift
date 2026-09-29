import GrammarCore
import SwiftUI

enum Theme {
    static let ink = Color(red: 0.11, green: 0.10, blue: 0.08)
    static let moss = Color(red: 0.12, green: 0.30, blue: 0.22)
    static let paper = Color(red: 0.96, green: 0.945, blue: 0.91)
    static let card = Color.white
    static let rule = Color(red: 0.72, green: 0.66, blue: 0.56)
    static let mist = Color(red: 0.965, green: 0.955, blue: 0.935)
    static let muted = Color(red: 0.34, green: 0.31, blue: 0.27)
}

struct SectionLabel: View {
    let title: String

    var body: some View {
        Text(title.uppercased())
            .font(.caption.weight(.semibold))
            .tracking(1.1)
            .foregroundStyle(Theme.moss)
    }
}

struct Card<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(Theme.rule.opacity(0.7), lineWidth: 1)
            )
    }
}

func richText(_ source: String) -> Text {
    var result = Text(verbatim: "")
    for span in parseRich(source) {
        var piece = Text(verbatim: span.text)
        switch span.style {
        case .bold:
            piece = piece.bold()
        case .italic:
            piece = piece.italic()
        case .boldItalic:
            piece = piece.bold().italic()
        case .regular:
            break
        }
        result = result + piece
    }
    return result
}
