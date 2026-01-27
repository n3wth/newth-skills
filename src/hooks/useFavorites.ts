import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'skill-favorites'

function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    return []
  }
  return []
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getStoredFavorites())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = useCallback((skillId: string) => {
    setFavorites(prev => {
      if (prev.includes(skillId)) return prev
      return [...prev, skillId]
    })
  }, [])

  const removeFavorite = useCallback((skillId: string) => {
    setFavorites(prev => prev.filter(id => id !== skillId))
  }, [])

  const toggleFavorite = useCallback((skillId: string) => {
    setFavorites(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId)
      }
      return [...prev, skillId]
    })
  }, [])

  const isFavorite = useCallback((skillId: string) => {
    return favorites.includes(skillId)
  }, [favorites])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  }
}
