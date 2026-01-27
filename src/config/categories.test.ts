import { describe, it, expect } from 'vitest'
import { categoryConfig, floatingShapes } from './categories'

describe('categoryConfig', () => {
  it('should have configuration for all main categories', () => {
    const expectedCategories = ['development', 'documents', 'creative', 'business']

    expectedCategories.forEach(category => {
      expect(categoryConfig[category]).toBeDefined()
    })
  })

  it('should have valid color and shape for each category', () => {
    const validShapes = ['circle', 'square', 'triangle', 'diamond']

    Object.values(categoryConfig).forEach((config) => {
      expect(config.color).toBeDefined()
      expect(typeof config.color).toBe('string')
      expect(config.color.startsWith('#') || config.color.startsWith('rgb')).toBe(true)

      expect(validShapes).toContain(config.shape)
    })
  })

  it('should map categories to correct shapes', () => {
    expect(categoryConfig.development.shape).toBe('circle')
    expect(categoryConfig.documents.shape).toBe('square')
    expect(categoryConfig.creative.shape).toBe('triangle')
    expect(categoryConfig.business.shape).toBe('diamond')
  })
})

describe('floatingShapes', () => {
  it('should be an array with items', () => {
    expect(Array.isArray(floatingShapes)).toBe(true)
    expect(floatingShapes.length).toBeGreaterThan(0)
  })

  it('should have valid shape configuration', () => {
    floatingShapes.forEach(shape => {
      expect(shape.category).toBeDefined()
      expect(typeof shape.category).toBe('string')

      expect(shape.size).toBeDefined()
      expect(typeof shape.size).toBe('number')
      expect(shape.size).toBeGreaterThan(0)

      expect(shape.top).toBeDefined()
      expect(typeof shape.top).toBe('string')

      expect(shape.right).toBeDefined()
      expect(typeof shape.right).toBe('string')
    })
  })

  it('should reference valid categories', () => {
    const validCategories = Object.keys(categoryConfig)

    floatingShapes.forEach(shape => {
      expect(validCategories).toContain(shape.category)
    })
  })
})
