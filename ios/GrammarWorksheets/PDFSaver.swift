#if os(macOS)
import AppKit
import GrammarCore
import UniformTypeIdentifiers

enum PDFSaver {
    @MainActor
    static func save(_ kind: DocumentKind, model: WorksheetModel) {
        guard let worksheet = model.worksheet else { return }
        let data = WorksheetPDF.render(worksheet, kind: kind)
        let filename = fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: kind)
        let panel = NSSavePanel()
        panel.allowedContentTypes = [.pdf]
        panel.canCreateDirectories = true
        panel.isExtensionHidden = false
        panel.nameFieldStringValue = filename
        panel.title = kind == .worksheet ? "Save Worksheet" : "Save Answer Key"
        panel.prompt = "Save"
        present(panel) { url in
            guard let url else { return }
            do {
                try writeFile(data, to: url)
            } catch {
                model.errorMessage = "Could not save the PDF. \(error.localizedDescription)"
            }
        }
    }

    @MainActor
    static func saveBoth(model: WorksheetModel) {
        guard let worksheet = model.worksheet else { return }
        let worksheetData = WorksheetPDF.render(worksheet, kind: .worksheet)
        let keyData = WorksheetPDF.render(worksheet, kind: .answerKey)
        let worksheetName = fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: .worksheet)
        let keyName = fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: .answerKey)
        let panel = NSOpenPanel()
        panel.canChooseFiles = false
        panel.canChooseDirectories = true
        panel.canCreateDirectories = true
        panel.prompt = "Save PDFs"
        panel.message = "Choose a folder for the worksheet and the answer key."
        present(panel) { folder in
            guard let folder else { return }
            let accessing = folder.startAccessingSecurityScopedResource()
            defer {
                if accessing { folder.stopAccessingSecurityScopedResource() }
            }
            do {
                try writeFile(worksheetData, to: folder.appendingPathComponent(worksheetName), scoped: false)
                try writeFile(keyData, to: folder.appendingPathComponent(keyName), scoped: false)
            } catch {
                model.errorMessage = "Could not save the PDFs. \(error.localizedDescription)"
            }
        }
    }

    @MainActor
    private static func present(_ panel: NSSavePanel, completion: @escaping @MainActor (URL?) -> Void) {
        let handler: (NSApplication.ModalResponse) -> Void = { response in
            let url = response == .OK ? panel.url : nil
            Task { @MainActor in
                completion(url)
            }
        }
        if let window = NSApp.keyWindow ?? NSApp.mainWindow {
            panel.beginSheetModal(for: window, completionHandler: handler)
        } else {
            panel.begin(completionHandler: handler)
        }
    }

    private static func writeFile(_ data: Data, to url: URL, scoped: Bool = true) throws {
        let accessing = scoped && url.startAccessingSecurityScopedResource()
        defer {
            if accessing { url.stopAccessingSecurityScopedResource() }
        }
        try data.write(to: url, options: .atomic)
    }
}
#endif
