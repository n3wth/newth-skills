import { useState, useMemo, useCallback } from 'react'
import type { Skill } from '../data/skills'

export type SortOption = 'name-asc' | 'name-desc' | 'category' | 'recently-updated'

const SORT_STORAGE_KEY = 'newth-skills-sort-preference'

function getStoredSortPreference(): SortOption {
  if (typeof window === 'undefined') return 'name-asc'
  const stored = localStorage.getItem(SORT_STORAGE_KEY)
  if (stored && ['name-asc', 'name-desc', 'category', 'recently-updated'].includes(stored)) {
    return stored as SortOption
  }
  return 'name-asc'
}

/**
 * Hook for filtering, sorting, and searching skills.
 * Encapsulates all skill browsing logic with localStorage persistence.
 */
export function useSkillSearch(skills: Skill[]) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>(getStoredSortPreference)

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort)
    localStorage.setItem(SORT_STORAGE_KEY, newSort)
  }, [])

  const results = useMemo(() => {
    // Filter by category
    let filtered = category === 'all'
      ? [...skills]
      : skills.filter(s => s.category === category)

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    // Sort results
    switch (sort) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
        break
      case 'recently-updated':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
    }

    return filtered
  }, [skills, category, query, sort])

  const clearSearch = useCallback(() => setQuery(''), [])

  return {
    // State
    category,
    query,
    sort,
    results,
    // Actions
    setCategory,
    setQuery,
    setSort: handleSortChange,
    clearSearch,
  }
}
