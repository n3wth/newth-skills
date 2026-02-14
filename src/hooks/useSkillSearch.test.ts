import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSkillSearch } from './useSkillSearch'
import type { Skill } from '../data/skills'

const createSkill = (overrides: Partial<Skill>): Skill => ({
  id: 'test',
  name: 'Test',
  description: 'A test skill',
  category: 'development',
  tags: [],
  icon: '◎',
  color: '#000',
  version: '1.0.0',
  lastUpdated: '2025-01-01',
  ...overrides,
})

const skills: Skill[] = [
  createSkill({ id: 'a', name: 'Alpha', category: 'development' }),
  createSkill({ id: 'b', name: 'Beta', category: 'creative' }),
  createSkill({ id: 'c', name: 'Gamma', category: 'development' }),
]

describe('useSkillSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns all skills when no filters applied', () => {
    const { result } = renderHook(() => useSkillSearch(skills))
    expect(result.current.results).toHaveLength(3)
  })

  it('filters by category when setCategory is called', () => {
    const { result } = renderHook(() => useSkillSearch(skills))
    act(() => {
      result.current.setCategory('development')
    })
    expect(result.current.results).toHaveLength(2)
    expect(result.current.results.map((s) => s.id)).toEqual(['a', 'c'])
  })

  it('filters by query when setQuery is called (debounced)', () => {
    const { result } = renderHook(() => useSkillSearch(skills))
    act(() => {
      result.current.setQuery('alpha')
    })
    expect(result.current.results).toHaveLength(3)
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].name).toBe('Alpha')
  })

  it('clears search when clearSearch is called', () => {
    const { result } = renderHook(() => useSkillSearch(skills))
    act(() => {
      result.current.setQuery('alpha')
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current.results).toHaveLength(1)
    act(() => {
      result.current.clearSearch()
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current.query).toBe('')
    expect(result.current.results).toHaveLength(3)
  })

  it('persists sort preference to localStorage when setSort is called', () => {
    const { result } = renderHook(() => useSkillSearch(skills))
    act(() => {
      result.current.setSort('name-desc')
    })
    expect(localStorage.setItem).toHaveBeenCalledWith('newth-skills-sort-preference', 'name-desc')
    expect(result.current.sort).toBe('name-desc')
    expect(result.current.results.map((s) => s.name)).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('uses stored sort preference from localStorage on init', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('recently-updated')
    const { result } = renderHook(() => useSkillSearch(skills))
    expect(result.current.sort).toBe('recently-updated')
  })
})
