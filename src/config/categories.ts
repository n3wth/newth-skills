// Category configuration - colors and shapes for each skill category
export const categoryConfig: Record<string, {
  color: string
  shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon'
}> = {
  development: { color: '#30d158', shape: 'circle' },
  documents: { color: '#ff6961', shape: 'square' },
  creative: { color: '#64d2ff', shape: 'triangle' },
  productivity: { color: '#a855f7', shape: 'hexagon' },
  business: { color: '#ffd60a', shape: 'diamond' },
}

// Floating shapes configuration for hero section
// Positions are relative to the hero container, centered vertically
export const floatingShapes = [
  { category: 'development', size: 180, top: '30%', right: '5%' },
  { category: 'documents', size: 120, top: '60%', right: '12%' },
  { category: 'creative', size: 150, top: '25%', right: '22%' },
  { category: 'business', size: 100, top: '70%', right: '3%' },
  { category: 'development', size: 70, top: '75%', right: '30%' },
  { category: 'creative', size: 90, top: '45%', right: '35%' },
  { category: 'business', size: 60, top: '20%', right: '42%' },
  { category: 'documents', size: 50, top: '80%', right: '18%' },
]
