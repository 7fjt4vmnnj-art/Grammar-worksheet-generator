import GrammarCore
import PDFKit
#if os(iOS)
import UIKit
#elseif os(macOS)
import AppKit
import CoreText
#endif

#if os(iOS)
typealias PlatformFont = UIFont
typealias PlatformColor = UIColor
#elseif os(macOS)
typealias PlatformFont = NSFont
typealias PlatformColor = NSColor
#endif

private func platformColor(red: CGFloat, green: CGFloat, blue: CGFloat, alpha: CGFloat) -> PlatformColor {
    #if os(iOS)
    UIColor(red: red, green: green, blue: blue, alpha: alpha)
    #else
    NSColor(srgbRed: red, green: green, blue: blue, alpha: alpha)
    #endif
}

struct WorksheetColors: Equatable {
    struct RGB: Equatable {
        var red: CGFloat
        var green: CGFloat
        var blue: CGFloat
    }

    var ink: RGB
    var muted: RGB
    var accent: RGB
    var rule: RGB
    var box: RGB
    var paper: RGB

    static let classic = AppearanceTheme.classic.pdfColors
}

enum WorksheetPDF {
    static func render(
        _ worksheet: Worksheet,
        kind: DocumentKind,
        colors: WorksheetColors = .classic
    ) -> Data {
        let maker = PDFMaker(worksheet: worksheet, kind: kind, colors: colors)
        let raw = maker.render()
        guard let document = PDFDocument(data: raw) else { return raw }
        let kindLabel = kind == .worksheet ? "worksheet" : "answer key"
        var attributes = document.documentAttributes ?? [:]
        attributes[PDFDocumentAttribute.titleAttribute] = "\(worksheet.meta.title) (\(kindLabel))"
        attributes[PDFDocumentAttribute.authorAttribute] = worksheet.meta.teacher.isEmpty
            ? "Grammar Worksheet Generator"
            : worksheet.meta.teacher
        attributes[PDFDocumentAttribute.subjectAttribute] = "Grade \(worksheet.meta.grade.rawValue) grammar practice"
        document.documentAttributes = attributes
        return document.dataRepresentation() ?? raw
    }
}

private final class PDFMaker {
    let worksheet: Worksheet
    let kind: DocumentKind

    let pageWidth: CGFloat = 612
    let pageHeight: CGFloat = 792
    let marginX: CGFloat = 54
    let top: CGFloat = 46
    let bottom: CGFloat = 54
    let writeInLead: CGFloat = 28
    let writeInTrail: CGFloat = 6
    let worksheetItemGap: CGFloat = 18
    let answerKeyItemGap: CGFloat = 8
    let worksheetPromptGap: CGFloat = 8
    let answerKeyPromptGap: CGFloat = 4

    var contentWidth: CGFloat { pageWidth - marginX * 2 }

    let ink: PlatformColor
    let muted: PlatformColor
    let accent: PlatformColor
    let rule: PlatformColor
    let box: PlatformColor
    let paper: PlatformColor

    private var pages: [PaintPage] = []
    private var pageIndex = 0
    private var cursor: CGFloat = 0

    init(worksheet: Worksheet, kind: DocumentKind, colors: WorksheetColors) {
        self.worksheet = worksheet
        self.kind = kind
        ink = platformColor(red: colors.ink.red, green: colors.ink.green, blue: colors.ink.blue, alpha: 1)
        muted = platformColor(red: colors.muted.red, green: colors.muted.green, blue: colors.muted.blue, alpha: 1)
        accent = platformColor(red: colors.accent.red, green: colors.accent.green, blue: colors.accent.blue, alpha: 1)
        rule = platformColor(red: colors.rule.red, green: colors.rule.green, blue: colors.rule.blue, alpha: 1)
        box = platformColor(red: colors.box.red, green: colors.box.green, blue: colors.box.blue, alpha: 1)
        paper = platformColor(red: colors.paper.red, green: colors.paper.green, blue: colors.paper.blue, alpha: 1)
    }
}

