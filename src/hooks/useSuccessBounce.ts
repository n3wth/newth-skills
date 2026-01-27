import { useCallback, useRef } from 'react'
import gsap from 'gsap'

/**
 * Hook for success celebration animation
 * Creates a delightful bounce + scale effect for positive feedback
 */
export function useSuccessBounce() {
  const ref = useRef<HTMLElement>(null)

  const trigger = useCallback(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.timeline()
      .to(element, {
        scale: 1.15,
        duration: 0.15,
        ease: 'power2.out',
      })
      .to(element, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
  }, [])

  return { ref, trigger }
}

/**
 * Hook for shake animation on error/warning
 * Creates attention-grabbing wiggle effect
 */
export function useShake() {
  const ref = useRef<HTMLElement>(null)

  const trigger = useCallback(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.to(element, {
      keyframes: [
        { x: -8, duration: 0.05 },
        { x: 8, duration: 0.05 },
        { x: -6, duration: 0.05 },
        { x: 6, duration: 0.05 },
        { x: -4, duration: 0.05 },
        { x: 4, duration: 0.05 },
        { x: -2, duration: 0.05 },
        { x: 2, duration: 0.05 },
        { x: 0, duration: 0.05 },
      ],
      ease: 'power2.out',
    })
  }, [])

  return { ref, trigger }
}

/**
 * Hook for pulse attention animation
 * Creates subtle pulse to draw attention
 */
export function usePulse() {
  const ref = useRef<HTMLElement>(null)

  const trigger = useCallback(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.timeline()
      .to(element, {
        scale: 1.05,
        opacity: 0.8,
        duration: 0.2,
        ease: 'power2.out',
      })
      .to(element, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      })
  }, [])

  return { ref, trigger }
}
