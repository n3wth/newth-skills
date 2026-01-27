import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './_lib/db'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const skillId = req.query.skillId as string

  if (!skillId) {
    return res.status(400).json({ error: 'skillId required' })
  }

  try {
    if (req.method === 'GET') {
      // Get vote count for a skill
      const result = await sql`
        SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}
      `
      return res.json({ count: parseInt(result[0].count as string) })
    }

    if (req.method === 'POST') {
      const { fingerprint } = req.body
      if (!fingerprint) {
        return res.status(400).json({ error: 'fingerprint required' })
      }

      // Insert vote (ignore if already exists)
      await sql`
        INSERT INTO votes (skill_id, fingerprint)
        VALUES (${skillId}, ${fingerprint})
        ON CONFLICT (skill_id, fingerprint) DO NOTHING
      `

      // Return new count
      const result = await sql`
        SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}
      `
      return res.json({ count: parseInt(result[0].count as string) })
    }

    if (req.method === 'DELETE') {
      const { fingerprint } = req.body
      if (!fingerprint) {
        return res.status(400).json({ error: 'fingerprint required' })
      }

      await sql`
        DELETE FROM votes WHERE skill_id = ${skillId} AND fingerprint = ${fingerprint}
      `

      const result = await sql`
        SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}
      `
      return res.json({ count: parseInt(result[0].count as string) })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Vote error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
