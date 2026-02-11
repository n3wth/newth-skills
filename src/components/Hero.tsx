'use client'
import { categoryConfig } from '../config/categories'
import { siteConfig } from '../config/site'
import { CategoryShape } from './CategoryShape'
import { FloatingShapes } from './FloatingShapes'
import { HeroConstellation } from './HeroConstellation'

export function Hero() {
  return (
    <div className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers - hidden on small screens for performance */}
      <div className="hidden sm:block absolute inset-0">
        <FloatingShapes />
        <HeroConstellation />
      </div>

      {/* Mobile-optimized content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div className="max-w-4xl">
          {/* Mobile-first heading - scales responsively */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 md:mb-8">
            {siteConfig.hero.title.map((word, i) => (
              <span key={i}>
                {i > 0 && <br className="hidden sm:block" />}
                <span className="hero-word inline-block text-white">{word}</span>
              </span>
            ))}
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
          </div>
        </div>
      </div>
    </div>
  )
}
