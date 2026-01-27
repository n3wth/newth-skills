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

// Floating shapes configuration for hero section
export const floatingShapes = [
  { category: 'development' as CategoryId, size: 180, top: '30%', right: '5%' },
  { category: 'documents' as CategoryId, size: 120, top: '60%', right: '12%' },
  { category: 'creative' as CategoryId, size: 150, top: '25%', right: '22%' },
  { category: 'business' as CategoryId, size: 100, top: '70%', right: '3%' },
  { category: 'development' as CategoryId, size: 70, top: '75%', right: '30%' },
  { category: 'creative' as CategoryId, size: 90, top: '45%', right: '35%' },
  { category: 'business' as CategoryId, size: 60, top: '20%', right: '42%' },
  { category: 'documents' as CategoryId, size: 50, top: '80%', right: '18%' },
]