private struct PaintPage {
    var commands: [Paint] = []
}

private enum Paint {
    case text(String, CGFloat, CGFloat, PlatformFont, PlatformColor)
    case line(CGFloat, CGFloat, CGFloat, CGFloat, PlatformColor)
    case fill(CGRect, PlatformColor)
    case stroke(CGRect, PlatformColor, CGFloat)
}

extension PDFMaker {
    func render() -> Data {
        pages = []
        startPage(continuation: false)
        drawFirstHeader()
        if let warning = worksheet.warning, kind == .worksheet {
            drawParagraph(warning, font: times(.italic, 9), color: muted, lineHeight: 12)
            cursor += 6
        }
        for section in worksheet.sections {
            let directionHeight = worksheet.meta.includeDirections ? measureBox(section.directions) + 8 : 0
            ensure(16 + directionHeight + 36)
            drawTracked(section.skillName.uppercased())
            if worksheet.meta.includeDirections {
                drawBox(section.directions)
                cursor += 8
            }
            var previousPrompt: String?
            let promptGap = kind == .worksheet ? worksheetPromptGap : answerKeyPromptGap
            let itemGap = kind == .worksheet ? worksheetItemGap : answerKeyItemGap
            for item in section.items {
                if let previousPrompt, previousPrompt != item.prompt {
                    cursor += promptGap
                }
                previousPrompt = item.prompt
                drawItem(item)
                cursor += itemGap
            }
            cursor += 6
        }
        addFooters()
        #if os(iOS)
        let bounds = CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
        let renderer = UIGraphicsPDFRenderer(bounds: bounds)
        return renderer.pdfData { context in
            for page in pages {
                context.beginPage()
                for command in page.commands {
                    paint(command)
                }
            }
        }
        #else
        return renderMacPDF()
        #endif
    }

    #if os(macOS)
    private func renderMacPDF() -> Data {
        let data = NSMutableData()
        var mediaBox = CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
        guard let consumer = CGDataConsumer(data: data as CFMutableData),
              let pdf = CGContext(consumer: consumer, mediaBox: &mediaBox, nil) else {
            return Data()
        }
        for page in pages {
            pdf.beginPDFPage(nil)
            let previous = NSGraphicsContext.current
            let graphics = NSGraphicsContext(cgContext: pdf, flipped: true)
            NSGraphicsContext.current = graphics
            for command in page.commands {
                paint(command)
            }
            graphics.flushGraphics()
            NSGraphicsContext.current = previous
            pdf.endPDFPage()
        }
        pdf.closePDF()
        return data as Data
    }
    #endif

