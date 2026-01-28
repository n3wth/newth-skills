import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Hook for category shape subtle rotation on interaction
 * Lightweight alternative to MorphSVGPlugin for flat design consistency
 */
export function useShapeMorph() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const container = svg.closest('[data-shape-morph]')
    if (!container) return

    const handleMouseEnter = () => {
      gsap.to(svg, {
        rotation: 8,
        duration: 0.4,
        ease: 'cubic.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(svg, {
        rotation: 0,
        duration: 0.3,
        ease: 'cubic.out',
      })
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return svgRef
}
