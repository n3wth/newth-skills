import * as vscode from 'vscode'
import { SkillMatch } from './skillMatcher'
import { Skill } from './skillsData'

export class SuggestionsProvider implements vscode.TreeDataProvider<SkillSuggestionItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SkillSuggestionItem | undefined | null | void> =
    new vscode.EventEmitter<SkillSuggestionItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<SkillSuggestionItem | undefined | null | void> =
    this._onDidChangeTreeData.event

  private _suggestions: SkillMatch[] = []

  constructor() {}

  refresh(suggestions: SkillMatch[]): void {
    this._suggestions = suggestions
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: SkillSuggestionItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: SkillSuggestionItem): Thenable<SkillSuggestionItem[]> {
    if (element) {
      // Return reasons as children
      return Promise.resolve(
        element.reasons.map(
          (reason) =>
            new SkillSuggestionItem(
              reason,
              '',
              vscode.TreeItemCollapsibleState.None,
              [],
              undefined,
              'reason'
            )
        )
      )
    }

    if (this._suggestions.length === 0) {
      return Promise.resolve([
        new SkillSuggestionItem(
          'No suggestions for current file',
          '',
          vscode.TreeItemCollapsibleState.None,
          [],
          undefined,
          'empty'
        ),
      ])
    }

    return Promise.resolve(
      this._suggestions.slice(0, 5).map(
        (match) =>
          new SkillSuggestionItem(
            match.skill.name,
            match.skill.description,
            match.reasons.length > 0
              ? vscode.TreeItemCollapsibleState.Collapsed
              : vscode.TreeItemCollapsibleState.None,
            match.reasons,
            match.skill,
            'skill'
          )
      )
    )
  }
}

export class SkillSuggestionItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly reasons: string[],
    public readonly skill?: Skill,
    public readonly itemType: 'skill' | 'reason' | 'empty' = 'skill'
  ) {
    super(label, collapsibleState)

    if (itemType === 'skill' && skill) {
      this.tooltip = `${skill.name}\n\n${skill.description}\n\nTags: ${skill.tags.join(', ')}`
      this.iconPath = new vscode.ThemeIcon('lightbulb')
      this.contextValue = 'skillSuggestion'
      this.command = {
        command: 'newthSkills.viewSkillDetail',
        title: 'View Skill',
        arguments: [skill],
      }
    } else if (itemType === 'reason') {
      this.iconPath = new vscode.ThemeIcon('info')
    } else if (itemType === 'empty') {
      this.iconPath = new vscode.ThemeIcon('circle-slash')
    }
  }
}

export class ProjectContextProvider implements vscode.TreeDataProvider<ProjectContextItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ProjectContextItem | undefined | null | void> =
    new vscode.EventEmitter<ProjectContextItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<ProjectContextItem | undefined | null | void> =
    this._onDidChangeTreeData.event

  private _context: {
    languages: string[]
    frameworks: string[]
    tools: string[]
  } = {
    languages: [],
    frameworks: [],
    tools: [],
  }

  constructor() {}

  refresh(context: { languages: string[]; frameworks: string[]; tools: string[] }): void {
    this._context = context
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: ProjectContextItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: ProjectContextItem): Thenable<ProjectContextItem[]> {
    if (element) {
      // Return items for each category
      let items: string[] = []
      switch (element.category) {
        case 'languages':
          items = this._context.languages
          break
        case 'frameworks':
          items = this._context.frameworks
          break
        case 'tools':
          items = this._context.tools
          break
      }
      return Promise.resolve(
        items.map((item) => new ProjectContextItem(item, 'item', vscode.TreeItemCollapsibleState.None))
      )
    }

    // Return top-level categories
    const categories: ProjectContextItem[] = []

    if (this._context.languages.length > 0) {
      categories.push(
        new ProjectContextItem(
          `Languages (${this._context.languages.length})`,
          'languages',
          vscode.TreeItemCollapsibleState.Expanded
        )
      )
    }

    if (this._context.frameworks.length > 0) {
      categories.push(
        new ProjectContextItem(
          `Frameworks (${this._context.frameworks.length})`,
          'frameworks',
          vscode.TreeItemCollapsibleState.Expanded
        )
      )
    }

    if (this._context.tools.length > 0) {
      categories.push(
        new ProjectContextItem(
          `Tools (${this._context.tools.length})`,
          'tools',
          vscode.TreeItemCollapsibleState.Expanded
        )
      )
    }

    if (categories.length === 0) {
      return Promise.resolve([
        new ProjectContextItem('No project detected', 'empty', vscode.TreeItemCollapsibleState.None),
      ])
    }

    return Promise.resolve(categories)
  }
}

export class ProjectContextItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly category: 'languages' | 'frameworks' | 'tools' | 'item' | 'empty',
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)

    switch (category) {
      case 'languages':
        this.iconPath = new vscode.ThemeIcon('code')
        break
      case 'frameworks':
        this.iconPath = new vscode.ThemeIcon('package')
        break
      case 'tools':
        this.iconPath = new vscode.ThemeIcon('tools')
        break
      case 'item':
        this.iconPath = new vscode.ThemeIcon('circle-filled')
        break
      case 'empty':
        this.iconPath = new vscode.ThemeIcon('folder')
        break
    }
  }
}