    private func startPage(continuation: Bool) {
        pages.append(PaintPage())
        pageIndex = pages.count - 1
        cursor = top
        fill(CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight), paper)
        if continuation {
            fill(CGRect(x: 0, y: 0, width: pageWidth, height: 8), accent)
            let label = fit(
                "\(kind == .answerKey ? "Answer key" : "Worksheet") · \(worksheet.meta.title) · Grade \(worksheet.meta.grade.rawValue)",
                font: helvetica(9),
                maxWidth: contentWidth
            )
            emit(label, x: marginX, top: cursor, font: helvetica(9), color: muted)
            cursor += 22
        }
    }

    private func ensure(_ height: CGFloat) {
        if cursor + height > pageHeight - bottom {
            startPage(continuation: true)
        }
    }

    private func drawFirstHeader() {
        fill(CGRect(x: 0, y: 0, width: pageWidth, height: 10), accent)
        let kicker = kind == .answerKey ? "ANSWER KEY" : "GRAMMAR WORKSHEET"
        emit(kicker, x: marginX, top: cursor, font: helveticaBold(9), color: accent)
        let grade = "Grade \(worksheet.meta.grade.rawValue)"
        let gradeWidth = width(grade, font: helveticaBold(9))
        emit(grade, x: pageWidth - marginX - gradeWidth, top: cursor, font: helveticaBold(9), color: accent)
        cursor += 20
        for line in wrapPlain(worksheet.meta.title, font: times(.bold, 18), maxWidth: contentWidth) {
            emit(line, x: marginX, top: cursor, font: times(.bold, 18), color: ink)
            cursor += 22
        }
        let meta = [
            worksheet.meta.teacher.isEmpty ? "" : "Teacher: \(worksheet.meta.teacher)",
            worksheet.meta.className.isEmpty ? "" : "Class: \(worksheet.meta.className)",
            worksheet.meta.date.isEmpty ? "" : "Date: \(worksheet.meta.date)",
            worksheet.meta.difficulty.label,
            "Seed \(worksheet.meta.seed)",
        ]
        .filter { !$0.isEmpty }
        .joined(separator: "   ·   ")
        drawParagraph(meta, font: helvetica(9), color: muted, lineHeight: 12)
        if kind == .worksheet {
            cursor += 4
            emit(
                "Name ________________________________    Period ________",
                x: marginX,
                top: cursor,
                font: times(.regular, 11),
                color: ink
            )
            cursor += 18
        } else {
            drawParagraph(
                "Teacher copy. When a revision can be worded more than one way, one strong model is shown.",
                font: times(.italic, 9),
                color: muted,
                lineHeight: 12
            )
        }
        cursor += 4
        ruleLine(y: cursor, x1: marginX, x2: pageWidth - marginX, thickness: 0.8, color: accent)
        cursor += 14
    }

    private func drawItem(_ item: WorksheetItem) {
        let promptLines = wrapRich(parseRich(item.prompt), size: 11, maxWidth: contentWidth - 22)
        let stimulusLines = item.stimulus.map { wrapRich(parseRich($0), size: 11, maxWidth: contentWidth - 22) } ?? []
        let choiceBlocks = (item.choices ?? []).map { wrapRich(parseRich($0), size: 11, maxWidth: contentWidth - 40) }
        let answerLines = kind == .answerKey
            ? wrapRich(parseRich("Answer: \(item.answer)"), size: 11, maxWidth: contentWidth - 22)
            : []
        let explanationLines = kind == .answerKey && item.explanation != nil
            ? wrapRich(parseRich(item.explanation ?? ""), size: 9, maxWidth: contentWidth - 22)
            : []
        ensure(min(120, 36))
        emit("\(item.number).", x: marginX, top: cursor, font: times(.bold, 11), color: ink)
        drawRich(promptLines, x: marginX + 22, size: 11, color: ink)
        if !stimulusLines.isEmpty {
            cursor += 2
            drawRich(stimulusLines, x: marginX + 22, size: 11, color: ink)
        }
        for (index, lines) in choiceBlocks.enumerated() {
            let letter = index < 8 ? ["A", "B", "C", "D", "E", "F", "G", "H"][index] : "?"
            ensure(max(1, CGFloat(lines.count)) * 15)
            emit("\(letter).", x: marginX + 22, top: cursor, font: times(.bold, 11), color: ink)
            drawRich(lines, x: marginX + 40, size: 11, color: ink)
        }
        if kind == .answerKey {
            cursor += 1
            drawRich(answerLines, x: marginX + 22, size: 11, color: accent)
            if !explanationLines.isEmpty {
                drawRich(explanationLines, x: marginX + 22, size: 9, color: muted)
            }
        } else if answerLineCount(type: item.type, lines: item.lines) > 0 {
            ensure(writeInLead + writeInTrail)
            cursor += writeInLead
            ruleLine(y: cursor, x1: marginX + 22, x2: pageWidth - marginX, thickness: 0.6, color: rule)
            cursor += writeInTrail
        }
    }

    private func drawTracked(_ text: String) {
        ensure(18)
        var x = marginX
        let topY = cursor
        let font = helveticaBold(9)
        for character in text {
            let piece = String(character)
            emit(piece, x: x, top: topY, font: font, color: accent)
            x += width(piece, font: font) + 0.45
        }
        cursor += 16
    }

    private func drawBox(_ text: String) {
        let font = times(.italic, 10)
        let lines = wrapPlain(text, font: font, maxWidth: contentWidth - 16)
        let height = CGFloat(lines.count) * 13 + 10
        ensure(height)
        let rect = CGRect(x: marginX, y: cursor, width: contentWidth, height: height)
        fill(rect, box)
        stroke(rect, rule, 0.6)
        var y = cursor + 8
        for line in lines {
            emit(line, x: marginX + 8, top: y, font: font, color: ink)
            y += 13
        }
        cursor += height
    }

    private func measureBox(_ text: String) -> CGFloat {
        CGFloat(wrapPlain(text, font: times(.italic, 10), maxWidth: contentWidth - 16).count) * 13 + 10
    }

    private func drawParagraph(_ text: String, font: PlatformFont, color: PlatformColor, lineHeight: CGFloat) {
        for line in wrapPlain(text, font: font, maxWidth: contentWidth) {
            ensure(lineHeight)
            emit(line, x: marginX, top: cursor, font: font, color: color)
            cursor += lineHeight
        }
    }

    private func drawRich(_ lines: [[RichSpan]], x: CGFloat, size: CGFloat, color: PlatformColor) {
        let lineHeight = size * 1.35
        for line in lines {
            ensure(lineHeight)
            var cx = x
            for span in line where !span.text.isEmpty {
                let font = times(span.style, size)
                emit(span.text, x: cx, top: cursor, font: font, color: color)
                cx += width(span.text, font: font)
            }
            cursor += lineHeight
        }
    }

    private func addFooters() {
        let total = pages.count
        let skillLine = fit(
            "Skills: \(worksheet.meta.skillNames.joined(separator: " · "))",
            font: helvetica(8),
            maxWidth: contentWidth - 90
        )
        for index in pages.indices {
            let label = "Page \(index + 1) of \(total)"
            let labelWidth = width(label, font: helvetica(8))
            pages[index].commands.append(.line(marginX, pageHeight - 40, pageWidth - marginX, 0.4, rule))
            pages[index].commands.append(
                .text(skillLine, marginX, pageHeight - 30, helvetica(8), muted)
            )
            pages[index].commands.append(
                .text(label, pageWidth - marginX - labelWidth, pageHeight - 30, helvetica(8), muted)
            )
        }
    }

    private func emit(_ text: String, x: CGFloat, top: CGFloat, font: PlatformFont, color: PlatformColor) {
        pages[pageIndex].commands.append(.text(text, x, top + font.ascender, font, color))
    }

    private func fill(_ rect: CGRect, _ color: PlatformColor) {
        pages[pageIndex].commands.append(.fill(rect, color))
    }

    private func stroke(_ rect: CGRect, _ color: PlatformColor, _ lineWidth: CGFloat) {
        pages[pageIndex].commands.append(.stroke(rect, color, lineWidth))
    }

    private func ruleLine(y: CGFloat, x1: CGFloat, x2: CGFloat, thickness: CGFloat, color: PlatformColor) {
        pages[pageIndex].commands.append(.line(x1, y, x2, thickness, color))
    }

    private func paint(_ command: Paint) {
        switch command {
        case let .text(string, x, baseline, font, color):
            paintText(string, x: x, baseline: baseline, font: font, color: color)
        case let .line(x1, y, x2, thickness, color):
            #if os(iOS)
            let path = UIBezierPath()
            path.move(to: CGPoint(x: x1, y: y))
            path.addLine(to: CGPoint(x: x2, y: y))
            path.lineWidth = thickness
            color.setStroke()
            path.stroke()
            #else
            let path = NSBezierPath()
            path.move(to: CGPoint(x: x1, y: y))
            path.line(to: CGPoint(x: x2, y: y))
            path.lineWidth = thickness
            color.setStroke()
            path.stroke()
            #endif
        case let .fill(rect, color):
            color.setFill()
            #if os(iOS)
            UIBezierPath(rect: rect).fill()
            #else
            NSBezierPath(rect: rect).fill()
            #endif
        case let .stroke(rect, color, lineWidth):
            #if os(iOS)
            let path = UIBezierPath(rect: rect)
            path.lineWidth = lineWidth
            color.setStroke()
            path.stroke()
            #else
            let path = NSBezierPath(rect: rect)
            path.lineWidth = lineWidth
            color.setStroke()
            path.stroke()
            #endif
        }
    }

    private func paintText(_ string: String, x: CGFloat, baseline: CGFloat, font: PlatformFont, color: PlatformColor) {
        #if os(iOS)
        (string as NSString).draw(
            at: CGPoint(x: x, y: baseline),
            withAttributes: [.font: font, .foregroundColor: color]
        )
        #else
        guard let context = NSGraphicsContext.current?.cgContext else { return }
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: color,
            NSAttributedString.Key(rawValue: (kCTForegroundColorAttributeName as NSString) as String): color.cgColor,
        ]
        let line = CTLineCreateWithAttributedString(NSAttributedString(string: string, attributes: attributes))
        context.saveGState()
        context.textMatrix = .identity
        context.translateBy(x: x, y: baseline)
        context.scaleBy(x: 1, y: -1)
        context.setFillColor(color.cgColor)
        CTLineDraw(line, context)
        context.restoreGState()
        #endif
    }

    private func times(_ style: RichStyle, _ size: CGFloat) -> PlatformFont {
        let name: String
        let weight: PlatformFont.Weight
        switch style {
        case .regular:
            name = "TimesNewRomanPSMT"
            weight = .regular
        case .bold:
            name = "TimesNewRomanPS-BoldMT"
            weight = .bold
        case .italic:
            name = "TimesNewRomanPS-ItalicMT"
            weight = .regular
        case .boldItalic:
            name = "TimesNewRomanPS-BoldItalicMT"
            weight = .bold
        }
        let font = PlatformFont(name: name, size: size) ?? PlatformFont.systemFont(ofSize: size, weight: weight)
        if style == .italic || style == .boldItalic, PlatformFont(name: name, size: size) == nil {
            return font.withTraitsItalic() ?? font
        }
        return font
    }

    private func helvetica(_ size: CGFloat) -> PlatformFont {
        PlatformFont(name: "Helvetica", size: size) ?? PlatformFont.systemFont(ofSize: size)
    }

    private func helveticaBold(_ size: CGFloat) -> PlatformFont {
        PlatformFont(name: "Helvetica-Bold", size: size) ?? PlatformFont.systemFont(ofSize: size, weight: .bold)
    }

    private func width(_ text: String, font: PlatformFont) -> CGFloat {
        (text as NSString).size(withAttributes: [.font: font]).width
    }

    private func wrapPlain(_ text: String, font: PlatformFont, maxWidth: CGFloat) -> [String] {
        var lines: [String] = []
        for paragraph in text.split(separator: "\n", omittingEmptySubsequences: false) {
            let words = paragraph.split(whereSeparator: { $0.isWhitespace }).map(String.init)
            var current = ""
            for word in words {
                let next = current.isEmpty ? word : "\(current) \(word)"
                if width(next, font: font) <= maxWidth {
                    current = next
                    continue
                }
                if !current.isEmpty { lines.append(current) }
                current = chunk(word, font: font, maxWidth: maxWidth, into: &lines)
            }
            if !current.isEmpty { lines.append(current) }
            if words.isEmpty { lines.append("") }
        }
        return lines.isEmpty ? [""] : lines
    }

    private func chunk(_ word: String, font: PlatformFont, maxWidth: CGFloat, into lines: inout [String]) -> String {
        if width(word, font: font) <= maxWidth { return word }
        var piece = ""
        for character in word {
            let next = piece + String(character)
            if width(next, font: font) > maxWidth && !piece.isEmpty {
                lines.append(piece)
                piece = String(character)
            } else {
                piece = next
            }
        }
        return piece
    }

    private func wrapRich(_ spans: [RichSpan], size: CGFloat, maxWidth: CGFloat) -> [[RichSpan]] {
        struct Token {
            let text: String
            let style: RichStyle
            let kind: Kind
            enum Kind { case word, space, lineBreak }
        }
        var tokens: [Token] = []
        for span in spans {
            let pieces = span.text.components(separatedBy: "\n")
            for (index, piece) in pieces.enumerated() {
                if index > 0 { tokens.append(Token(text: "", style: span.style, kind: .lineBreak)) }
                var word = ""
                func flushWord() {
                    if !word.isEmpty {
                        tokens.append(Token(text: word, style: span.style, kind: .word))
                        word = ""
                    }
                }
                for character in piece {
                    if character.isWhitespace {
                        flushWord()
                        tokens.append(Token(text: " ", style: span.style, kind: .space))
                    } else {
                        word.append(character)
                    }
                }
                flushWord()
            }
        }
        var lines: [[RichSpan]] = []
        var current: [RichSpan] = []
        var used: CGFloat = 0
        func pushLine() {
            lines.append(current.isEmpty ? [RichSpan(text: "", style: .regular)] : current)
            current = []
            used = 0
        }
        for token in tokens {
            if token.kind == .lineBreak {
                pushLine()
                continue
            }
            let font = times(token.style, size)
            let tokenWidth = width(token.text, font: font)
            if token.kind == .space {
                if used > 0 && used + tokenWidth <= maxWidth {
                    current.append(RichSpan(text: " ", style: token.style))
                    used += tokenWidth
                }
                continue
            }
            if tokenWidth > maxWidth {
                if used > 0 { pushLine() }
                var piece = ""
                for character in token.text {
                    let next = piece + String(character)
                    if width(next, font: font) > maxWidth && !piece.isEmpty {
                        current.append(RichSpan(text: piece, style: token.style))
                        pushLine()
                        piece = String(character)
                    } else {
                        piece = next
                    }
                }
                if !piece.isEmpty {
                    current.append(RichSpan(text: piece, style: token.style))
                    used = width(piece, font: font)
                }
                continue
            }
            if used + tokenWidth > maxWidth && used > 0 { pushLine() }
            current.append(RichSpan(text: token.text, style: token.style))
            used += tokenWidth
        }
        if !current.isEmpty { pushLine() }
        return lines.isEmpty ? [[RichSpan(text: "", style: .regular)]] : lines
    }

    private func fit(_ text: String, font: PlatformFont, maxWidth: CGFloat) -> String {
        if width(text, font: font) <= maxWidth { return text }
        var trimmed = text
        while !trimmed.isEmpty && width(trimmed + "…", font: font) > maxWidth {
            trimmed.removeLast()
        }
        return trimmed.trimmingCharacters(in: .whitespaces) + "…"
    }
}

#if os(iOS)
private extension UIFont {
    func withTraitsItalic() -> UIFont? {
        guard let descriptor = fontDescriptor.withSymbolicTraits(.traitItalic) else { return nil }
        return UIFont(descriptor: descriptor, size: pointSize)
    }
}
#elseif os(macOS)
private extension NSFont {
    func withTraitsItalic() -> NSFont? {
        let descriptor = fontDescriptor.withSymbolicTraits(.italic)
        return NSFont(descriptor: descriptor, size: pointSize)
    }
}
#endif
