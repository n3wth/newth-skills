import { useState, useEffect, useCallback } from 'react'
import { getFingerprint } from '../lib/fingerprint'

interface RatingData {
  count: number
  average: number
  skillId: string
}

interface UseRatingReturn {
  rating: number
  count: number
  isLoading: boolean
  error: string | null
  submitRating: (rating: number) => Promise<void>
  userRating: number | null
}

const RATING_STORAGE_KEY = 'newth-skills-ratings'

// Store user ratings locally
function getUserRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(RATING_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function setUserRating(skillId: string, rating: number): void {
  if (typeof window === 'undefined') return
  try {
    const ratings = getUserRatings()
    ratings[skillId] = rating
    localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(ratings))
  } catch {
    // localStorage not available
  }
}

export function useRating(skillId: string): UseRatingReturn {
  const [rating, setRating] = useState(0)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRatingState] = useState<number | null>(null)

  // Fetch rating data
  useEffect(() => {
    async function fetchRating() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/ratings?skillId=${skillId}`)
        
        if (!response.ok) {
          // API not available - silently fail and use local storage only
          setIsLoading(false)
          
          // Check if user has rated this skill locally
          const userRatings = getUserRatings()
          if (userRatings[skillId]) {
            setUserRatingState(userRatings[skillId])
          }
          return
        }
        
        const data: RatingData = await response.json()
        setRating(data.average)
        setCount(data.count)
        
        // Check if user has rated this skill
        const userRatings = getUserRatings()
        if (userRatings[skillId]) {
          setUserRatingState(userRatings[skillId])
        }
        
        setError(null)
      } catch (err) {
        // API not available - silently fail and use local storage only
        const userRatings = getUserRatings()
        if (userRatings[skillId]) {
          setUserRatingState(userRatings[skillId])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRating()
  }, [skillId])

  const submitRating = useCallback(async (newRating: number) => {
    try {
      const fingerprint = await getFingerprint()
      
      const response = await fetch(`/api/ratings?skillId=${skillId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fingerprint,
          rating: newRating,
        }),
      })

      if (!response.ok) {
        // API not available - store locally only
        setUserRating(skillId, newRating)
        setUserRatingState(newRating)
        return
      }

      const data: RatingData = await response.json()
      setRating(data.average)
      setCount(data.count)
      setUserRating(skillId, newRating)
      setUserRatingState(newRating)
      setError(null)
    } catch (err) {
      // API not available - store locally only
      setUserRating(skillId, newRating)
      setUserRatingState(newRating)
    }
  }, [skillId])

  return {
    rating,
    count,
    isLoading,
    error,
    submitRating,
    userRating,
  }
}
