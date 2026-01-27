import { skills, type Skill } from '../data/skills'

interface RecommendationResult {
  skill: Skill
  score: number
  matchedTerms: string[]
}

const STOP_WORDS = new Set([
  'i', 'want', 'to', 'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'for',
  'with', 'my', 'me', 'is', 'are', 'be', 'have', 'has', 'do', 'does', 'can', 'could',
  'would', 'should', 'will', 'need', 'like', 'some', 'how', 'what', 'make', 'create',
  'build', 'help', 'get', 'use', 'using', 'work', 'working'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word))
}

function getSkillSearchableText(skill: Skill): string {
  const parts = [
    skill.name,
    skill.description,
    skill.longDescription || '',
    skill.tags.join(' '),
    (skill.features || []).join(' '),
    (skill.useCases || []).join(' ')
  ]
  return parts.join(' ').toLowerCase()
}

function calculateScore(queryTokens: string[], skillText: string, skill: Skill): { score: number; matchedTerms: string[] } {
  let score = 0
  const matchedTerms: string[] = []
  const skillTextLower = skillText.toLowerCase()

  for (const token of queryTokens) {
    if (skillTextLower.includes(token)) {
      matchedTerms.push(token)

      if (skill.name.toLowerCase().includes(token)) {
        score += 10
      }
      if (skill.tags.some(tag => tag.toLowerCase().includes(token))) {
        score += 8
      }
      if (skill.description.toLowerCase().includes(token)) {
        score += 5
      }
      if (skill.longDescription?.toLowerCase().includes(token)) {
        score += 3
      }
      if (skill.features?.some(f => f.toLowerCase().includes(token))) {
        score += 4
      }
      if (skill.useCases?.some(u => u.toLowerCase().includes(token))) {
        score += 6
      }
    }
  }

  if (skill.featured && score > 0) {
    score += 2
  }

  return { score, matchedTerms }
}

export function getRecommendations(query: string, maxResults: number = 6): RecommendationResult[] {
  if (!query.trim()) {
    return []
  }

  const queryTokens = tokenize(query)

  if (queryTokens.length === 0) {
    return []
  }

  const results: RecommendationResult[] = []

  for (const skill of skills) {
    const skillText = getSkillSearchableText(skill)
    const { score, matchedTerms } = calculateScore(queryTokens, skillText, skill)

    if (score > 0) {
      results.push({ skill, score, matchedTerms })
    }
  }

  results.sort((a, b) => b.score - a.score)

  return results.slice(0, maxResults)
}

export function getSuggestedTasks(): string[] {
  return [
    'add scroll animations to my hero section',
    'extract data from a PDF invoice',
    'connect Claude to a custom API',
    'write copy that converts',
    'run end-to-end tests on my React app',
    'generate algorithmic art with p5.js'
  ]
}
