import type { ReactElement } from 'react'
import { categoryConfig, type CategoryId } from '../config/categories'

interface CategoryShapeProps {
  category: string
  size?: number
  className?: string
}

function getConfig(category: string) {
  if (category in categoryConfig) {
    return categoryConfig[category as CategoryId]
  }
  return categoryConfig.development
}

function renderShape(shape: string, size: number, color: string): ReactElement | null {
  // Optical size compensation: different shapes need different scales
  // to appear the same visual weight. A triangle and diamond need to be
  // slightly larger than a circle to look balanced.
  const shapes: Record<string, ReactElement> = {
    circle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} />
      </svg>
    ),
    square: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" fill={color} />
      </svg>
    ),
    triangle: (
      <svg width={size * 1.1} height={size * 1.1} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L23 20H1L12 2Z" fill={color} />
      </svg>
    ),
    diamond: (
      <svg width={size * 1.05} height={size * 1.05} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={color} />
      </svg>
    ),
    hexagon: (
      <svg width={size * 1.05} height={size * 1.05} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill={color} />
      </svg>
    ),
  }

  return shapes[shape] || null
}

export function CategoryShape({ category, size = 12, className = '' }: CategoryShapeProps) {
  const config = getConfig(category)

  return (
    <span className={`inline-flex items-center justify-center shrink-0${className ? ` ${className}` : ''}`}>
      {renderShape(config.shape, size, config.color)}
    </span>
  )
}

// Renders a shape at a specific size (used in FloatingShapes)
export function RenderShape({ category, size }: { category: string; size: number }) {
  if (!(category in categoryConfig)) return null
  const config = categoryConfig[category as CategoryId]
  return renderShape(config.shape, size, config.color)
}
