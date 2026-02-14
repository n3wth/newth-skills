import { NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import { skills } from '@/src/data/skills'

const SkillOfDaySchema = z.object({
  skillId: z.string().describe('The selected skill ID from the catalog'),
  rationale: z.string().describe('A short, engaging reason why this skill is the pick of the day (1-2 sentences)'),
})

// Simple in-memory cache keyed by date string
let cache: { date: string; skillId: string; rationale: string } | null = null

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getDeterministicSkill() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return skills[dayOfYear % skills.length]
}

export async function GET() {
  const today = getTodayKey()

  // Return cached result if same day
  if (cache && cache.date === today) {
    const skill = skills.find(s => s.id === cache!.skillId)
    if (skill) {
      return NextResponse.json({
        skillId: cache.skillId,
        rationale: cache.rationale,
        source: 'ai',
      })
    }
  }

  // Try AI selection
  if (process.env.GEMINI_API_KEY) {
    try {
      const catalog = skills.map(s => `- ${s.id}: ${s.name} — ${s.description.slice(0, 80)}`).join('\n')
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]

      const { object } = await generateObject({
        model: google('gemini-2.0-flash'),
        schema: SkillOfDaySchema,
        prompt: `You are the curator of a daily "Skill of the Day" feature on skills.newth.ai, a platform for AI coding assistant skills.

Today is ${dayOfWeek}, ${today}.

Pick ONE skill from the catalog below that would be most interesting or useful to highlight today. Consider the day of the week (e.g., creative skills for Friday, productivity for Monday). Write a short, engaging rationale explaining why you picked it.

SKILL CATALOG:
${catalog}

Return the skillId exactly as shown in the catalog.`,
      })

      // Validate the skill exists
      const skill = skills.find(s => s.id === object.skillId)
      if (skill) {
        cache = { date: today, skillId: object.skillId, rationale: object.rationale }
        return NextResponse.json({
          skillId: object.skillId,
          rationale: object.rationale,
          source: 'ai',
        })
      }
    } catch (err) {
      console.error('Skill of the Day AI error:', err)
    }
  }

  // Fallback to deterministic selection
  const fallback = getDeterministicSkill()
  return NextResponse.json({
    skillId: fallback.id,
    rationale: null,
    source: 'fallback',
  })
}
