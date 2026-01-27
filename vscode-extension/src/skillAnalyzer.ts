import * as vscode from 'vscode'
import * as path from 'path'

export interface ProjectContext {
  languages: string[]
  frameworks: string[]
  tools: string[]
  fileTypes: string[]
  hasPackageJson: boolean
  hasRequirementsTxt: boolean
  hasPyprojectToml: boolean
  hasCargoToml: boolean
  hasGoMod: boolean
}

export interface FileContext {
  language: string
  extension: string
  fileName: string
  imports: string[]
  keywords: string[]
}

const LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.py': 'python',
  '.rs': 'rust',
  '.go': 'go',
  '.java': 'java',
  '.rb': 'ruby',
  '.php': 'php',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.c': 'c',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.md': 'markdown',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.less': 'less',
  '.vue': 'vue',
  '.svelte': 'svelte',
}

const FRAMEWORK_PATTERNS: Record<string, RegExp[]> = {
  react: [/from ['"]react['"]/, /import React/, /@react/],
  vue: [/from ['"]vue['"]/, /\.vue$/, /@vue/],
  angular: [/from ['"]@angular/, /@angular/],
  svelte: [/from ['"]svelte['"]/, /\.svelte$/],
  nextjs: [/from ['"]next/, /next\.config/],
  express: [/from ['"]express['"]/, /require\(['"]express['"]\)/],
  fastapi: [/from fastapi/, /import fastapi/],
  django: [/from django/, /import django/],
  flask: [/from flask/, /import flask/],
  gsap: [/from ['"]gsap['"]/, /gsap\./, /ScrollTrigger/],
  playwright: [/from ['"]@playwright/, /playwright/],
  tailwind: [/tailwindcss/, /tailwind\.config/],
  p5js: [/p5\.js/, /from ['"]p5['"]/, /createCanvas\(/],
}

const TOOL_PATTERNS: Record<string, string[]> = {
  git: ['.git', '.gitignore', '.gitattributes'],
  docker: ['Dockerfile', 'docker-compose.yml', '.dockerignore'],
  kubernetes: ['kubernetes', 'k8s', '.kube'],
  terraform: ['.tf', 'terraform'],
  eslint: ['.eslintrc', 'eslint.config'],
  prettier: ['.prettierrc', 'prettier.config'],
  jest: ['jest.config', '__tests__'],
  vitest: ['vitest.config'],
  webpack: ['webpack.config'],
  vite: ['vite.config'],
}

export async function analyzeProject(workspaceFolder: vscode.WorkspaceFolder): Promise<ProjectContext> {
  const context: ProjectContext = {
    languages: [],
    frameworks: [],
    tools: [],
    fileTypes: [],
    hasPackageJson: false,
    hasRequirementsTxt: false,
    hasPyprojectToml: false,
    hasCargoToml: false,
    hasGoMod: false,
  }

  const rootPath = workspaceFolder.uri.fsPath

  // Check for project files
  const projectFiles = [
    { file: 'package.json', key: 'hasPackageJson' as const },
    { file: 'requirements.txt', key: 'hasRequirementsTxt' as const },
    { file: 'pyproject.toml', key: 'hasPyprojectToml' as const },
    { file: 'Cargo.toml', key: 'hasCargoToml' as const },
    { file: 'go.mod', key: 'hasGoMod' as const },
  ]

  for (const { file, key } of projectFiles) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(path.join(rootPath, file)))
      context[key] = true
    } catch {
      // File doesn't exist
    }
  }

  // Detect languages from project files
  if (context.hasPackageJson) {
    context.languages.push('javascript', 'typescript')
  }
  if (context.hasRequirementsTxt || context.hasPyprojectToml) {
    context.languages.push('python')
  }
  if (context.hasCargoToml) {
    context.languages.push('rust')
  }
  if (context.hasGoMod) {
    context.languages.push('go')
  }

  // Analyze package.json for frameworks
  if (context.hasPackageJson) {
    try {
      const packageJsonUri = vscode.Uri.file(path.join(rootPath, 'package.json'))
      const packageJsonContent = await vscode.workspace.fs.readFile(packageJsonUri)
      const packageJson = JSON.parse(packageJsonContent.toString())
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

      if (deps.react || deps['react-dom']) context.frameworks.push('react')
      if (deps.vue) context.frameworks.push('vue')
      if (deps['@angular/core']) context.frameworks.push('angular')
      if (deps.svelte) context.frameworks.push('svelte')
      if (deps.next) context.frameworks.push('nextjs')
      if (deps.express) context.frameworks.push('express')
      if (deps.gsap) context.frameworks.push('gsap')
      if (deps['@playwright/test'] || deps.playwright) context.frameworks.push('playwright')
      if (deps.tailwindcss) context.frameworks.push('tailwind')
      if (deps.p5) context.frameworks.push('p5js')
    } catch {
      // Error reading package.json
    }
  }

  // Detect tools from files
  for (const [tool, patterns] of Object.entries(TOOL_PATTERNS)) {
    for (const pattern of patterns) {
      try {
        const files = await vscode.workspace.findFiles(`**/*${pattern}*`, '**/node_modules/**', 1)
        if (files.length > 0) {
          context.tools.push(tool)
          break
        }
      } catch {
        // Error finding files
      }
    }
  }

  // Get unique file types in workspace
  try {
    const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**', 100)
    const extensions = new Set<string>()
    for (const file of files) {
      const ext = path.extname(file.fsPath)
      if (ext) {
        extensions.add(ext)
      }
    }
    context.fileTypes = Array.from(extensions)
  } catch {
    // Error finding files
  }

  return context
}

export function analyzeFile(document: vscode.TextDocument): FileContext {
  const extension = path.extname(document.fileName)
  const language = LANGUAGE_MAP[extension] || document.languageId
  const content = document.getText()
  const imports: string[] = []
  const keywords: string[] = []

  // Extract imports
  const importRegex = /(?:import|from|require)\s*\(?['"]([^'"]+)['"]\)?/g
  let match
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }

  // Detect frameworks from content
  for (const [framework, patterns] of Object.entries(FRAMEWORK_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        keywords.push(framework)
        break
      }
    }
  }

  // Detect common patterns
  if (/animation|animate|transition|keyframe/i.test(content)) {
    keywords.push('animation')
  }
  if (/test|describe|it\(|expect\(/i.test(content)) {
    keywords.push('testing')
  }
  if (/api|fetch|axios|http/i.test(content)) {
    keywords.push('api')
  }
  if (/pdf|document|docx|xlsx/i.test(content)) {
    keywords.push('documents')
  }
  if (/canvas|draw|render|graphic/i.test(content)) {
    keywords.push('graphics')
  }
  if (/git|commit|branch|merge/i.test(content)) {
    keywords.push('git')
  }

  return {
    language,
    extension,
    fileName: path.basename(document.fileName),
    imports,
    keywords: [...new Set(keywords)],
  }
}

export function getLanguageFromExtension(extension: string): string {
  return LANGUAGE_MAP[extension] || 'unknown'
}
