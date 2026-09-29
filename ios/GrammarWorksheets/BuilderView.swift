import GrammarCore
import SwiftUI

struct BuilderView: View {
    @Bindable var model: WorksheetModel
    var presentsPreview: Bool

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                header
                gradePicker
                quickStarts
                skillPicker
                options
                headerFields
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
            .padding(.bottom, 12)
        }
        .scrollDismissesKeyboard(.interactively)
        .background(Theme.paper)
        .navigationTitle("Grammar")
        .navigationBarTitleDisplayMode(.inline)
        .safeAreaInset(edge: .bottom) { generateBar }
        .sensoryFeedback(.success, trigger: model.worksheet?.meta.seed)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Grammar Worksheets")
                .font(.system(size: 32, weight: .semibold, design: .serif))
                .foregroundStyle(Theme.ink)
            Text("Pick a grade and the skills you want to practice. The app builds a worksheet and a matching answer key on this device.")
                .font(.body)
                .foregroundStyle(Theme.muted)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.top, 8)
    }

    private var gradePicker: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title: "Grade")
            HStack(spacing: 8) {
                ForEach(Grade.allCases) { grade in
                    let selected = model.grade == grade
                    Button {
                        model.chooseGrade(grade)
                    } label: {
                        Text("\(grade.rawValue)")
                            .font(.title3.weight(.semibold))
                            .frame(maxWidth: .infinity)
                            .frame(minHeight: 52)
                            .background(selected ? Theme.moss : Theme.card)
                            .foregroundStyle(selected ? Color.white : Theme.ink)
                            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .stroke(selected ? Theme.moss : Theme.rule, lineWidth: 1)
                            )
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Grade \(grade.rawValue)")
                    .accessibilityAddTraits(selected ? .isSelected : [])
                }
            }
        }
    }

    private var quickStarts: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title: "Quick start")
            VStack(spacing: 8) {
                ForEach(QuickStart.all) { start in
                    Button {
                        model.apply(start)
                    } label: {
                        HStack(alignment: .firstTextBaseline) {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(start.title)
                                    .font(.body.weight(.semibold))
                                    .foregroundStyle(Theme.ink)
                                Text(start.detail)
                                    .font(.subheadline)
                                    .foregroundStyle(Theme.muted)
                                    .multilineTextAlignment(.leading)
                            }
                            Spacer(minLength: 12)
                            Image(systemName: "arrow.right")
                                .foregroundStyle(Theme.moss)
                        }
                        .padding(14)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Theme.card)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .stroke(Theme.rule.opacity(0.8), lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var skillPicker: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                SectionLabel(title: "Skills")
                Spacer()
                Text("\(model.selectedSkillIDs.count) selected")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(Theme.muted)
            }
            Picker("Which skills to show", selection: $model.recommendedOnly) {
                Text("Recommended").tag(true)
                Text("All 34").tag(false)
            }
            .pickerStyle(.segmented)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    categoryChip(nil, title: "All")
                    ForEach(Catalog.categories) { category in
                        categoryChip(category.id, title: category.id.shortName)
                    }
                }
            }
            TextField("Search skills", text: $model.query)
                .textFieldStyle(.plain)
                .padding(12)
                .background(Theme.card)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(Theme.rule, lineWidth: 1)
                )
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            HStack(spacing: 16) {
                Button("Select recommended") { model.selectRecommended() }
                Button("Clear") { model.clearSkills() }
            }
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Theme.moss)
            if model.visibleSkills.isEmpty {
                Text("No skills match that search.")
                    .font(.body)
                    .foregroundStyle(Theme.muted)
                    .padding(.vertical, 12)
            } else {
                VStack(spacing: 8) {
                    ForEach(model.visibleSkills) { skill in
                        skillRow(skill)
                    }
                }
            }
        }
    }

    private func categoryChip(_ id: CategoryId?, title: String) -> some View {
        let selected = model.category == id
        return Button {
            model.category = id
        } label: {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .padding(.horizontal, 14)
                .frame(minHeight: 44)
                .background(selected ? Theme.moss : Theme.card)
                .foregroundStyle(selected ? Color.white : Theme.ink)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(selected ? Theme.moss : Theme.rule, lineWidth: 1))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func skillRow(_ skill: Skill) -> some View {
        let selected = model.selectedSkillIDs.contains(skill.id)
        let recommended = Catalog.isRecommended(skill, grade: model.grade)
        return Button {
            model.toggleSkill(skill.id)
        } label: {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundStyle(selected ? Theme.moss : Theme.rule)
                    .frame(width: 32, height: 32)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 4) {
                    Text(skill.name)
                        .font(.body.weight(.semibold))
                        .foregroundStyle(Theme.ink)
                        .multilineTextAlignment(.leading)
                    Text(skill.summary)
                        .font(.subheadline)
                        .foregroundStyle(Theme.muted)
                        .multilineTextAlignment(.leading)
                    if !recommended {
                        Text("Outside the usual band for grade \(model.grade.rawValue)")
                            .font(.caption.weight(.medium))
                            .foregroundStyle(Theme.moss)
                    }
                }
                Spacer(minLength: 0)
            }
            .padding(14)
            .frame(maxWidth: .infinity, minHeight: 72, alignment: .leading)
            .background(Theme.card)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(selected ? Theme.moss : Theme.rule.opacity(0.85), lineWidth: selected ? 1.5 : 1)
            )
            .contentShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(skill.name)
        .accessibilityHint(skill.summary)
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private var options: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionLabel(title: "Options")
            Card {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("Questions")
                            .font(.body.weight(.semibold))
                        Spacer()
                        HStack(spacing: 0) {
                            stepButton("minus", label: "Fewer questions") {
                                if model.questionCount > 5 { model.questionCount -= 1 }
                            }
                            Text("\(model.questionCount)")
                                .font(.title3.weight(.semibold).monospacedDigit())
                                .frame(minWidth: 44)
                            stepButton("plus", label: "More questions") {
                                if model.questionCount < 25 { model.questionCount += 1 }
                            }
                        }
                    }
                    Text("Between 5 and 25. Questions are shared across the skills you select.")
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Difficulty")
                            .font(.body.weight(.semibold))
                        HStack(spacing: 8) {
                            ForEach(Difficulty.allCases) { level in
                                difficultyButton(level)
                            }
                        }
                        Text(model.difficulty.blurb)
                            .font(.footnote)
                            .foregroundStyle(Theme.muted)
                        if model.difficulty == model.grade.defaultDifficulty {
                            Text("Suggested for grade \(model.grade.rawValue).")
                                .font(.footnote.weight(.medium))
                                .foregroundStyle(Theme.moss)
                        }
                    }
                    Toggle("Include directions", isOn: $model.includeDirections)
                        .font(.body.weight(.semibold))
                        .tint(Theme.moss)
                }
            }
        }
    }

    private func stepButton(_ systemName: String, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.body.weight(.bold))
                .frame(width: 44, height: 44)
                .background(Theme.mist)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
        .foregroundStyle(Theme.ink)
    }

    private func difficultyButton(_ level: Difficulty) -> some View {
        let selected = model.difficulty == level
        return Button {
            model.difficulty = level
            model.difficultyFollowsGrade = level == model.grade.defaultDifficulty
        } label: {
            Text(level.label)
                .font(.subheadline.weight(.semibold))
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity, minHeight: 48)
                .padding(.horizontal, 4)
                .background(selected ? Theme.moss : Theme.mist)
                .foregroundStyle(selected ? Color.white : Theme.ink)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private var headerFields: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel(title: "Header")
            Text("Optional. Blank teacher and class lines are left off the page.")
                .font(.footnote)
                .foregroundStyle(Theme.muted)
            Card {
                VStack(alignment: .leading, spacing: 14) {
                    labeledField("Teacher", text: $model.teacher, prompt: "Ms. Okonkwo")
                    labeledField("Class", text: $model.className, prompt: "English 7")
                    labeledField("Title", text: $model.title, prompt: "Automatic from the skills")
                    Toggle("Print the date", isOn: $model.includeDate)
                        .font(.body.weight(.semibold))
                        .tint(Theme.moss)
                    if model.includeDate {
                        DatePicker("Date", selection: $model.date, displayedComponents: .date)
                            .font(.body.weight(.semibold))
                    }
                }
            }
        }
    }

    private func labeledField(_ title: String, text: Binding<String>, prompt: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline.weight(.semibold))
            TextField(prompt, text: text)
                .textFieldStyle(.plain)
                .padding(12)
                .background(Theme.mist)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
    }

    private var generateBar: some View {
        VStack(spacing: 8) {
            if let errorMessage = model.errorMessage {
                Text(errorMessage)
                    .font(.footnote)
                    .foregroundStyle(Color(red: 0.55, green: 0.16, blue: 0.12))
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            Text(summary)
                .font(.footnote)
                .foregroundStyle(Theme.muted)
                .frame(maxWidth: .infinity, alignment: .leading)
            Button {
                model.generate()
                if presentsPreview, model.worksheet != nil, model.errorMessage == nil {
                    model.showingPreview = true
                }
            } label: {
                Text(model.worksheet == nil ? "Generate worksheet" : "Generate new worksheet")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .frame(minHeight: 54)
                    .background(model.selectedSkillIDs.isEmpty ? Theme.rule : Theme.moss)
                    .foregroundStyle(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .buttonStyle(.plain)
            .disabled(model.selectedSkillIDs.isEmpty)
        }
        .padding(.horizontal, 20)
        .padding(.top, 10)
        .padding(.bottom, 8)
        .background(.ultraThinMaterial)
    }

    private var summary: String {
        let count = model.selectedSkillIDs.count
        let skillWord = count == 1 ? "skill" : "skills"
        return "\(count) \(skillWord) · \(model.questionCount) questions · \(model.difficulty.label)"
    }
}

extension CategoryId {
    var shortName: String {
        switch self {
        case .partsOfSpeech: return "Parts of speech"
        case .agreement: return "Agreement"
        case .sentenceStructure: return "Sentences"
        case .punctuation: return "Punctuation"
        case .usage: return "Usage"
        }
    }
}
