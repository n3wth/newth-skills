'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { categories } from '../data/skills'
import { CategoryShape } from './CategoryShape'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const buttons = containerRef.current.querySelectorAll('button')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.25,
            ease: 'cubic.out',
          })
        })

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.25,
            ease: 'cubic.out',
          })
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hidden"
    >
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`glass-pill px-3 md:px-4 py-2 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 shrink-0 min-h-[44px] ${
            activeCategory === cat.id ? 'active' : ''
          }`}
        >
          {cat.id !== 'all' && <CategoryShape category={cat.id} size={10} />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
