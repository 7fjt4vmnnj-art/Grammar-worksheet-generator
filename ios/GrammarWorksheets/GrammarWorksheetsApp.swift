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

    var body: some Commands {
        CommandGroup(replacing: .saveItem) {
            Button("Save Worksheet PDF…") {
                guard let model else { return }
                PDFSaver.save(.worksheet, model: model)
            }
            .keyboardShortcut("s", modifiers: .command)
            .disabled(model?.worksheet == nil)

            Button("Save Answer Key PDF…") {
                guard let model else { return }
                PDFSaver.save(.answerKey, model: model)
            }
            .keyboardShortcut("s", modifiers: [.command, .shift])
            .disabled(model?.worksheet == nil)

            Button("Save Both PDFs…") {
                guard let model else { return }
                PDFSaver.saveBoth(model: model)
            }
            .keyboardShortcut("s", modifiers: [.command, .option])
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
#endif

@main
struct GrammarWorksheetsApp: App {
    var body: some Scene {
        #if os(macOS)
        WindowGroup {
            RootView()
                .tint(Theme.moss)
        }
        .defaultSize(width: 1180, height: 800)
        .commands {
            WorksheetCommands()
        }
        #else
        WindowGroup {
            RootView()
                .tint(Theme.moss)
        }
        #endif
    }
}

struct RootView: View {
    @State private var model = WorksheetModel()
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
        .background(Theme.paper)
        #if os(macOS)
        .navigationTitle("Grammar Worksheets")
        .focusedSceneValue(\.worksheetModel, model)
        #endif
    }
}
