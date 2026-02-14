'use client'
import { useState, useMemo, useCallback, useEffect } from 'react'
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

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150)
    return () => clearTimeout(timer)
  }, [query])

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort)
    localStorage.setItem(SORT_STORAGE_KEY, newSort)
  }, [])

  // Pre-compute search index: single lowercase string per skill
  const searchIndex = useMemo(() =>
    skills.map(skill => ({
      skill,
      searchText: [skill.name, skill.description, ...skill.tags].join(' ').toLowerCase()
    }))
  , [skills])

  const results = useMemo(() => {
    // Filter by category
    let indexed = category === 'all'
      ? [...searchIndex]
      : searchIndex.filter(({ skill }) => skill.category === category)

    // Filter by search query using pre-computed index
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim()
      indexed = indexed.filter(({ searchText }) => searchText.includes(q))
    }

    let filtered = indexed.map(({ skill }) => skill)

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
  }, [searchIndex, category, debouncedQuery, sort])

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
