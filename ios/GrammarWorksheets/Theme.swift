import GrammarCore
import SwiftUI

struct RGB: Equatable {
    var red: Double
    var green: Double
    var blue: Double

    var color: Color {
        Color(red: red, green: green, blue: blue)
    }

    var components: WorksheetColors.RGB {
        WorksheetColors.RGB(red: CGFloat(red), green: CGFloat(green), blue: CGFloat(blue))
    }
}

struct Swatch: Equatable {
    var ink: RGB
    var accent: RGB
    var paper: RGB
    var card: RGB
    var rule: RGB
    var mist: RGB
    var muted: RGB
    var accentFill: RGB
    var onAccent: RGB
    var error: RGB
}

struct Palette: Equatable {
    var ink: Color
    var accent: Color
    var paper: Color
    var card: Color
    var rule: Color
    var mist: Color
    var muted: Color
    var accentFill: Color
    var onAccent: Color
    var error: Color

    init(_ swatch: Swatch) {
        ink = swatch.ink.color
        accent = swatch.accent.color
        paper = swatch.paper.color
        card = swatch.card.color
        rule = swatch.rule.color
        mist = swatch.mist.color
        muted = swatch.muted.color
        accentFill = swatch.accentFill.color
        onAccent = swatch.onAccent.color
        error = swatch.error.color
    }
}

enum AppearanceTheme: String, CaseIterable, Identifiable {
    case classic
    case pastel
    case contrast
    case dark

    var id: String { rawValue }

    var title: String {
        switch self {
        case .classic: return "Classic"
        case .pastel: return "Soft pastel"
        case .contrast: return "High contrast"
        case .dark: return "Dark"
        }
    }

    var detail: String {
        switch self {
        case .classic: return "Warm paper, easy to print"
        case .pastel: return "Lavender workspace, light page"
        case .contrast: return "Black text and strong lines"
        case .dark: return "Dark workspace, light page"
        }
    }

    var preferredColorScheme: ColorScheme {
        self == .dark ? .dark : .light
    }

    var uiSwatch: Swatch {
        switch self {
        case .classic:
            return Swatch(
                ink: RGB(red: 0.11, green: 0.10, blue: 0.08),
                accent: RGB(red: 0.12, green: 0.30, blue: 0.22),
                paper: RGB(red: 0.96, green: 0.945, blue: 0.91),
                card: RGB(red: 1, green: 1, blue: 1),
                rule: RGB(red: 0.72, green: 0.66, blue: 0.56),
                mist: RGB(red: 0.965, green: 0.955, blue: 0.935),
                muted: RGB(red: 0.34, green: 0.31, blue: 0.27),
                accentFill: RGB(red: 0.12, green: 0.30, blue: 0.22),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.55, green: 0.16, blue: 0.12)
            )
        case .pastel:
            return Swatch(
                ink: RGB(red: 0.23, green: 0.18, blue: 0.30),
                accent: RGB(red: 0.40, green: 0.32, blue: 0.62),
                paper: RGB(red: 0.95, green: 0.93, blue: 0.98),
                card: RGB(red: 0.99, green: 0.97, blue: 1),
                rule: RGB(red: 0.78, green: 0.72, blue: 0.88),
                mist: RGB(red: 0.93, green: 0.90, blue: 0.97),
                muted: RGB(red: 0.42, green: 0.36, blue: 0.52),
                accentFill: RGB(red: 0.40, green: 0.32, blue: 0.62),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.62, green: 0.22, blue: 0.28)
            )
        case .contrast:
            return Swatch(
                ink: RGB(red: 0, green: 0, blue: 0),
                accent: RGB(red: 0, green: 0.20, blue: 0.58),
                paper: RGB(red: 0.97, green: 0.97, blue: 0.97),
                card: RGB(red: 1, green: 1, blue: 1),
                rule: RGB(red: 0, green: 0, blue: 0),
                mist: RGB(red: 0.93, green: 0.93, blue: 0.93),
                muted: RGB(red: 0.15, green: 0.15, blue: 0.15),
                accentFill: RGB(red: 0, green: 0, blue: 0),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.70, green: 0, blue: 0)
            )
        case .dark:
            return Swatch(
                ink: RGB(red: 0.94, green: 0.93, blue: 0.90),
                accent: RGB(red: 0.64, green: 0.84, blue: 0.72),
                paper: RGB(red: 0.11, green: 0.12, blue: 0.13),
                card: RGB(red: 0.18, green: 0.19, blue: 0.21),
                rule: RGB(red: 0.38, green: 0.40, blue: 0.42),
                mist: RGB(red: 0.23, green: 0.24, blue: 0.26),
                muted: RGB(red: 0.73, green: 0.71, blue: 0.67),
                accentFill: RGB(red: 0.24, green: 0.50, blue: 0.38),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.95, green: 0.55, blue: 0.48)
            )
        }
    }

    /// Light page colors used for the on-screen worksheet and for PDFs, including when the workspace is dark.
    var printableSwatch: Swatch {
        switch self {
        case .classic, .dark:
            return Swatch(
                ink: RGB(red: 0.11, green: 0.10, blue: 0.08),
                accent: RGB(red: 0.12, green: 0.30, blue: 0.22),
                paper: RGB(red: 1, green: 1, blue: 1),
                card: RGB(red: 1, green: 1, blue: 1),
                rule: RGB(red: 0.72, green: 0.66, blue: 0.56),
                mist: RGB(red: 0.965, green: 0.955, blue: 0.935),
                muted: RGB(red: 0.34, green: 0.31, blue: 0.27),
                accentFill: RGB(red: 0.12, green: 0.30, blue: 0.22),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.55, green: 0.16, blue: 0.12)
            )
        case .pastel:
            return Swatch(
                ink: RGB(red: 0.18, green: 0.15, blue: 0.26),
                accent: RGB(red: 0.33, green: 0.26, blue: 0.52),
                paper: RGB(red: 0.99, green: 0.985, blue: 1),
                card: RGB(red: 1, green: 1, blue: 1),
                rule: RGB(red: 0.75, green: 0.70, blue: 0.84),
                mist: RGB(red: 0.95, green: 0.93, blue: 0.98),
                muted: RGB(red: 0.36, green: 0.32, blue: 0.46),
                accentFill: RGB(red: 0.33, green: 0.26, blue: 0.52),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.55, green: 0.16, blue: 0.22)
            )
        case .contrast:
            return Swatch(
                ink: RGB(red: 0, green: 0, blue: 0),
                accent: RGB(red: 0, green: 0.18, blue: 0.55),
                paper: RGB(red: 1, green: 1, blue: 1),
                card: RGB(red: 1, green: 1, blue: 1),
                rule: RGB(red: 0, green: 0, blue: 0),
                mist: RGB(red: 0.94, green: 0.94, blue: 0.94),
                muted: RGB(red: 0.12, green: 0.12, blue: 0.12),
                accentFill: RGB(red: 0, green: 0, blue: 0),
                onAccent: RGB(red: 1, green: 1, blue: 1),
                error: RGB(red: 0.70, green: 0, blue: 0)
            )
        }
    }

    var pdfColors: WorksheetColors {
        let page = printableSwatch
        return WorksheetColors(
            ink: page.ink.components,
            muted: page.muted.components,
            accent: page.accent.components,
            rule: page.rule.components,
            box: page.mist.components,
            paper: page.paper.components
        )
    }
}

