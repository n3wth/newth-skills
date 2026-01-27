// Category configuration - colors, glows, and shapes for each skill category
export const categoryConfig: Record<string, {
  color: string
  glow: string
  shape: 'circle' | 'square' | 'triangle' | 'diamond'
}> = {
  development: { color: '#30d158', glow: 'rgba(48, 209, 88, 0.3)', shape: 'circle' },
  documents: { color: '#ff6961', glow: 'rgba(255, 105, 97, 0.3)', shape: 'square' },
  creative: { color: '#64d2ff', glow: 'rgba(100, 210, 255, 0.3)', shape: 'triangle' },
  business: { color: '#ffd60a', glow: 'rgba(255, 214, 10, 0.3)', shape: 'diamond' },
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
