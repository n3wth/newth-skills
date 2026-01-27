import * as vscode from 'vscode'
import { SkillBrowserProvider } from './webview/skillBrowserProvider'
import { SuggestionsProvider, ProjectContextProvider } from './suggestionsProvider'
import { analyzeProject, analyzeFile, ProjectContext } from './skillAnalyzer'
import { matchSkillsToProject, matchSkillsToFile, filterByCompatibility, getTopSkillMatches } from './skillMatcher'
import { skills, getSkillById, Skill } from './skillsData'

let statusBarItem: vscode.StatusBarItem
let suggestionsProvider: SuggestionsProvider
let projectContextProvider: ProjectContextProvider
let skillBrowserProvider: SkillBrowserProvider
let currentProjectContext: ProjectContext | undefined

export function activate(context: vscode.ExtensionContext) {
  console.log('Newth Skills extension is now active!')

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = 'newthSkills.showSkillBrowser'
  statusBarItem.text = '$(lightbulb) Skills'
  statusBarItem.tooltip = 'Newth Skills - Click to browse skills'
  context.subscriptions.push(statusBarItem)

  const config = vscode.workspace.getConfiguration('newthSkills')
  if (config.get<boolean>('showStatusBarItem', true)) {
    statusBarItem.show()
  }

  // Create providers
  skillBrowserProvider = new SkillBrowserProvider(context.extensionUri)
  suggestionsProvider = new SuggestionsProvider()
  projectContextProvider = new ProjectContextProvider()

  // Register webview provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SkillBrowserProvider.viewType, skillBrowserProvider)
  )

  // Register tree data providers
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('newthSkills.suggestions', suggestionsProvider)
  )
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('newthSkills.projectContext', projectContextProvider)
  )

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('newthSkills.showSkillBrowser', () => {
      vscode.commands.executeCommand('workbench.view.extension.newth-skills')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('newthSkills.suggestSkills', async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      const fileContext = analyzeFile(editor.document)
      const matches = matchSkillsToFile(fileContext)
      const config = vscode.workspace.getConfiguration('newthSkills')
      const preferredAssistant = config.get<'gemini' | 'claude'>('preferredAssistant', 'claude')
      const filteredMatches = filterByCompatibility(matches, preferredAssistant)
      const topMatches = getTopSkillMatches(filteredMatches, 5)

      if (topMatches.length === 0) {
        vscode.window.showInformationMessage('No skill suggestions for this file type')
        return
      }

      const items = topMatches.map((match) => ({
        label: `$(lightbulb) ${match.skill.name}`,
        description: match.skill.category,
        detail: match.reasons.join(' | '),
        skill: match.skill,
      }))

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a skill to install or view',
        matchOnDescription: true,
        matchOnDetail: true,
      })

      if (selected) {
        const action = await vscode.window.showQuickPick(
          [
            { label: '$(cloud-download) Install', action: 'install' },
            { label: '$(link-external) View on Website', action: 'view' },
            { label: '$(copy) Copy Install Command', action: 'copy' },
          ],
          { placeHolder: `What would you like to do with ${selected.skill.name}?` }
        )

        if (action) {
          handleSkillAction(action.action, selected.skill, preferredAssistant)
        }
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('newthSkills.analyzeProject', async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
      if (!workspaceFolder) {
        vscode.window.showInformationMessage('No workspace folder open')
        return
      }

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Analyzing project...',
          cancellable: false,
        },
        async () => {
          currentProjectContext = await analyzeProject(workspaceFolder)

          projectContextProvider.refresh({
            languages: currentProjectContext.languages,
            frameworks: currentProjectContext.frameworks,
            tools: currentProjectContext.tools,
          })

          const matches = matchSkillsToProject(currentProjectContext)
          const config = vscode.workspace.getConfiguration('newthSkills')
          const preferredAssistant = config.get<'gemini' | 'claude'>('preferredAssistant', 'claude')
          const filteredMatches = filterByCompatibility(matches, preferredAssistant)

          suggestionsProvider.refresh(filteredMatches)
          skillBrowserProvider.updateSuggestions(filteredMatches)

          vscode.window.showInformationMessage(
            `Project analyzed: ${currentProjectContext.languages.length} languages, ${currentProjectContext.frameworks.length} frameworks detected`
          )
        }
      )
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('newthSkills.installSkill', async (skillOrId?: Skill | string) => {
      let skill: Skill | undefined

      if (typeof skillOrId === 'string') {
        skill = getSkillById(skillOrId)
      } else if (skillOrId) {
        skill = skillOrId
      } else {
        // Show picker
        const items = skills.map((s) => ({
          label: `${s.icon} ${s.name}`,
          description: s.category,
          detail: s.description,
          skill: s,
        }))

        const selected = await vscode.window.showQuickPick(items, {
          placeHolder: 'Select a skill to install',
          matchOnDescription: true,
          matchOnDetail: true,
        })

        if (selected) {
          skill = selected.skill
        }
      }

      if (!skill) {
        return
      }

      const config = vscode.workspace.getConfiguration('newthSkills')
      const preferredAssistant = config.get<'gemini' | 'claude'>('preferredAssistant', 'claude')

      handleSkillAction('install', skill, preferredAssistant)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('newthSkills.viewSkillDetail', (skill: Skill) => {
      const url = `https://skills.newth.ai/skill/${skill.id}`
      vscode.env.openExternal(vscode.Uri.parse(url))
    })
  )

  // Auto-analyze on workspace open
  if (vscode.workspace.workspaceFolders?.[0]) {
    vscode.commands.executeCommand('newthSkills.analyzeProject')
  }

  // Listen for active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor) return

      const config = vscode.workspace.getConfiguration('newthSkills')
      if (!config.get<boolean>('autoSuggest', true)) return

      const fileContext = analyzeFile(editor.document)
      const matches = matchSkillsToFile(fileContext)
      const preferredAssistant = config.get<'gemini' | 'claude'>('preferredAssistant', 'claude')
      const filteredMatches = filterByCompatibility(matches, preferredAssistant)
      const topMatches = getTopSkillMatches(filteredMatches, 5)

      suggestionsProvider.refresh(topMatches)
      skillBrowserProvider.updateSuggestions(topMatches)

      // Update status bar
      if (topMatches.length > 0) {
        statusBarItem.text = `$(lightbulb) ${topMatches.length} Skills`
        statusBarItem.tooltip = `${topMatches.length} skills suggested for this file\nTop: ${topMatches[0].skill.name}`
      } else {
        statusBarItem.text = '$(lightbulb) Skills'
        statusBarItem.tooltip = 'Newth Skills - Click to browse skills'
      }
    })
  )

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('newthSkills.showStatusBarItem')) {
        const config = vscode.workspace.getConfiguration('newthSkills')
        if (config.get<boolean>('showStatusBarItem', true)) {
          statusBarItem.show()
        } else {
          statusBarItem.hide()
        }
      }
    })
  )
}

function handleSkillAction(action: string, skill: Skill, assistant: 'gemini' | 'claude') {
  const command =
    assistant === 'gemini'
      ? `curl -sL https://skills.newth.ai/install.sh | bash -s -- gemini ${skill.id}`
      : `curl -sL https://skills.newth.ai/install.sh | bash -s -- claude ${skill.id}`

  switch (action) {
    case 'install':
      vscode.window
        .showInformationMessage(`Install ${skill.name} for ${assistant}?`, 'Open Terminal', 'Copy Command')
        .then((selection) => {
          if (selection === 'Open Terminal') {
            const terminal = vscode.window.createTerminal('Newth Skills')
            terminal.show()
            terminal.sendText(command)
          } else if (selection === 'Copy Command') {
            vscode.env.clipboard.writeText(command)
            vscode.window.showInformationMessage('Installation command copied to clipboard!')
          }
        })
      break

    case 'view': {
      const url = `https://skills.newth.ai/skill/${skill.id}`
      vscode.env.openExternal(vscode.Uri.parse(url))
      break
    }

    case 'copy':
      vscode.env.clipboard.writeText(command)
      vscode.window.showInformationMessage('Installation command copied to clipboard!')
      break
  }
}

export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose()
  }
}
