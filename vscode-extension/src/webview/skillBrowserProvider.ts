import * as vscode from 'vscode'
import { skills, categories, searchSkills, getSkillsByCategory } from '../skillsData'
import { SkillMatch } from '../skillMatcher'

export class SkillBrowserProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'newthSkills.skillBrowser'

  private _view?: vscode.WebviewView
  private _suggestedSkills: SkillMatch[] = []

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: vscode.WebviewViewResolveContext<unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'search':
          this._handleSearch(data.query)
          break
        case 'filterCategory':
          this._handleCategoryFilter(data.category)
          break
        case 'installSkill':
          this._handleInstallSkill(data.skillId)
          break
        case 'viewSkill':
          this._handleViewSkill(data.skillId)
          break
        case 'copyCommand':
          this._handleCopyCommand(data.command)
          break
      }
    })
  }

  public updateSuggestions(matches: SkillMatch[]) {
    this._suggestedSkills = matches
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateSuggestions',
        suggestions: matches.map((m) => ({
          skill: m.skill,
          score: m.score,
          reasons: m.reasons,
        })),
      })
    }
  }

  private _handleSearch(query: string) {
    const results = searchSkills(query)
    if (this._view) {
      this._view.webview.postMessage({
        type: 'searchResults',
        skills: results,
      })
    }
  }

  private _handleCategoryFilter(category: string) {
    const results = getSkillsByCategory(category)
    if (this._view) {
      this._view.webview.postMessage({
        type: 'categoryResults',
        skills: results,
        category,
      })
    }
  }

  private _handleInstallSkill(skillId: string) {
    const skill = skills.find((s) => s.id === skillId)
    if (!skill) return

    const config = vscode.workspace.getConfiguration('newthSkills')
    const preferredAssistant = config.get<string>('preferredAssistant', 'claude')

    let command: string
    if (preferredAssistant === 'gemini') {
      command = `curl -sL https://skills.newth.ai/install.sh | bash -s -- gemini ${skillId}`
    } else {
      command = `curl -sL https://skills.newth.ai/install.sh | bash -s -- claude ${skillId}`
    }

    vscode.window
      .showInformationMessage(
        `Install ${skill.name} for ${preferredAssistant}?`,
        'Copy Command',
        'Open Terminal'
      )
      .then((selection) => {
        if (selection === 'Copy Command') {
          vscode.env.clipboard.writeText(command)
          vscode.window.showInformationMessage('Installation command copied to clipboard!')
        } else if (selection === 'Open Terminal') {
          const terminal = vscode.window.createTerminal('Newth Skills')
          terminal.show()
          terminal.sendText(command)
        }
      })
  }

  private _handleViewSkill(skillId: string) {
    const skill = skills.find((s) => s.id === skillId)
    if (!skill) return

    const url = `https://skills.newth.ai/skill/${skillId}`
    vscode.env.openExternal(vscode.Uri.parse(url))
  }

  private _handleCopyCommand(command: string) {
    vscode.env.clipboard.writeText(command)
    vscode.window.showInformationMessage('Command copied to clipboard!')
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const nonce = getNonce()

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newth Skills</title>
  <style>
    :root {
      --bg: var(--vscode-editor-background);
      --fg: var(--vscode-editor-foreground);
      --border: var(--vscode-panel-border);
      --accent: var(--vscode-textLink-foreground);
      --button-bg: var(--vscode-button-background);
      --button-fg: var(--vscode-button-foreground);
      --input-bg: var(--vscode-input-background);
      --input-border: var(--vscode-input-border);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--fg);
      background: var(--bg);
      padding: 12px;
    }
    
    .search-container {
      margin-bottom: 12px;
    }
    
    .search-input {
      width: 100%;
      padding: 8px 12px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 4px;
      color: var(--fg);
      font-size: 13px;
    }
    
    .search-input:focus {
      outline: 1px solid var(--accent);
    }
    
    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    
    .category-pill {
      padding: 4px 10px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--fg);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    
    .category-pill:hover {
      border-color: var(--accent);
    }
    
    .category-pill.active {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--button-fg);
    }
    
    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 8px;
      margin-top: 16px;
    }
    
    .skill-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .skill-card {
      padding: 12px;
      background: var(--vscode-editor-inactiveSelectionBackground);
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    
    .skill-card:hover {
      border-color: var(--accent);
    }
    
    .skill-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    .skill-icon {
      font-size: 16px;
    }
    
    .skill-name {
      font-weight: 600;
      font-size: 13px;
    }
    
    .skill-category {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      margin-left: auto;
    }
    
    .skill-description {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.4;
      margin-bottom: 8px;
    }
    
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 8px;
    }
    
    .skill-tag {
      font-size: 10px;
      padding: 2px 6px;
      background: var(--vscode-textBlockQuote-background);
      border-radius: 3px;
      color: var(--vscode-descriptionForeground);
    }
    
    .skill-actions {
      display: flex;
      gap: 8px;
    }
    
    .skill-btn {
      flex: 1;
      padding: 6px 10px;
      font-size: 11px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    
    .skill-btn:hover {
      opacity: 0.9;
    }
    
    .skill-btn.primary {
      background: var(--button-bg);
      color: var(--button-fg);
    }
    
    .skill-btn.secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--fg);
    }
    
    .suggestion-reason {
      font-size: 10px;
      color: var(--accent);
      margin-top: 4px;
    }
    
    .empty-state {
      text-align: center;
      padding: 24px;
      color: var(--vscode-descriptionForeground);
    }
    
    .featured-badge {
      font-size: 10px;
      color: var(--vscode-charts-yellow);
    }
  </style>
