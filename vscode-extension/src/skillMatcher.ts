import { Skill, skills } from './skillsData'
import { ProjectContext, FileContext } from './skillAnalyzer'

export interface SkillMatch {
  skill: Skill
  score: number
  reasons: string[]
}

const TAG_WEIGHTS: Record<string, number> = {
  // Languages
  javascript: 2,
  typescript: 2,
  python: 2,
  rust: 2,
  go: 2,
  // Frameworks
  react: 3,
  vue: 3,
  angular: 3,
  svelte: 3,
  nextjs: 3,
  express: 3,
  fastapi: 3,
  django: 3,
  flask: 3,
  gsap: 4,
  playwright: 4,
  tailwind: 3,
  p5js: 4,
  // Tools
  git: 2,
  docker: 2,
  testing: 3,
  // Categories
  animation: 3,
  api: 2,
  documents: 3,
  graphics: 3,
}

const LANGUAGE_TO_TAGS: Record<string, string[]> = {
  typescript: ['typescript', 'javascript'],
  javascript: ['javascript', 'typescript'],
  python: ['python'],
  rust: ['rust'],
  go: ['go'],
  markdown: ['markdown', 'documentation'],
  html: ['html', 'ui'],
  css: ['css', 'styling', 'design'],
  scss: ['css', 'styling', 'design'],
}

const FRAMEWORK_TO_SKILLS: Record<string, string[]> = {
  react: ['frontend-design', 'gsap-animations', 'webapp-testing'],
  vue: ['frontend-design', 'webapp-testing'],
  angular: ['frontend-design', 'webapp-testing'],
  svelte: ['frontend-design', 'webapp-testing'],
  nextjs: ['frontend-design', 'gsap-animations', 'webapp-testing'],
  express: ['mcp-builder', 'webapp-testing'],
  fastapi: ['mcp-builder'],
  django: ['mcp-builder'],
  flask: ['mcp-builder'],
  gsap: ['gsap-animations'],
  playwright: ['webapp-testing'],
  tailwind: ['frontend-design', 'theme-factory'],
  p5js: ['algorithmic-art', 'canvas-design'],
}

export function matchSkillsToProject(context: ProjectContext): SkillMatch[] {
  const matches: SkillMatch[] = []

  for (const skill of skills) {
    let score = 0
    const reasons: string[] = []

    // Match by language
    for (const lang of context.languages) {
      const langTags = LANGUAGE_TO_TAGS[lang] || [lang]
      for (const tag of langTags) {
        if (skill.tags.includes(tag)) {
          score += TAG_WEIGHTS[tag] || 1
          reasons.push(`Matches project language: ${lang}`)
          break
        }
      }
    }

    // Match by framework
    for (const framework of context.frameworks) {
      const relatedSkills = FRAMEWORK_TO_SKILLS[framework] || []
      if (relatedSkills.includes(skill.id)) {
        score += 5
        reasons.push(`Recommended for ${framework}`)
      }
      if (skill.tags.includes(framework)) {
        score += TAG_WEIGHTS[framework] || 2
        reasons.push(`Matches framework: ${framework}`)
      }
    }

    // Match by tools
    for (const tool of context.tools) {
      if (skill.tags.includes(tool)) {
        score += TAG_WEIGHTS[tool] || 1
        reasons.push(`Matches tool: ${tool}`)
      }
    }

    // Boost featured skills slightly
    if (skill.featured) {
      score += 1
    }

    if (score > 0) {
      matches.push({ skill, score, reasons: [...new Set(reasons)] })
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score)
}

export function matchSkillsToFile(context: FileContext): SkillMatch[] {
  const matches: SkillMatch[] = []

  for (const skill of skills) {
    let score = 0
    const reasons: string[] = []

    // Match by language
    const langTags = LANGUAGE_TO_TAGS[context.language] || [context.language]
    for (const tag of langTags) {
      if (skill.tags.includes(tag)) {
        score += TAG_WEIGHTS[tag] || 1
        reasons.push(`Matches file language: ${context.language}`)
        break
      }
    }

    // Match by keywords detected in file
    for (const keyword of context.keywords) {
      const relatedSkills = FRAMEWORK_TO_SKILLS[keyword] || []
      if (relatedSkills.includes(skill.id)) {
        score += 5
        reasons.push(`Detected ${keyword} usage in file`)
      }
      if (skill.tags.includes(keyword)) {
        score += TAG_WEIGHTS[keyword] || 2
        reasons.push(`File contains ${keyword} patterns`)
      }
    }

    // Match by imports
    for (const imp of context.imports) {
      const importName = imp.split('/')[0].replace('@', '')
      if (skill.tags.includes(importName)) {
        score += 3
        reasons.push(`Imports ${importName}`)
      }
      // Special cases
      if (imp.includes('gsap') && skill.id === 'gsap-animations') {
        score += 5
        reasons.push('Uses GSAP library')
      }
      if (imp.includes('playwright') && skill.id === 'webapp-testing') {
        score += 5
        reasons.push('Uses Playwright')
      }
      if (imp.includes('p5') && skill.id === 'algorithmic-art') {
        score += 5
        reasons.push('Uses p5.js')
      }
    }

    // Match by file extension for document skills
    if (context.extension === '.md' && skill.category === 'business') {
      score += 1
      reasons.push('Markdown file - business skills may help')
    }

    // Boost featured skills slightly
    if (skill.featured) {
      score += 0.5
    }

    if (score > 0) {
      matches.push({ skill, score, reasons: [...new Set(reasons)] })
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score)
}

export function getTopSkillMatches(matches: SkillMatch[], limit: number = 5): SkillMatch[] {
  return matches.slice(0, limit)
}

export function filterByCompatibility(matches: SkillMatch[], assistant: 'gemini' | 'claude'): SkillMatch[] {
  return matches.filter(m => 
    !m.skill.compatibility || m.skill.compatibility.includes(assistant)
  )
}

export function filterByCategory(matches: SkillMatch[], category: string): SkillMatch[] {
  if (category === 'all') {
    return matches
  }
  return matches.filter(m => m.skill.category === category)
}
