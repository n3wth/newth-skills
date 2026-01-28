import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface StaggerListOptions {
  duration?: number
  stagger?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

/**
 * Hook for staggered list item animations
 * Creates delightful cascade effects as items appear
 */
export function useStaggerList(options: StaggerListOptions = {}) {
  const {
    duration = 0.5,
    stagger = 0.08,
    delay = 0,
    direction = 'up',
  } = options

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const items = container.querySelectorAll('[data-stagger-item]')
    if (items.length === 0) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1 })
      return
    }

    const fromVars: gsap.TweenVars = { opacity: 0 }
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: 'cubic.out',
    }

    switch (direction) {
      case 'up':
        fromVars.y = 20
        toVars.y = 0
        break
      case 'down':
        fromVars.y = -20
        toVars.y = 0
        break
      case 'left':
        fromVars.x = 20
        toVars.x = 0
        break
      case 'right':
        fromVars.x = -20
        toVars.x = 0
        break
      case 'scale':
        fromVars.scale = 0.8
        toVars.scale = 1
        toVars.ease = 'back.out(1.7)'
        break
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(items, fromVars, toVars)
    }, container)

    return () => ctx.revert()
  }, [duration, stagger, delay, direction])

  return ref
}
