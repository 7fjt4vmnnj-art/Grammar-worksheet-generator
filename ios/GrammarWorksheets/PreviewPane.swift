import GrammarCore
import SwiftUI
import UniformTypeIdentifiers

enum PreviewMode: String, CaseIterable, Identifiable {
    case worksheet
    case answerKey

    var id: String { rawValue }

    var title: String {
        switch self {
        case .worksheet: return "Worksheet"
        case .answerKey: return "Answer key"
        }
    }
}

struct PDFExport: Transferable {
    let filename: String
    let data: Data

    static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(exportedContentType: .pdf) { item in
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(item.filename)
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
            try item.data.write(to: url, options: .atomic)
            return SentTransferredFile(url)
        }
    }
}

struct PreviewPane: View {
    @Bindable var model: WorksheetModel
    @Environment(AppAppearance.self) private var appearance
    @State private var mode: PreviewMode = .worksheet
    @State private var exports: [PDFExport] = []

    var body: some View {
        Group {
            if let worksheet = model.worksheet {
                #if os(macOS)
                VStack(spacing: 0) {
                    macActions
                        .padding(.top, 12)
                        .padding(.bottom, 4)
                    previewScroll(worksheet)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(appearance.ui.paper)
                #else
                previewScroll(worksheet)
                #endif
            } else {
                ContentUnavailableView {
                    Label("No worksheet yet", systemImage: "doc.text")
                } description: {
                    Text("Choose a grade and at least one skill, then generate. Save, share, and print show up once the preview is ready.")
                }
                .background(appearance.ui.paper)
            }
        }
        #if os(iOS)
        .navigationTitle("Preview")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { toolbar }
        #endif
        .onAppear(perform: refreshExports)
        .onChange(of: model.worksheet) { _, _ in
            refreshExports()
        }
        .onChange(of: appearance.theme) { _, _ in
            refreshExports()
        }
    }

    private func previewScroll(_ worksheet: Worksheet) -> some View {
        ScrollView {
            VStack(spacing: 16) {
                Picker("Preview", selection: $mode) {
                    ForEach(PreviewMode.allCases) { item in
                        Text(item.title).tag(item)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 20)
                if let warning = worksheet.warning, mode == .worksheet {
                    Text(warning)
                        .font(.footnote)
                        .foregroundStyle(appearance.ui.muted)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(appearance.ui.mist)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .padding(.horizontal, 20)
                }
                PaperPreview(
                    worksheet: worksheet,
                    mode: mode,
                    title: model.displayTitle,
                    grade: model.grade
                )
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
            }
            .padding(.top, 12)
        }
        .background(appearance.ui.paper)
    }

    #if os(iOS)
    @ToolbarContentBuilder
    private var toolbar: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            HStack(spacing: 16) {
                if model.worksheet != nil {
                    Button("New questions") {
                        model.generate()
                    }
                    .font(.body.weight(.semibold))
                }
                if exports.count == 2 {
                    shareMenu
                }
            }
        }
    }
    #endif

    #if os(macOS)
    private var macActions: some View {
        HStack(spacing: 10) {
            Button("New questions") {
                model.generate()
            }
            .buttonStyle(.bordered)
            Spacer(minLength: 12)
            MacExportMenus(model: model)
        }
        .padding(.horizontal, 20)
    }
    #endif

    #if os(iOS)
    private var shareMenu: some View {
        Menu {
            ShareLink(
                item: exports[0],
                preview: SharePreview("Worksheet", icon: Image(systemName: "doc.text"))
            ) {
                Label("Worksheet PDF", systemImage: "doc.text")
            }
            ShareLink(
                item: exports[1],
                preview: SharePreview("Answer key", icon: Image(systemName: "key"))
            ) {
                Label("Answer key PDF", systemImage: "key")
            }
            ShareLink(items: exports) { item in
                SharePreview(item.filename, icon: Image(systemName: "doc.richtext"))
            } label: {
                Label("Worksheet and answer key", systemImage: "square.and.arrow.up")
            }
        } label: {
            Image(systemName: "square.and.arrow.up")
                .font(.body.weight(.semibold))
        }
        .accessibilityLabel("Share PDFs")
    }
    #endif

    private func refreshExports() {
        guard let worksheet = model.worksheet else {
            exports = []
            return
        }
        let titled = worksheet.withHeader(title: model.displayTitle, grade: model.grade)
        let colors = appearance.pdfColors
        exports = [
            PDFExport(
                filename: fileSlug(title: titled.meta.title, grade: titled.meta.grade, kind: .worksheet),
                data: WorksheetPDF.render(titled, kind: .worksheet, colors: colors)
            ),
            PDFExport(
                filename: fileSlug(title: titled.meta.title, grade: titled.meta.grade, kind: .answerKey),
                data: WorksheetPDF.render(titled, kind: .answerKey, colors: colors)
            ),
        ]
    }
}