</head>
<body>
  <div class="search-container">
    <input type="text" class="search-input" placeholder="Search skills..." id="searchInput">
  </div>
  
  <div class="categories" id="categories">
    <button class="category-pill active" data-category="all">All</button>
    <button class="category-pill" data-category="development">Development</button>
    <button class="category-pill" data-category="documents">Documents</button>
    <button class="category-pill" data-category="creative">Creative</button>
    <button class="category-pill" data-category="business">Business</button>
  </div>
  
  <div id="suggestionsSection" style="display: none;">
    <div class="section-title">Suggested for this file</div>
    <div class="skill-list" id="suggestionsList"></div>
  </div>
  
  <div class="section-title">All Skills</div>
  <div class="skill-list" id="skillsList"></div>
  
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    
    const skills = ${JSON.stringify(skills)};
    const categories = ${JSON.stringify(categories)};
    
    let currentCategory = 'all';
    let currentSearch = '';
    let suggestions = [];
    
    function renderSkillCard(skill, reason = null) {
      const tags = skill.tags.slice(0, 4).map(t => 
        '<span class="skill-tag">' + t + '</span>'
      ).join('');
      
      const reasonHtml = reason ? 
        '<div class="suggestion-reason">' + reason + '</div>' : '';
      
      const featuredBadge = skill.featured ? 
        '<span class="featured-badge">★</span>' : '';
      
      return \`
        <div class="skill-card" data-skill-id="\${skill.id}">
          <div class="skill-header">
            <span class="skill-icon">\${skill.icon}</span>
            <span class="skill-name">\${skill.name}</span>
            \${featuredBadge}
            <span class="skill-category">\${skill.category}</span>
          </div>
          <div class="skill-description">\${skill.description}</div>
          <div class="skill-tags">\${tags}</div>
          \${reasonHtml}
          <div class="skill-actions">
            <button class="skill-btn primary" onclick="installSkill('\${skill.id}')">Install</button>
            <button class="skill-btn secondary" onclick="viewSkill('\${skill.id}')">View</button>
          </div>
        </div>
      \`;
    }
    
    function renderSkills() {
      let filtered = skills;
      
      if (currentCategory !== 'all') {
        filtered = filtered.filter(s => s.category === currentCategory);
      }
      
      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      
      const skillsList = document.getElementById('skillsList');
      if (filtered.length === 0) {
        skillsList.innerHTML = '<div class="empty-state">No skills found</div>';
      } else {
        skillsList.innerHTML = filtered.map(s => renderSkillCard(s)).join('');
      }
    }
    
    function renderSuggestions() {
      const section = document.getElementById('suggestionsSection');
      const list = document.getElementById('suggestionsList');
      
      if (suggestions.length === 0) {
        section.style.display = 'none';
        return;
      }
      
      section.style.display = 'block';
      list.innerHTML = suggestions.slice(0, 3).map(s => 
        renderSkillCard(s.skill, s.reasons[0])
      ).join('');
    }
    
    function installSkill(skillId) {
      vscode.postMessage({ type: 'installSkill', skillId });
    }
    
    function viewSkill(skillId) {
      vscode.postMessage({ type: 'viewSkill', skillId });
    }
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderSkills();
    });
    
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.category;
        renderSkills();
      });
    });
    
    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.type) {
        case 'updateSuggestions':
          suggestions = message.suggestions;
          renderSuggestions();
          break;
        case 'searchResults':
        case 'categoryResults':
          // Handled by local state
          break;
      }
    });
    
    // Initial render
    renderSkills();
  </script>
</body>
</html>`
  }
}

function getNonce(): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
