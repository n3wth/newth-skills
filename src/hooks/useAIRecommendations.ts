import { useState, useEffect, useRef } from 'react'
import { skills, type Skill } from '../data/skills'
import { getRecommendations } from '../lib/recommendations'

interface AIRecommendation {
  skillId: string
  reason: string
}

interface RecommendationResult {
  skill: Skill
  score: number
  matchedTerms: string[]
  aiReason?: string
}

export function useAIRecommendations(query: string, maxResults: number = 6) {
  const [results, setResults] = useState<RecommendationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (!query.trim() || query.trim().length < 3) {
      setResults([])
      setIsLoading(false)
      return
    }

    // Immediately show local results
    const localResults = getRecommendations(query, maxResults)
    setResults(localResults)

    // Debounce AI call
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: abortControllerRef.current.signal
        })

        if (!response.ok) throw new Error('API error')

        const data = await response.json()
        const aiRecs: AIRecommendation[] = data.recommendations || []

        if (aiRecs.length > 0) {
          // Map AI recommendations to full skill objects
          const aiResults: RecommendationResult[] = aiRecs
            .map((rec, index) => {
              const skill = skills.find(s => s.id === rec.skillId)
              if (!skill) return null
              return {
                skill,
                score: 100 - index * 10, // AI results are pre-sorted by relevance
                matchedTerms: [],
                aiReason: rec.reason
              }
            })
            .filter((r): r is RecommendationResult => r !== null)
            .slice(0, maxResults)

          if (aiResults.length > 0) {
            setResults(aiResults)
          }
        }
      } catch (error) {
        // Keep local results on error (already set)
        if ((error as Error).name !== 'AbortError') {
          console.error('AI recommendations failed, using local:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, maxResults])

  return { results, isLoading }
}
