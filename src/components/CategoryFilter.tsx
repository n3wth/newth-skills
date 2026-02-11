'use client'
import { useRef } from 'react'
import { categories } from '../data/skills'
import { CategoryShape } from './CategoryShape'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // No GSAP scale animation - text buttons use CSS transitions only

  return (
    <div
      ref={containerRef}
      className="flex gap-1 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hidden"
    >
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`category-filter-btn px-3 md:px-4 py-2 text-xs md:text-sm font-medium flex items-center gap-2 shrink-0 min-h-[44px] relative ${
            activeCategory === cat.id ? 'category-filter-active' : ''
          }`}
        >
          {cat.id !== 'all' && <CategoryShape category={cat.id} size={10} />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
