'use client'
import { categoryConfig } from '../config/categories'
import { siteConfig } from '../config/site'
import { CategoryShape } from './CategoryShape'
import { FloatingShapes } from './FloatingShapes'
import { HeroConstellation } from './HeroConstellation'

export function Hero() {
  return (
    <div className="relative h-screen flex items-center px-6 md:px-12">
      <FloatingShapes />
      <HeroConstellation />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-4 md:mb-6 lg:mb-8">
            {siteConfig.hero.title.map((word, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className="hero-word inline-block text-white">{word}</span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-6 md:gap-8">
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl"
              style={{ color: 'var(--color-grey-200)' }}
            >
              {siteConfig.description}<br />
              {siteConfig.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {Object.entries(categoryConfig).map(([key]) => (
                <div key={key} className="hero-category flex items-center gap-1.5 sm:gap-2 cursor-default">
                  <CategoryShape category={key} size={12} className="shrink-0" />
                  <span className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap" style={{ color: 'var(--color-grey-300)' }}>
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