@MainActor
@Observable
final class AppAppearance {
    static let shared = AppAppearance()
    private static let storageKey = "grammarWorksheets.appearance"

    var theme: AppearanceTheme {
        didSet {
            UserDefaults.standard.set(theme.rawValue, forKey: Self.storageKey)
        }
    }

    var ui: Palette { Palette(theme.uiSwatch) }
    var printable: Palette { Palette(theme.printableSwatch) }
    var pdfColors: WorksheetColors { theme.pdfColors }

    private init() {
        let stored = UserDefaults.standard.string(forKey: Self.storageKey) ?? ""
        theme = AppearanceTheme(rawValue: stored) ?? .classic
    }
}

struct SectionLabel: View {
    @Environment(AppAppearance.self) private var appearance
    let title: String

    var body: some View {
        Text(title.uppercased())
            .font(.caption.weight(.semibold))
            .tracking(1.1)
            .foregroundStyle(appearance.ui.accent)
    }
}

struct Card<Content: View>: View {
    @Environment(AppAppearance.self) private var appearance
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(appearance.ui.card)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(appearance.ui.rule.opacity(0.7), lineWidth: 1)
            )
    }
}

struct AppearancePicker: View {
    @Environment(AppAppearance.self) private var appearance

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title: "Appearance")
            Text("Colors the workspace. The worksheet page and PDFs stay light so they remain easy to read on paper.")
                .font(.footnote)
                .foregroundStyle(appearance.ui.muted)
                .fixedSize(horizontal: false, vertical: true)
            VStack(spacing: 8) {
                HStack(spacing: 8) {
                    themeCard(.classic)
                    themeCard(.pastel)
                }
                HStack(spacing: 8) {
                    themeCard(.contrast)
                    themeCard(.dark)
                }
            }
        }
    }

    private func themeCard(_ theme: AppearanceTheme) -> some View {
        let selected = appearance.theme == theme
        let preview = Palette(theme.uiSwatch)
        return Button {
            appearance.theme = theme
        } label: {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 6) {
                    swatchDot(preview.paper, border: preview.rule)
                    swatchDot(preview.accentFill, border: preview.accentFill)
                    swatchDot(preview.ink, border: preview.ink)
                    Spacer(minLength: 0)
                    if selected {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(preview.accent)
                            .accessibilityHidden(true)
                    }
                }
                Text(theme.title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(preview.ink)
                Text(theme.detail)
                    .font(.caption)
                    .foregroundStyle(preview.muted)
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(12)
            .frame(maxWidth: .infinity, minHeight: 108, alignment: .topLeading)
            .background(preview.paper)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(selected ? appearance.ui.accentFill : preview.rule, lineWidth: selected ? 2.5 : 1)
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(theme.title). \(theme.detail)")
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func swatchDot(_ fill: Color, border: Color) -> some View {
        Circle()
            .fill(fill)
            .frame(width: 16, height: 16)
            .overlay(Circle().stroke(border, lineWidth: 1))
    }
}

struct AppearanceMenu: View {
    @Environment(AppAppearance.self) private var appearance

    var body: some View {
        Menu {
            Picker("Appearance", selection: Binding(
                get: { appearance.theme },
                set: { appearance.theme = $0 }
            )) {
                ForEach(AppearanceTheme.allCases) { theme in
                    Text(theme.title).tag(theme)
                }
            }
            .pickerStyle(.inline)
        } label: {
            Label("Appearance", systemImage: "paintpalette")
        }
        .help("Choose a color scheme")
        .accessibilityLabel("Appearance")
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
