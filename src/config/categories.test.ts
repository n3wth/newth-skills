import { describe, it, expect } from 'vitest'
import { categoryConfig } from './categories'

describe('categoryConfig', () => {
  it('should have configuration for all main categories', () => {
    const expectedCategories = ['development', 'documents', 'creative', 'productivity', 'business']

    expectedCategories.forEach(category => {
      expect(categoryConfig[category]).toBeDefined()
    })
  })

  it('should have valid color and shape for each category', () => {
    const validShapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon']

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
