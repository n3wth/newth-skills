import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
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
      // Get rating stats for a skill
      const result = await sql`
        SELECT 
          COUNT(*) as count,
          AVG(rating) as average
        FROM ratings 
        WHERE skill_id = ${skillId}
      `
      
      const count = parseInt(result[0].count as string)
      const average = count > 0 ? parseFloat(result[0].average as string) : 0
      
      return res.json({ 
        count,
        average: Math.round(average * 10) / 10, // Round to 1 decimal
        skillId
      })
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { fingerprint, rating } = req.body
      
      if (!fingerprint) {
        return res.status(400).json({ error: 'fingerprint required' })
      }
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating must be between 1 and 5' })
      }

      // Upsert rating (insert or update if exists)
      await sql`
        INSERT INTO ratings (skill_id, fingerprint, rating, updated_at)
        VALUES (${skillId}, ${fingerprint}, ${rating}, NOW())
        ON CONFLICT (skill_id, fingerprint) 
        DO UPDATE SET rating = ${rating}, updated_at = NOW()
      `

      // Return updated stats
      const result = await sql`
        SELECT 
          COUNT(*) as count,
          AVG(rating) as average
        FROM ratings 
        WHERE skill_id = ${skillId}
      `
      
      const count = parseInt(result[0].count as string)
      const average = parseFloat(result[0].average as string)
      
      return res.json({ 
        count,
        average: Math.round(average * 10) / 10,
        skillId
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Ratings error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Check for common issues
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
