import type { Skill, Contributor } from './skills'

/**
 * Skill Template for Community Contributors
 * 
 * Use this template as a guide when submitting a new skill to the marketplace.
 * Copy the structure below and fill in your skill's details.
 */

/**
 * Example contributor object - include your information
 */
export const exampleContributor: Contributor = {
  name: 'Your Name',
  github: 'your-github-username',
  url: 'https://your-website.com',
}

/**
 * Skill Template
 * 
 * Required fields:
 * - id: Unique identifier (lowercase, hyphenated)
 * - name: Display name for the skill
 * - description: Short description (1-2 sentences)
 * - category: One of 'development' | 'documents' | 'creative' | 'productivity' | 'business'
 * - tags: Array of relevant keywords (3-5 recommended)
 * - icon: Single character or emoji
 * - color: OKLCH color value (e.g., 'oklch(0.70 0.15 280)')
 * - version: Semantic version (e.g., '1.0.0')
 * - lastUpdated: ISO date string (e.g., '2026-01-27')
 * 
 * Optional fields:
 * - longDescription: Extended description with more details
 * - featured: Boolean (set by maintainers)
 * - features: Array of key features (3-5 recommended)
 * - useCases: Array of example use cases (3-5 recommended)
 * - compatibility: Array of supported platforms ('gemini' | 'claude')
 * - contributor: Your contributor information
 */
export const skillTemplate: Skill = {
  id: 'your-skill-id',
  name: 'Your Skill Name',
  description: 'A brief description of what your skill does and its main benefit.',
  longDescription: 'A more detailed description explaining the skill\'s capabilities, how it works, and what makes it unique. This appears on the skill detail page.',
  category: 'development',
  tags: ['tag1', 'tag2', 'tag3'],
  icon: '◈',
  color: 'oklch(0.70 0.15 280)',
  features: [
    'Key feature one',
    'Key feature two',
    'Key feature three',
    'Key feature four',
    'Key feature five',
  ],
  useCases: [
    'Example use case one',
    'Example use case two',
    'Example use case three',
    'Example use case four',
    'Example use case five',
  ],
  compatibility: ['gemini', 'claude'],
  version: '1.0.0',
  lastUpdated: '2026-01-27',
  contributor: {
    name: 'Your Name',
    github: 'your-github-username',
  },
}

/**
 * Category Guidelines
 * 
 * - development: Programming, coding tools, testing, DevOps
 * - documents: PDF, Word, Excel, presentations, document processing
 * - creative: Design, art, animation, visual content
 * - productivity: Task management, automation, workflows
 * - business: Strategy, communication, analysis, enterprise tools
 */

/**
 * Icon Suggestions
 * 
 * Use simple Unicode characters that represent your skill:
 * - Shapes: ◈ ◆ ◇ ◉ ◎ ◐ ◑ ◒ ◓ □ ▣ ▤ ▥ ▦ ✦
 * - Symbols: ⚡ ★ ☆ ♦ ♢ ⬡ ⬢
 * - Letters: Aa (for typography), etc.
 */

/**
 * Color Guidelines
 * 
 * Use OKLCH color format for consistent appearance:
 * - Lightness: 0.55-0.78 (avoid too dark or too bright)
 * - Chroma: 0.08-0.20 (subtle to vibrant)
 * - Hue: 0-360 (full color wheel)
 * 
 * Examples:
 * - Green: oklch(0.75 0.18 145)
 * - Blue: oklch(0.65 0.12 220)
 * - Purple: oklch(0.70 0.15 280)
 * - Orange: oklch(0.78 0.15 65)
 * - Pink: oklch(0.72 0.20 330)
 */
