'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  duration?: number
  delay?: number
  stagger?: boolean | number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

/**
 * Hook that creates scroll-triggered entrance animations
 * Uses GSAP ScrollTrigger for performant viewport-based reveals
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    direction = 'up',
    distance = 40,
  } = options

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const children = Array.from(element.children) as HTMLElement[]
    if (children.length === 0) return

    const directions = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    }

    const movement = directions[direction]

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      children.forEach(child => {
        child.style.opacity = '1'
      })
      return
    }

    // Create timeline for staggered reveals
    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        {
          opacity: 0,
          ...movement,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          stagger: stagger ? (typeof stagger === 'number' ? stagger : 0.1) : 0,
          ease: 'cubic.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, element)

    return () => ctx.revert()
  }, [duration, delay, stagger, direction, distance])

  return ref
}