private struct PaperPreview: View {
    let worksheet: Worksheet
    let mode: PreviewMode
    let title: String
    let grade: Grade
    @Environment(AppAppearance.self) private var appearance

    private var answerKey: Bool { mode == .answerKey }
    private var page: Palette { appearance.printable }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Rectangle()
                .fill(page.accent)
                .frame(height: 8)
                .padding(.horizontal, -28)
                .padding(.top, -28)
            HStack {
                Text(answerKey ? "ANSWER KEY" : "GRAMMAR WORKSHEET")
                    .font(.caption.weight(.semibold))
                    .tracking(1.2)
                    .foregroundStyle(page.accent)
                Spacer()
                Text("GRADE \(grade.rawValue)")
                    .font(.caption.weight(.semibold))
                    .tracking(1.2)
                    .foregroundStyle(page.accent)
            }
            Text(title)
                .font(.system(size: 28, weight: .semibold, design: .serif))
                .foregroundStyle(page.ink)
            Text(metaLine)
                .font(.subheadline)
                .foregroundStyle(page.muted)
            if answerKey {
                Text("Teacher copy. When a revision can be worded more than one way, one strong model is shown.")
                    .font(.subheadline.italic())
                    .foregroundStyle(page.muted)
            } else {
                Text("Name ________________________________    Period ________")
                    .font(.system(.body, design: .serif))
            }
            Rectangle()
                .fill(page.accent)
                .frame(height: 1.5)
            ForEach(worksheet.sections) { section in
                VStack(alignment: .leading, spacing: 10) {
                    Text(section.skillName.uppercased())
                        .font(.caption.weight(.bold))
                        .tracking(1.4)
                        .foregroundStyle(page.accent)
                    if worksheet.meta.includeDirections {
                        richText(section.directions)
                            .font(.system(.subheadline, design: .serif).italic())
                            .foregroundStyle(page.ink)
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(page.mist)
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .stroke(page.rule, lineWidth: 0.6)
                            )
                    }
                    ForEach(section.items) { item in
                        itemView(item)
                    }
                }
                .padding(.top, 8)
            }
        }
        .padding(28)
        .frame(maxWidth: 720, alignment: .leading)
        .foregroundStyle(page.ink)
        .background(page.paper)
        .clipShape(RoundedRectangle(cornerRadius: 2))
        .overlay(
            RoundedRectangle(cornerRadius: 2)
                .stroke(page.rule.opacity(0.7), lineWidth: 1)
        )
        .shadow(color: .black.opacity(appearance.theme == .dark ? 0.45 : 0.08), radius: 16, y: 6)
        .frame(maxWidth: .infinity)
    }

    private var metaLine: String {
        [
            worksheet.meta.teacher.isEmpty ? "" : "Teacher: \(worksheet.meta.teacher)",
            worksheet.meta.className.isEmpty ? "" : "Class: \(worksheet.meta.className)",
            worksheet.meta.date.isEmpty ? "" : "Date: \(worksheet.meta.date)",
            worksheet.meta.difficulty.label,
            "Seed \(worksheet.meta.seed)",
        ]
        .filter { !$0.isEmpty }
        .joined(separator: "  ·  ")
    }

    private func itemView(_ item: WorksheetItem) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text("\(item.number).")
                .font(.system(.body, design: .serif).weight(.semibold))
                .frame(width: 28, alignment: .trailing)
            VStack(alignment: .leading, spacing: 6) {
                richText(item.prompt)
                    .font(.system(.body, design: .serif))
                    .foregroundStyle(page.ink)
                if let stimulus = item.stimulus {
                    richText(stimulus)
                        .font(.system(.body, design: .serif))
                        .foregroundStyle(page.ink)
                }
                if let choices = item.choices {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(choices.enumerated()), id: \.offset) { index, choice in
                            let letter = index < 8 ? ["A", "B", "C", "D", "E", "F", "G", "H"][index] : "?"
                            HStack(alignment: .firstTextBaseline, spacing: 6) {
                                Text("\(letter).")
                                    .font(.system(.body, design: .serif).weight(.semibold))
                                richText(choice)
                                    .font(.system(.body, design: .serif))
                            }
                        }
                    }
                }
                if answerKey {
                    richText("Answer: \(item.answer)")
                        .font(.system(.body, design: .serif).weight(.semibold))
                        .foregroundStyle(page.accent)
                    if let explanation = item.explanation {
                        richText(explanation)
                            .font(.footnote)
                            .foregroundStyle(page.muted)
                    }
                } else if item.choices == nil {
                    VStack(spacing: 14) {
                        ForEach(0..<item.lines, id: \.self) { _ in
                            Rectangle()
                                .fill(page.rule)
                                .frame(height: 1)
                        }
                    }
                    .padding(.top, 10)
                }
            }
        }
    }
}
