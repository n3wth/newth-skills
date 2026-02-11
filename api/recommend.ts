import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

// Skill summaries for AI context (keep it concise)
const SKILL_CATALOG = [
  { id: 'gsap-animations', name: 'GSAP Animations', keywords: 'scroll animations, hero, transitions, motion, web animations' },
  { id: 'frontend-design', name: 'Frontend Design', keywords: 'UI components, React, landing pages, dashboards, web design' },
  { id: 'doc-coauthoring', name: 'Doc Co-authoring', keywords: 'documentation, proposals, technical specs, decision docs, writing' },
  { id: 'docx', name: 'Word Documents', keywords: 'Word docs, docx, tracked changes, comments, formatting' },
  { id: 'pdf', name: 'PDF Toolkit', keywords: 'PDF extraction, forms, merge, split, text extraction' },
  { id: 'xlsx', name: 'Spreadsheets', keywords: 'Excel, spreadsheets, formulas, data analysis, CSV' },
  { id: 'pptx', name: 'Presentations', keywords: 'PowerPoint, slides, speaker notes, presentations' },
  { id: 'mcp-builder', name: 'MCP Builder', keywords: 'MCP servers, API integration, tool development, Claude tools' },
  { id: 'skill-creator', name: 'Skill Creator', keywords: 'create skills, skill development, Claude Code skills' },
  { id: 'business-panel', name: 'Business Panel', keywords: 'business strategy, analysis, Porter, Christensen, consulting' },
  { id: 'algorithmic-art', name: 'Algorithmic Art', keywords: 'generative art, p5.js, creative coding, particles, flow fields' },
  { id: 'slack-gif-creator', name: 'Slack GIF Creator', keywords: 'GIF animations, Slack, animated images' },
  { id: 'canvas-design', name: 'Canvas Design', keywords: 'visual design, posters, artwork, PNG, PDF design' },
  { id: 'copywriting', name: 'Copywriting', keywords: 'marketing copy, landing pages, CTAs, headlines, conversion' },
  { id: 'webapp-testing', name: 'Web App Testing', keywords: 'Playwright, E2E testing, browser testing, automation' },
  { id: 'internal-comms', name: 'Internal Comms', keywords: 'status reports, newsletters, FAQs, incident reports' },
  { id: 'typography-selector', name: 'Typography Selector', keywords: 'fonts, Google Fonts, typography, font pairing' },
  { id: 'imessage', name: 'iMessage', keywords: 'iMessage, texts, contacts, messaging, Apple Messages' },
  { id: 'things', name: 'Things 3', keywords: 'tasks, todos, GTD, task management, Things app' },
  { id: 'home-assistant', name: 'Home Assistant', keywords: 'smart home, IoT, home automation, lights, energy' }
]

const RecommendationSchema = z.object({
  recommendations: z.array(z.object({
    skillId: z.string(),
    reason: z.string().describe('Brief reason why this skill matches (10 words max)')
  })).max(4)
})

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return Response.json({ recommendations: [] })
    }

    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: RecommendationSchema,
      prompt: `You are a skill recommendation engine. Given a user's task description, recommend the most relevant skills from the catalog.

SKILL CATALOG:
${SKILL_CATALOG.map(s => `- ${s.id}: ${s.name} (${s.keywords})`).join('\n')}

USER TASK: "${query}"

Return up to 4 most relevant skills, ordered by relevance. Only include skills that genuinely match the task.`
    })

    return Response.json(object)
  } catch (error) {
    console.error('AI recommendation error:', error)
    return Response.json({ recommendations: [] }, { status: 500 })
  }
}

export const config = {
  runtime: 'edge'
}
