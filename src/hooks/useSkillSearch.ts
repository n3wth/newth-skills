'use client'
import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Skill } from '../data/skills'
import { filterAndSortSkills, type SortOption } from '../lib/skillSearch'

export type { SortOption }

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
 * Uses filterAndSortSkills for pure logic; hook handles state and side effects.
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

  const results = useMemo(
    () => filterAndSortSkills(skills, { category, query: debouncedQuery, sort }),
    [skills, category, debouncedQuery, sort]
  )

  const clearSearch = useCallback(() => setQuery(''), [])

  return {
    category,
    query,
    sort,
    results,
    setCategory,
    setQuery,
    setSort: handleSortChange,
    clearSearch,
  }
}
