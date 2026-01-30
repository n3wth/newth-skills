'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealOptions {
  duration?: number
  delay?: number
  staggerAmount?: number
  onScroll?: boolean
}

/**
 * Hook for revealing text character by character or word by word
 * Creates delightful staggered entrance animations
 */
export function useTextReveal(options: TextRevealOptions = {}) {
  const {
    duration = 0.6,
    delay = 0,
    staggerAmount = 0.03,
    onScroll = true,
  } = options

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const text = element.textContent || ''
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !text) return

    // Split text into characters
    const characters = text.split('')
    element.textContent = ''

    // Create spans for each character
    characters.forEach((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char // Non-breaking space for spaces
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      element.appendChild(span)
    })

    const spans = Array.from(element.querySelectorAll('span'))

    const ctx = gsap.context(() => {
      if (onScroll) {
        gsap.fromTo(
          spans,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: duration / 2,
            stagger: staggerAmount,
            ease: 'cubic.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else {
        gsap.fromTo(
          spans,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: duration / 2,
            stagger: staggerAmount,
            delay,
            ease: 'cubic.out',
          }
        )
      }
    }, element)

    return () => ctx.revert()
  }, [duration, delay, staggerAmount, onScroll])

  return ref
}
