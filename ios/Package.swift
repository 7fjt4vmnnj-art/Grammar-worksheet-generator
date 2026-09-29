// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "GrammarCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v13),
    ],
    products: [
        .library(name: "GrammarCore", targets: ["GrammarCore"]),
    ],
    targets: [
        .target(
            name: "GrammarCore",
            resources: [
                .process("Resources/item-bank.json"),
            ]
        ),
        .testTarget(
            name: "GrammarCoreTests",
            dependencies: ["GrammarCore"]
        ),
    ]
)
