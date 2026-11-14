import Foundation

/// A shared catalog for the native shell and web UI. App-specific AppleLanguages
/// preferences are respected; missing translations fall back to their source text.
enum L10n {
    static let locale = (Locale.preferredLanguages.first ?? "en")
        .lowercased().hasPrefix("pt") ? "pt-BR" : "en"

    private static let catalog: [String: String] = {
        guard let url = Bundle.main.resourceURL?.appendingPathComponent("locales/pt-BR.json"),
              let data = try? Data(contentsOf: url),
              let messages = try? JSONDecoder().decode([String: String].self, from: data) else { return [:] }
        return messages
    }()

    static func text(_ message: String, _ values: [String: String] = [:]) -> String {
        var result = locale == "pt-BR" ? catalog[message] ?? message : message
        for (key, value) in values { result = result.replacingOccurrences(of: "{\(key)}", with: value) }
        return result
    }
}
