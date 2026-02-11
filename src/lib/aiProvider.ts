import { getFingerprint } from './usageTracker'

export interface AIExecutionResult {
  result: string
  remaining?: number
  model?: string
}

export interface AIExecutionError {
  error: string
  message?: string
  limit?: number
  used?: number
}

export async function executeAI(
  prompt: string,
  options?: { apiKey?: string }
): Promise<AIExecutionResult> {
  const fingerprint = getFingerprint()

  const response = await fetch('/api/ai/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      userApiKey: options?.apiKey || undefined,
      fingerprint
    })
  })

  if (!response.ok) {
    const errorData: AIExecutionError = await response.json()

    if (response.status === 402) {
      throw new FreeLimitReachedError(
        errorData.message || 'Free run limit reached',
        errorData.limit || 3,
        errorData.used || 3
      )
    }

    if (response.status === 401) {
      throw new InvalidApiKeyError(
        errorData.message || 'Invalid API key'
      )
    }

    throw new AIExecutionFailedError(
      errorData.error || 'AI execution failed'
    )
  }

  return response.json()
}

export class FreeLimitReachedError extends Error {
  constructor(
    message: string,
    public limit: number,
    public used: number
  ) {
    super(message)
    this.name = 'FreeLimitReachedError'
  }
}

export class InvalidApiKeyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidApiKeyError'
  }
}

export class AIExecutionFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AIExecutionFailedError'
  }
}
