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
export const floatingShapes = [
  { category: 'development', size: 180, top: '15%', right: '5%' },
  { category: 'documents', size: 120, top: '55%', right: '12%' },
  { category: 'creative', size: 150, top: '20%', right: '22%' },
  { category: 'business', size: 100, top: '70%', right: '3%' },
  { category: 'development', size: 70, top: '80%', right: '30%' },
  { category: 'creative', size: 90, top: '40%', right: '35%' },
  { category: 'business', size: 60, top: '10%', right: '42%' },
  { category: 'documents', size: 50, top: '85%', right: '18%' },
]
