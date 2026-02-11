import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './_lib/db.js'

const FREE_RUN_LIMIT = 3
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, skillContext, userApiKey, fingerprint } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' })
  }

  if (!fingerprint || typeof fingerprint !== 'string') {
    return res.status(400).json({ error: 'fingerprint is required' })
  }

  try {
    let apiKey: string

    if (userApiKey && typeof userApiKey === 'string') {
      apiKey = userApiKey
    } else {
      const usageResult = await sql`
        SELECT COUNT(*) as count FROM playground_usage
        WHERE fingerprint = ${fingerprint}
      `
      const usageCount = parseInt(usageResult[0].count as string)

      if (usageCount >= FREE_RUN_LIMIT) {
        return res.status(402).json({
          error: 'Free run limit reached',
          limit: FREE_RUN_LIMIT,
          used: usageCount,
          message: 'Enter your own Gemini API key to continue testing skills.'
        })
      }

      const builtInKey = process.env.GEMINI_API_KEY
      if (!builtInKey) {
        return res.status(500).json({ error: 'AI service not configured' })
      }
      apiKey = builtInKey

      await sql`
        INSERT INTO playground_usage (fingerprint)
        VALUES (${fingerprint})
      `
    }

    // Build system prompt from skill context
    let systemPrompt = 'You are a helpful AI assistant.'
    if (skillContext) {
      const parts = [`You are an AI assistant demonstrating the "${skillContext.name}" skill.`]
      if (skillContext.description) {
        parts.push(`\nSkill description: ${skillContext.description}`)
      }
      if (skillContext.features?.length) {
        parts.push(`\nCapabilities:\n${skillContext.features.map((f: string) => `- ${f}`).join('\n')}`)
      }
      if (skillContext.useCases?.length) {
        parts.push(`\nUse cases:\n${skillContext.useCases.map((u: string) => `- ${u}`).join('\n')}`)
      }
      parts.push('\nRespond helpfully and demonstrate the skill\'s capabilities. Keep responses concise and practical.')
      systemPrompt = parts.join('')
    }

    const geminiUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nUser prompt: ${prompt}` }]
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

    let remaining: number | undefined
    if (!userApiKey) {
      const countResult = await sql`
        SELECT COUNT(*) as count FROM playground_usage
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
    console.error('Playground execution error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ error: 'Internal server error', details: message })
  }
}
