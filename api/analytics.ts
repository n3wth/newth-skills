import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './_lib/db.js'
import { skills } from '../src/data/skills.js'

const validSkillIds = new Set(skills.map(s => s.id))

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const skillId = req.query.skillId as string

      if (skillId) {
        // Get counts for a specific skill
        const views = await sql`
          SELECT COUNT(*) as count FROM analytics
          WHERE skill_id = ${skillId} AND event_type = 'view'
        `
        const copies = await sql`
          SELECT COUNT(*) as count FROM analytics
          WHERE skill_id = ${skillId} AND event_type = 'copy'
        `
        return res.json({
          views: parseInt(views[0].count as string),
          copies: parseInt(copies[0].count as string)
        })
      }

      // Get all skills analytics (for analytics page)
      const result = await sql`
        SELECT
          skill_id,
          SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as views,
          SUM(CASE WHEN event_type = 'copy' THEN 1 ELSE 0 END) as copies
        FROM analytics
        GROUP BY skill_id
        ORDER BY copies DESC
      `
      // Filter to only known/current skills and coerce counts to numbers
      const filtered = result
        .filter((row: Record<string, any>) => validSkillIds.has(row.skill_id))
        .map((row: Record<string, any>) => ({
          skill_id: row.skill_id,
          views: Number(row.views),
          copies: Number(row.copies)
        }))
      return res.json(filtered)
    }

    if (req.method === 'POST') {
      const { skillId, eventType } = req.body

      if (!skillId || !eventType) {
        return res.status(400).json({ error: 'skillId and eventType required' })
      }

      if (!['view', 'copy'].includes(eventType)) {
        return res.status(400).json({ error: 'eventType must be view or copy' })
      }

      await sql`
        INSERT INTO analytics (skill_id, event_type)
        VALUES (${skillId}, ${eventType})
      `

      return res.json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Analytics error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      return res.status(500).json({
        error: 'Database table not found. Run schema.sql to create tables.',
        details: errorMessage
      })
    }

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'DATABASE_URL not configured',
        details: 'Set DATABASE_URL environment variable in Vercel'
      })
    }

    return res.status(500).json({ error: 'Internal server error', details: errorMessage })
  }
}
