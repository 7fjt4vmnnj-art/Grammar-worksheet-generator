import SwiftUI

@main
struct GrammarWorksheetsApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(Theme.moss)
        }
    }
}

struct RootView: View {
    @State private var model = WorksheetModel()
    @Environment(\.horizontalSizeClass) private var sizeClass

    var body: some View {
        @Bindable var model = model
        Group {
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
        }
        .background(Theme.paper)
    }
}
