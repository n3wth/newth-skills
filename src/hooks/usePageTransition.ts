'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PageTransitionOptions {
  duration?: number
  exitDuration?: number
}

/**
 * Hook for page entrance/exit animations
 * Creates smooth transitions when navigating between pages
 */
export function usePageTransition(options: PageTransitionOptions = {}) {
  const { duration = 0.5, exitDuration = 0.25 } = options
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      page.style.opacity = '1'
      return
    }

    // Entrance animation
    gsap.fromTo(
      page,
      {
        opacity: 0,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        ease: 'cubic.out',
      }
    )

    // Store exit animation in a data attribute for when component unmounts
    return () => {
      if (page) {
        gsap.to(page, {
          opacity: 0,
          y: -8,
          duration: exitDuration,
          ease: 'cubic.in',
        })
      }
    }
  }, [duration, exitDuration])

  return pageRef
}
