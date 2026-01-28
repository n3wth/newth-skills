import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Hook for subtle button interaction animations
 * Creates depth-aware scale and opacity interactions
 */
export function useButtonPulse() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = ref.current
    if (!button) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      button?.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.02,
          duration: 0.2,
          ease: 'cubic.out',
        })
      })

      button?.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'cubic.out',
        })
      })

      button?.addEventListener('mousedown', () => {
        gsap.to(button, {
          scale: 0.96,
          duration: 0.1,
          ease: 'cubic.out',
        })
      })

      button?.addEventListener('mouseup', () => {
        gsap.to(button, {
          scale: 1.02,
          duration: 0.1,
          ease: 'cubic.out',
        })
      })
    }, button)

    return () => ctx.revert()
  }, [])

  return ref
}
