import { categoryConfig } from '../config/categories'

interface CategoryShapeProps {
  category: string
  size?: number
}

export function CategoryShape({ category, size = 12 }: CategoryShapeProps) {
  const config = categoryConfig[category] || categoryConfig.development

  const shapes = {
    circle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={config.color} />
      </svg>
    ),
    square: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="0" fill={config.color} />
      </svg>
    ),
    triangle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L22 21H2L12 3Z" fill={config.color} />
      </svg>
    ),
    diamond: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={config.color} />
      </svg>
    ),
  }

  return (
    <div style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }}>
      {shapes[config.shape]}
    </div>
  )
}

// Renders a shape at a specific size (used in FloatingShapes)
export function RenderShape({ category, size }: { category: string; size: number }) {
  const config = categoryConfig[category]
  if (!config) return null

  return (
    <>
      {config.shape === 'circle' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={config.color} />
        </svg>
      )}
      {config.shape === 'square' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="0" fill={config.color} />
        </svg>
      )}
      {config.shape === 'triangle' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 3L22 21H2L12 3Z" fill={config.color} />
        </svg>
      )}
      {config.shape === 'diamond' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={config.color} />
        </svg>
      )}
    </>
  )
}
