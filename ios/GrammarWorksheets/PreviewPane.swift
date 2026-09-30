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
                .background(Theme.paper)
                #else
                previewScroll(worksheet)
                #endif
            } else {
                ContentUnavailableView {
                    Label("No worksheet yet", systemImage: "doc.text")
                } description: {
                    Text("Choose a grade and at least one skill, then generate. The preview and both PDFs show up here.")
                }
                .background(Theme.paper)
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
                        .foregroundStyle(Theme.muted)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Theme.mist)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .padding(.horizontal, 20)
                }
                PaperPreview(worksheet: worksheet, mode: mode)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
            }
            .padding(.top, 12)
        }
        .background(Theme.paper)
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
            saveMenu
            if exports.count == 2 {
                shareMenu
            }
        }
        .padding(.horizontal, 20)
    }

    private var saveMenu: some View {
        Menu("Save PDF") {
            Button("Worksheet PDF…") { PDFSaver.save(.worksheet, model: model) }
            Button("Answer Key PDF…") { PDFSaver.save(.answerKey, model: model) }
            Divider()
            Button("Worksheet and Answer Key…") { PDFSaver.saveBoth(model: model) }
        }
        .menuStyle(.borderedButton)
        .fixedSize()
        .accessibilityLabel("Save PDFs")
    }
    #endif

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
            #if os(macOS)
            Text("Share")
            #else
            Image(systemName: "square.and.arrow.up")
                .font(.body.weight(.semibold))
            #endif
        }
        #if os(macOS)
        .menuStyle(.borderedButton)
        .fixedSize()
        #endif
        .accessibilityLabel("Share PDFs")
    }

    private func refreshExports() {
        guard let worksheet = model.worksheet else {
            exports = []
            return
        }
        exports = [
            PDFExport(
                filename: fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: .worksheet),
                data: WorksheetPDF.render(worksheet, kind: .worksheet)
            ),
            PDFExport(
                filename: fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: .answerKey),
                data: WorksheetPDF.render(worksheet, kind: .answerKey)
            ),
        ]
    }
}

private struct PaperPreview: View {
    let worksheet: Worksheet
    let mode: PreviewMode

    private var answerKey: Bool { mode == .answerKey }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Rectangle()
                .fill(Theme.moss)
                .frame(height: 8)
                .padding(.horizontal, -28)
                .padding(.top, -28)
            HStack {
                Text(answerKey ? "ANSWER KEY" : "GRAMMAR WORKSHEET")
                    .font(.caption.weight(.semibold))
                    .tracking(1.2)
                    .foregroundStyle(Theme.moss)
                Spacer()
                Text("GRADE \(worksheet.meta.grade.rawValue)")
                    .font(.caption.weight(.semibold))
                    .tracking(1.2)
                    .foregroundStyle(Theme.moss)
            }
            Text(worksheet.meta.title)
                .font(.system(size: 28, weight: .semibold, design: .serif))
                .foregroundStyle(Theme.ink)
            Text(metaLine)
                .font(.subheadline)
                .foregroundStyle(Theme.muted)
            if answerKey {
                Text("Teacher copy. When a revision can be worded more than one way, one strong model is shown.")
                    .font(.subheadline.italic())
                    .foregroundStyle(Theme.muted)
            } else {
                Text("Name ________________________________    Period ________")
                    .font(.system(.body, design: .serif))
            }
            Rectangle()
                .fill(Theme.moss)
                .frame(height: 1.5)
            ForEach(worksheet.sections) { section in
                VStack(alignment: .leading, spacing: 10) {
                    Text(section.skillName.uppercased())
                        .font(.caption.weight(.bold))
                        .tracking(1.4)
                        .foregroundStyle(Theme.moss)
                    if worksheet.meta.includeDirections {
                        richText(section.directions)
                            .font(.system(.subheadline, design: .serif).italic())
                            .foregroundStyle(Theme.ink)
                            .padding(10)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Theme.mist)
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .stroke(Theme.rule, lineWidth: 0.6)
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
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 2))
        .shadow(color: .black.opacity(0.08), radius: 16, y: 6)
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
                    .foregroundStyle(Theme.ink)
                if let stimulus = item.stimulus {
                    richText(stimulus)
                        .font(.system(.body, design: .serif))
                        .foregroundStyle(Theme.ink)
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
                        .foregroundStyle(Theme.moss)
                    if let explanation = item.explanation {
                        richText(explanation)
                            .font(.footnote)
                            .foregroundStyle(Theme.muted)
                    }
                } else if item.choices == nil {
                    VStack(spacing: 14) {
                        ForEach(0..<item.lines, id: \.self) { _ in
                            Rectangle()
                                .fill(Theme.rule)
                                .frame(height: 1)
                        }
                    }
                    .padding(.top, 10)
                }
            }
        }
    }
}
