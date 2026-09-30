import SwiftUI

#if os(macOS)
struct WorksheetModelKey: FocusedValueKey {
    typealias Value = WorksheetModel
}

extension FocusedValues {
    var worksheetModel: WorksheetModel? {
        get { self[WorksheetModelKey.self] }
        set { self[WorksheetModelKey.self] = newValue }
    }
}

private struct WorksheetCommands: Commands {
    @FocusedValue(\.worksheetModel) private var model

    private var colors: WorksheetColors { AppAppearance.shared.pdfColors }

    var body: some Commands {
        CommandGroup(replacing: .saveItem) {
            Button("Save Worksheet PDF…") {
                guard let model else { return }
                PDFSaver.save(.worksheet, model: model, colors: colors)
            }
            .keyboardShortcut("s", modifiers: .command)
            .disabled(model?.worksheet == nil)

            Button("Save Answer Key PDF…") {
                guard let model else { return }
                PDFSaver.save(.answerKey, model: model, colors: colors)
            }
            .keyboardShortcut("s", modifiers: [.command, .shift])
            .disabled(model?.worksheet == nil)

            Button("Save Both PDFs…") {
                guard let model else { return }
                PDFSaver.saveBoth(model: model, colors: colors)
            }
            .keyboardShortcut("s", modifiers: [.command, .option])
            .disabled(model?.worksheet == nil)
        }

        CommandGroup(replacing: .printItem) {
            Button("Print Worksheet…") {
                guard let model else { return }
                PDFSaver.printDocuments([.worksheet], model: model, colors: colors)
            }
            .keyboardShortcut("p", modifiers: .command)
            .disabled(model?.worksheet == nil)

            Button("Print Answer Key…") {
                guard let model else { return }
                PDFSaver.printDocuments([.answerKey], model: model, colors: colors)
            }
            .keyboardShortcut("p", modifiers: [.command, .shift])
            .disabled(model?.worksheet == nil)

            Button("Print Worksheet and Answer Key…") {
                guard let model else { return }
                PDFSaver.printDocuments([.worksheet, .answerKey], model: model, colors: colors)
            }
            .keyboardShortcut("p", modifiers: [.command, .option])
            .disabled(model?.worksheet == nil)
        }

        CommandGroup(after: .printItem) {
            Button("Share Worksheet…") {
                guard let model else { return }
                PDFSaver.share([.worksheet], model: model, colors: colors)
            }
            .disabled(model?.worksheet == nil)

            Button("Share Answer Key…") {
                guard let model else { return }
                PDFSaver.share([.answerKey], model: model, colors: colors)
            }
            .disabled(model?.worksheet == nil)

            Button("Share Worksheet and Answer Key…") {
                guard let model else { return }
                PDFSaver.share([.worksheet, .answerKey], model: model, colors: colors)
            }
            .disabled(model?.worksheet == nil)
        }

        CommandMenu("Worksheet") {
            Button("Generate Worksheet") {
                model?.generate()
            }
            .keyboardShortcut(.return, modifiers: .command)
            .disabled(model?.selectedSkillIDs.isEmpty ?? true)

            Button("New Questions") {
                model?.generate()
            }
            .keyboardShortcut("n", modifiers: [.command, .shift])
            .disabled(model?.worksheet == nil)
        }
    }
}

struct MacExportMenus: View {
    var model: WorksheetModel
    @Environment(AppAppearance.self) private var appearance

    var body: some View {
        HStack(spacing: 8) {
            saveMenu
            shareMenu
            printMenu
        }
    }

    private var saveMenu: some View {
        Menu {
            Button("Worksheet PDF…") { PDFSaver.save(.worksheet, model: model, colors: appearance.pdfColors) }
            Button("Answer Key PDF…") { PDFSaver.save(.answerKey, model: model, colors: appearance.pdfColors) }
            Divider()
            Button("Worksheet and Answer Key…") { PDFSaver.saveBoth(model: model, colors: appearance.pdfColors) }
        } label: {
            Label("Save PDF", systemImage: "square.and.arrow.down")
        }
        .menuStyle(.borderedButton)
        .fixedSize()
        .disabled(model.worksheet == nil)
        .help(model.worksheet == nil ? "Generate a worksheet first" : "Save the worksheet and answer key as PDFs")
        .accessibilityLabel("Save PDFs")
    }

