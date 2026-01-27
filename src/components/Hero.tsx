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
          <h1
            className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-6 md:mb-8"
          >
            {siteConfig.hero.title.map((word, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className="hero-word hero-gradient-text inline-block">{word}</span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-6 md:gap-8">
            <p
              className="text-base md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'var(--color-grey-200)' }}
            >
              {siteConfig.description}<br />
              {siteConfig.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {Object.entries(categoryConfig).map(([key]) => (
                <div key={key} className="flex items-center gap-2.5">
                  <CategoryShape category={key} size={16} />
                  <span className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
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
