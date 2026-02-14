import { describe, it, expect } from 'vitest'
import { filterAndSortSkills } from './skillSearch'
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

describe('filterAndSortSkills', () => {
  const skills: Skill[] = [
    createSkill({ id: 'a', name: 'Alpha', category: 'development', lastUpdated: '2025-01-01' }),
    createSkill({ id: 'b', name: 'Beta', category: 'creative', lastUpdated: '2025-01-15' }),
    createSkill({ id: 'c', name: 'Gamma', category: 'development', lastUpdated: '2025-01-10' }),
  ]

  describe('category filter', () => {
    it('returns all skills when category is "all"', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(3)
    })

    it('filters by category when not "all"', () => {
      const result = filterAndSortSkills(skills, {
        category: 'development',
        query: '',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(2)
      expect(result.map((s) => s.id)).toEqual(['a', 'c'])
    })

    it('returns empty array when no skills match category', () => {
      const result = filterAndSortSkills(skills, {
        category: 'business',
        query: '',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(0)
    })
  })

  describe('query filter', () => {
    it('returns all when query is empty', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(3)
    })

    it('filters by name (case-insensitive)', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: 'alpha',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Alpha')
    })

    it('filters by description', () => {
      const withDesc = [
        ...skills,
        createSkill({ id: 'd', name: 'Delta', description: 'Handles documents', category: 'documents' }),
      ]
      const result = filterAndSortSkills(withDesc, {
        category: 'all',
        query: 'documents',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Delta')
    })

    it('filters by tags', () => {
      const withTags = [
        ...skills,
        createSkill({ id: 'd', name: 'Delta', tags: ['pdf', 'export'], category: 'documents' }),
      ]
      const result = filterAndSortSkills(withTags, {
        category: 'all',
        query: 'pdf',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Delta')
    })

    it('returns empty when no match', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: 'xyznonexistent',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(0)
    })
  })

  describe('sort', () => {
    it('sorts by name ascending', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'name-asc',
      })
      expect(result.map((s) => s.name)).toEqual(['Alpha', 'Beta', 'Gamma'])
    })

    it('sorts by name descending', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'name-desc',
      })
      expect(result.map((s) => s.name)).toEqual(['Gamma', 'Beta', 'Alpha'])
    })

    it('sorts by category then name', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'category',
      })
      expect(result.map((s) => s.name)).toEqual(['Beta', 'Alpha', 'Gamma'])
    })

    it('sorts by recently updated (newest first)', () => {
      const result = filterAndSortSkills(skills, {
        category: 'all',
        query: '',
        sort: 'recently-updated',
      })
      expect(result.map((s) => s.name)).toEqual(['Beta', 'Gamma', 'Alpha'])
    })
  })

  describe('combined filters', () => {
    it('applies category then query then sort', () => {
      const withDesc = [
        ...skills,
        createSkill({ id: 'd', name: 'Alpha Doc', category: 'development', description: 'Documents' }),
      ]
      const result = filterAndSortSkills(withDesc, {
        category: 'development',
        query: 'alpha',
        sort: 'name-asc',
      })
      expect(result).toHaveLength(2)
      expect(result.map((s) => s.name)).toEqual(['Alpha', 'Alpha Doc'])
    })
  })
})
