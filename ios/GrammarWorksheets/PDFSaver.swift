#if os(macOS)
import AppKit
import GrammarCore
import PDFKit
import UniformTypeIdentifiers

enum PDFSaver {
    @MainActor
    static func save(_ kind: DocumentKind, model: WorksheetModel, colors: WorksheetColors) {
        guard let worksheet = model.worksheetForExport() else { return }
        let data = WorksheetPDF.render(worksheet, kind: kind, colors: colors)
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
    static func saveBoth(model: WorksheetModel, colors: WorksheetColors) {
        guard let worksheet = model.worksheetForExport() else { return }
        let worksheetData = WorksheetPDF.render(worksheet, kind: .worksheet, colors: colors)
        let keyData = WorksheetPDF.render(worksheet, kind: .answerKey, colors: colors)
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
    static func printDocuments(_ kinds: [DocumentKind], model: WorksheetModel, colors: WorksheetColors) {
        guard let worksheet = model.worksheetForExport() else { return }
        guard let document = makeDocument(worksheet, kinds: kinds, colors: colors) else {
            model.errorMessage = "Could not prepare the PDF for printing."
            return
        }
        let info = (NSPrintInfo.shared.copy() as? NSPrintInfo) ?? NSPrintInfo()
        info.horizontalPagination = .fit
        info.verticalPagination = .automatic
        info.isHorizontallyCentered = true
        info.isVerticallyCentered = true
        info.orientation = .portrait
        info.paperSize = NSSize(width: 612, height: 792)
        info.topMargin = 12
        info.bottomMargin = 12
        info.leftMargin = 12
        info.rightMargin = 12
        info.jobDisposition = .spool
        guard let operation = document.printOperation(for: info, scalingMode: .pageScaleToFit, autoRotate: false) else {
            model.errorMessage = "Printing is not available."
            return
        }
        operation.jobTitle = jobTitle(for: kinds, worksheet: worksheet)
        operation.showsPrintPanel = true
        operation.showsProgressPanel = true
        if let window = hostWindow() {
            operation.runModal(for: window, delegate: nil, didRun: nil, contextInfo: nil)
        } else {
            operation.run()
        }
    }

    @MainActor
    static func share(_ kinds: [DocumentKind], model: WorksheetModel, colors: WorksheetColors) {
        guard let worksheet = model.worksheetForExport() else { return }
        do {
            let urls = try exportURLs(worksheet, kinds: kinds, colors: colors)
            let picker = NSSharingServicePicker(items: urls)
            guard let view = shareAnchorView() else {
                model.errorMessage = "Could not open the share sheet."
                return
            }
            let bounds = view.bounds
            let anchor = NSRect(x: bounds.midX, y: view.isFlipped ? bounds.minY : bounds.maxY - 1, width: 2, height: 2)
            picker.show(relativeTo: anchor, of: view, preferredEdge: view.isFlipped ? .maxY : .minY)
        } catch {
            model.errorMessage = "Could not share the PDF. \(error.localizedDescription)"
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
        if let window = hostWindow() {
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

    private static func hostWindow() -> NSWindow? {
        NSApp.keyWindow ?? NSApp.mainWindow ?? NSApp.windows.first { $0.isVisible && $0.canBecomeMain }
    }

    private static func shareAnchorView() -> NSView? {
        guard let window = hostWindow() else { return nil }
        return window.standardWindowButton(.closeButton)?.superview ?? window.contentView
    }

    private static func jobTitle(for kinds: [DocumentKind], worksheet: Worksheet) -> String {
        switch kinds {
        case [.worksheet]:
            return "\(worksheet.meta.title) worksheet"
        case [.answerKey]:
            return "\(worksheet.meta.title) answer key"
        default:
            return "\(worksheet.meta.title) worksheet and answer key"
        }
    }

    private static func makeDocument(
        _ worksheet: Worksheet,
        kinds: [DocumentKind],
        colors: WorksheetColors
    ) -> PDFDocument? {
        guard let first = kinds.first else { return nil }
        guard let document = PDFDocument(data: WorksheetPDF.render(worksheet, kind: first, colors: colors)) else {
            return nil
        }
        for kind in kinds.dropFirst() {
            guard let next = PDFDocument(data: WorksheetPDF.render(worksheet, kind: kind, colors: colors)) else {
                return nil
            }
            for index in 0..<next.pageCount {
                guard let page = next.page(at: index)?.copy() as? PDFPage else { continue }
                document.insert(page, at: document.pageCount)
            }
        }
        return document
    }

    private static func exportURLs(
        _ worksheet: Worksheet,
        kinds: [DocumentKind],
        colors: WorksheetColors
    ) throws -> [URL] {
        try kinds.map { kind in
            let data = WorksheetPDF.render(worksheet, kind: kind, colors: colors)
            let name = fileSlug(title: worksheet.meta.title, grade: worksheet.meta.grade, kind: kind)
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(name)
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
            try data.write(to: url, options: .atomic)
            return url
        }
    }
}
#endif
