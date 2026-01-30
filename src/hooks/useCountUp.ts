'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpOptions {
  duration?: number
  delay?: number
  onScroll?: boolean
  suffix?: string
  prefix?: string
}

/**
 * Hook for animated number counting
 * Creates delightful counter animations that spring to life
 */
export function useCountUp(target: number, options: CountUpOptions = {}) {
  const {
    duration = 1.5,
    delay = 0,
    onScroll = true,
    suffix = '',
    prefix = '',
  } = options

  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setValue(target)
      return
    }

    const counter = { value: 0 }

    const animate = () => {
      if (hasAnimated.current) return
      hasAnimated.current = true

      gsap.to(counter, {
        value: target,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          setValue(Math.round(counter.value))
        },
      })
    }

    if (onScroll) {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: animate,
        once: true,
      })
    } else {
      animate()
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) trigger.kill()
      })
    }
  }, [target, duration, delay, onScroll])

  const displayValue = `${prefix}${value.toLocaleString()}${suffix}`

  return { ref, value, displayValue }
}
