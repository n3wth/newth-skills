import { describe, it, expect } from 'vitest'
import { skills, categories, type Skill } from './skills'

describe('skills data', () => {
  it('should have skills array with items', () => {
    expect(Array.isArray(skills)).toBe(true)
    expect(skills.length).toBeGreaterThan(0)
  })

  it('should have valid skill structure for all skills', () => {
    const validCategories = ['development', 'documents', 'creative', 'productivity', 'business']

    skills.forEach((skill: Skill) => {
      expect(skill.id).toBeDefined()
      expect(typeof skill.id).toBe('string')
      expect(skill.id.length).toBeGreaterThan(0)

      expect(skill.name).toBeDefined()
      expect(typeof skill.name).toBe('string')

      expect(skill.description).toBeDefined()
      expect(typeof skill.description).toBe('string')

      expect(validCategories).toContain(skill.category)

      expect(Array.isArray(skill.tags)).toBe(true)
      expect(skill.tags.length).toBeGreaterThan(0)

      expect(skill.icon).toBeDefined()
      expect(typeof skill.icon).toBe('string')

      expect(skill.color).toBeDefined()
      expect(typeof skill.color).toBe('string')
    })
  })

  it('should have unique skill IDs', () => {
    const ids = skills.map(skill => skill.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have featured skills', () => {
    const featuredSkills = skills.filter(skill => skill.featured)
    expect(featuredSkills.length).toBeGreaterThan(0)
  })

  it('should have skills with optional fields properly typed', () => {
    skills.forEach((skill: Skill) => {
      if (skill.longDescription !== undefined) {
        expect(typeof skill.longDescription).toBe('string')
      }
      if (skill.features !== undefined) {
        expect(Array.isArray(skill.features)).toBe(true)
      }
      if (skill.useCases !== undefined) {
        expect(Array.isArray(skill.useCases)).toBe(true)
      }
      if (skill.compatibility !== undefined) {
        expect(Array.isArray(skill.compatibility)).toBe(true)
        skill.compatibility.forEach(compat => {
          expect(['gemini', 'claude', 'cursor', 'windsurf', 'copilot']).toContain(compat)
        })
      }
    })
  })
})

describe('categories data', () => {
  it('should have categories array with items', () => {
    expect(Array.isArray(categories)).toBe(true)
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should have valid category structure', () => {
    categories.forEach(category => {
      expect(category.id).toBeDefined()
      expect(typeof category.id).toBe('string')

      expect(category.name).toBeDefined()
      expect(typeof category.name).toBe('string')

      expect(typeof category.count).toBe('number')
      expect(category.count).toBeGreaterThanOrEqual(0)
    })
  })

  it('should have an "all" category', () => {
    const allCategory = categories.find(cat => cat.id === 'all')
    expect(allCategory).toBeDefined()
  })

  it('should have category counts matching actual skills', () => {
    const categoryIds = ['development', 'documents', 'creative', 'productivity', 'business']

    categoryIds.forEach(categoryId => {
      const category = categories.find(cat => cat.id === categoryId)
      if (category) {
        const skillsInCategory = skills.filter(skill => skill.category === categoryId)
        expect(category.count).toBe(skillsInCategory.length)
      }
    })
  })
})
