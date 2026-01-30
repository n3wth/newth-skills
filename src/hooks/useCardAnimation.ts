'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface CardAnimationOptions {
  duration?: number
  delay?: number
  stagger?: number
  enableHoverLift?: boolean
  hoverDuration?: number
}

/**
 * Hook for card entrance animations and hover depth effects
 * Creates a subtle 3D-like lifting effect without actual shadows
 */
export function useCardAnimation(options: CardAnimationOptions = {}) {
  const {
    duration = 0.6,
    delay = 0,
    stagger = 0.05,
    enableHoverLift = true,
    hoverDuration = 0.3,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-card]')
    if (cards.length === 0) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 24,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay: (i: number) => delay + i * stagger,
          ease: 'cubic.out',
          stagger: 0,
        }
      )

      // Hover effect - translate slightly up for depth
      if (enableHoverLift) {
        cards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -4,
              duration: hoverDuration,
              ease: 'cubic.out',
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              duration: hoverDuration,
              ease: 'cubic.out',
            })
          })
        })
      }
    }, container)

    return () => ctx.revert()
  }, [duration, delay, stagger, enableHoverLift, hoverDuration])

  return containerRef
}
