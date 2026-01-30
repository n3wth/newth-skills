'use client'
import { forwardRef, useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ value, onChange, placeholder = 'Search skills...' }, ref) {
    const [isFocused, setIsFocused] = useState(false)
    const iconRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!iconRef.current) return
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      if (isFocused) {
        gsap.to(iconRef.current, {
          scale: 1.1,
          rotate: 15,
          duration: 0.3,
          ease: 'back.out(2)',
        })
      } else {
        gsap.to(iconRef.current, {
          scale: 1,
          rotate: 0,
          duration: 0.2,
          ease: 'power2.out',
        })
      }
    }, [isFocused])

    return (
      <div ref={containerRef} className="relative w-full md:w-80 search-focus-ring rounded-full" style={{ border: '1px solid transparent' }}>
        <label htmlFor="skill-search" className="sr-only">
          Search skills
        </label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            ref={iconRef}
            className="h-4 w-4 transition-colors duration-200"
            style={{ color: isFocused ? 'var(--color-white)' : 'var(--color-grey-400)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={ref}
          id="skill-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="glass-pill w-full pl-10 pr-10 py-2 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20"
          aria-label="Search skills by name, description, or tags. Press / to focus."
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-grey-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
