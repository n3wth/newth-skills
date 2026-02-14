'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories } from '../data/skills'
import { assistantList } from '../config/assistants'

gsap.registerPlugin(ScrollTrigger)

interface StatProps {
  value: number
  label: string
  suffix?: string
}

function AnimatedStat({ value, label, suffix = '' }: StatProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = valueRef.current
    if (!element || hasAnimated.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      element.textContent = `${value}${suffix}`
      return
    }

    const counter = { value: 0 }

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return
        hasAnimated.current = true

        gsap.to(counter, {
          value,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value)}${suffix}`
          },
        })
      },
      once: true,
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) trigger.kill()
      })
    }
  }, [value, suffix])

  return (
    <div className="text-center px-2">
      <span
        ref={valueRef}
        className="block text-3xl sm:text-4xl md:text-5xl font-semibold text-white counter-animate"
      >
        0{suffix}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: 'var(--color-grey-400)' }}>
        {label}
      </span>
    </div>
  )
}

export function StatsRow() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate stats from actual data
  const totalSkills = skills.length
  const totalCategories = categories.length - 1 // Exclude "all"
  const totalAssistants = assistantList.length
  const totalContributors = new Set(skills.map(s => s.contributor?.name).filter(Boolean)).size

  useEffect(() => {
    if (!containerRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const items = containerRef.current.querySelectorAll('[data-stat]')

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.5)',
          }
        )
      },
      once: true,
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 py-6 sm:py-8 md:py-12 mb-8 md:mb-12 rounded-2xl"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <div data-stat>
        <AnimatedStat value={totalSkills} label="Skills" />
      </div>
      <div data-stat>
        <AnimatedStat value={totalCategories} label="Categories" />
      </div>
      <div data-stat>
        <AnimatedStat value={totalAssistants} label="AI Assistants" />
      </div>
      <div data-stat>
        <AnimatedStat value={totalContributors} label="Contributors" />
      </div>
    </div>
  )
}