    private var shareMenu: some View {
        Menu {
            Button("Worksheet") { PDFSaver.share([.worksheet], model: model, colors: appearance.pdfColors) }
            Button("Answer Key") { PDFSaver.share([.answerKey], model: model, colors: appearance.pdfColors) }
            Divider()
            Button("Worksheet and Answer Key") {
                PDFSaver.share([.worksheet, .answerKey], model: model, colors: appearance.pdfColors)
            }
        } label: {
            Label("Share", systemImage: "square.and.arrow.up")
        }
        .menuStyle(.borderedButton)
        .fixedSize()
        .disabled(model.worksheet == nil)
        .help(model.worksheet == nil ? "Generate a worksheet first" : "Share the worksheet or answer key")
        .accessibilityLabel("Share PDFs")
    }

    private var printMenu: some View {
        Menu {
            Button("Worksheet…") { PDFSaver.printDocuments([.worksheet], model: model, colors: appearance.pdfColors) }
            Button("Answer Key…") { PDFSaver.printDocuments([.answerKey], model: model, colors: appearance.pdfColors) }
            Divider()
            Button("Worksheet and Answer Key…") {
                PDFSaver.printDocuments([.worksheet, .answerKey], model: model, colors: appearance.pdfColors)
            }
        } label: {
            Label("Print", systemImage: "printer")
        }
        .menuStyle(.borderedButton)
        .fixedSize()
        .disabled(model.worksheet == nil)
        .help(model.worksheet == nil ? "Generate a worksheet first" : "Print the worksheet or answer key")
        .accessibilityLabel("Print PDFs")
    }
}

#endif

@main
struct GrammarWorksheetsApp: App {
    var body: some Scene {
        #if os(macOS)
        WindowGroup {
            RootView()
                .environment(AppAppearance.shared)
        }
        .defaultSize(width: 1180, height: 800)
        .commands {
            WorksheetCommands()
        }
        #else
        WindowGroup {
            RootView()
                .environment(AppAppearance.shared)
        }
        #endif
    }
}

struct RootView: View {
    @State private var model = WorksheetModel()
    @Environment(AppAppearance.self) private var appearance
    #if os(iOS)
    @Environment(\.horizontalSizeClass) private var sizeClass
    #endif

    var body: some View {
        @Bindable var model = model
        Group {
            #if os(macOS)
            HStack(spacing: 0) {
                BuilderView(model: model, presentsPreview: false)
                    .frame(minWidth: 360, idealWidth: 420, maxWidth: 480)
                Divider()
                PreviewPane(model: model)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .frame(minWidth: 980, minHeight: 640)
            #else
            if sizeClass == .regular {
                HStack(spacing: 0) {
                    BuilderView(model: model, presentsPreview: false)
                        .frame(width: 420)
                    Divider()
                    PreviewPane(model: model)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            } else {
                NavigationStack {
                    BuilderView(model: model, presentsPreview: true)
                        .navigationDestination(isPresented: $model.showingPreview) {
                            PreviewPane(model: model)
                        }
                }
            }
            #endif
        }
        .background(appearance.ui.paper)
        .tint(appearance.ui.accentFill)
        .preferredColorScheme(appearance.theme.preferredColorScheme)
        #if os(macOS)
        .navigationTitle("Grammar Worksheets")
        .navigationSubtitle(model.displayTitle)
        .focusedSceneValue(\.worksheetModel, model)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                AppearanceMenu()
            }
            ToolbarItemGroup(placement: .primaryAction) {
                MacExportMenus(model: model)
            }
        }
        #endif
    }
}
