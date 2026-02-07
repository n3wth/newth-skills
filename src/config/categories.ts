// Category identifiers - used for filtering and styling
export type CategoryId = 'development' | 'documents' | 'creative' | 'productivity' | 'business'

export type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon'

export interface CategoryConfig {
  color: string
  shape: ShapeType
}

// Category configuration - colors and shapes for each skill category
export const categoryConfig: Record<CategoryId, CategoryConfig> = {
  development: { color: '#30d158', shape: 'circle' },
  documents: { color: '#ff6961', shape: 'square' },
  creative: { color: '#64d2ff', shape: 'triangle' },
  productivity: { color: '#a855f7', shape: 'hexagon' },
  business: { color: '#ffd60a', shape: 'diamond' },
}

// Helper to get all category IDs
export const categoryIds = Object.keys(categoryConfig) as CategoryId[]
