import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface MagneticOptions {
  strength?: number
  ease?: number
}

/**
 * Hook for magnetic hover effect on elements
 * Element subtly follows cursor when hovered - delightful and interactive
 */
export function useMagneticHover(options: MagneticOptions = {}) {
  const { strength = 0.3, ease = 0.15 } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      cancelAnimationFrame(animationId)
      animationId = requestAnimationFrame(() => {
        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          duration: ease,
          ease: 'power2.out',
        })
      })
    }

    const handleMouseLeave = () => {
      cancelAnimationFrame(animationId)
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, ease])

  return ref
}
