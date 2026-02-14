'use client'
import { useState, useEffect } from 'react'
import { categoryConfig } from '../config/categories'
import { siteConfig } from '../config/site'
import { CategoryShape } from './CategoryShape'
import { FloatingShapes } from './FloatingShapes'
import { HeroConstellation } from './HeroConstellation'

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const rotatingWords = ['Extend', 'Sharpen', 'Equip', 'Teach']

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % rotatingWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-[40vh] sm:min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers - hidden on small screens for performance */}
      <div className="hidden sm:block absolute inset-0">
        <FloatingShapes />
        <HeroConstellation />
      </div>

      {/* Mobile-optimized content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-16">
        <div className="max-w-4xl">
          {/* Mobile-first heading - scales responsively */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 md:mb-8">
            <span className="hero-word inline-block text-white hero-rotating-word" key={wordIndex}>
              {rotatingWords[wordIndex]}
            </span>
            {' '}
            <br className="hidden sm:block" />
            <span className="hero-word inline-block text-white">{siteConfig.hero.title[1]}</span>
          </h1>

          {/* Two-column layout on mobile, flex on larger screens */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            {/* Description - optimized for mobile readability */}
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed max-w-xl pr-2 sm:pr-0"
              style={{ color: 'var(--color-grey-200)' }}
            >
              {siteConfig.description}
              <br className="hidden sm:block" />
              {siteConfig.tagline}
            </p>

            {/* Category badges - horizontal scroll on mobile, wrap on larger */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hidden snap-x snap-mandatory">
              {Object.entries(categoryConfig).map(([key]) => (
                <div key={key} className="hero-category flex items-center gap-1 sm:gap-1.5 cursor-default flex-shrink-0 snap-start">
                  <CategoryShape category={key} size={10} className="shrink-0 sm:w-3 sm:h-3" />
                  <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: 'var(--color-grey-300)' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <a
              href="#main-content"
              className="hero-cta inline-flex items-center gap-2 mt-2 sm:mt-4 px-4 py-2 rounded-full text-xs sm:text-sm font-medium btn-press transition-colors w-fit"
              style={{
                color: 'var(--color-white)',
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              Browse Skills
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
