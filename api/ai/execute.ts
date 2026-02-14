import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../_lib/db.js'

const FREE_RUN_LIMIT = 3
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = ['https://skills.newth.ai', 'http://localhost:3000']
  const origin = req.headers?.origin || ''
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : 'https://skills.newth.ai')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, userApiKey, fingerprint } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' })
  }

  if (!fingerprint || typeof fingerprint !== 'string') {
    return res.status(400).json({ error: 'fingerprint is required' })
  }

  try {
    let apiKey: string

    if (userApiKey && typeof userApiKey === 'string') {
      // User provided their own key -- no usage limits
      apiKey = userApiKey
    } else {
      // Check free tier usage
      const usageResult = await sql`
        SELECT COUNT(*) as count FROM workflow_usage
        WHERE fingerprint = ${fingerprint}
      `
      const usageCount = parseInt(usageResult[0].count as string)

      if (usageCount >= FREE_RUN_LIMIT) {
        return res.status(402).json({
          error: 'Free run limit reached',
          limit: FREE_RUN_LIMIT,
          used: usageCount,
          message: 'Enter your own Gemini API key to continue running workflows.'
        })
      }

      const builtInKey = process.env.GEMINI_API_KEY
      if (!builtInKey) {
        return res.status(500).json({ error: 'AI service not configured' })
      }
      apiKey = builtInKey

      // Record usage
      await sql`
        INSERT INTO workflow_usage (fingerprint)
        VALUES (${fingerprint})
      `
    }

    // Call Gemini API
    const geminiUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI workflow executor. Process the following workflow and generate real, useful output for each step.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    })

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text()

      if (geminiResponse.status === 400 || geminiResponse.status === 403) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'The API key provided is invalid or has expired.'
        })
      }

      return res.status(502).json({
        error: 'AI service error',
        details: errorData
      })
    }

    const data = await geminiResponse.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Get remaining free runs if using built-in key
    let remaining: number | undefined
    if (!userApiKey) {
      const countResult = await sql`
        SELECT COUNT(*) as count FROM workflow_usage
        WHERE fingerprint = ${fingerprint}
      `
      remaining = Math.max(0, FREE_RUN_LIMIT - parseInt(countResult[0].count as string))
    }

    return res.json({
      result: text,
      remaining,
      model: GEMINI_MODEL
    })
  } catch (error) {
    console.error('AI execution error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ error: 'Internal server error', details: message })
  }
}
