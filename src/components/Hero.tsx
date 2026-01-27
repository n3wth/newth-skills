import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { categoryConfig } from '../config/categories'
import { siteConfig } from '../config/site'
import { CategoryShape } from './CategoryShape'
import { FloatingShapes } from './FloatingShapes'
import { HeroConstellation } from './HeroConstellation'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!heroRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const words = titleRef.current?.querySelectorAll('.hero-word')
    const categoryItems = categoriesRef.current?.children

    const tl = gsap.timeline({ defaults: { ease: 'cubic.out' } })

    // Staggered word entrance with elastic overshoot
    if (words) {
      tl.fromTo(
        words,
        { opacity: 0, y: 60, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.2)',
        }
      )
    }

    // Description fade in with slide
    if (descRef.current) {
      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
    }

    // Category icons stagger in with scale bounce
    if (categoryItems) {
      tl.fromTo(
        categoryItems,
        { opacity: 0, scale: 0.8, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(2)',
        },
        '-=0.3'
      )
    }
  }, { scope: heroRef })

  return (
    <div ref={heroRef} className="relative h-screen flex items-center px-6 md:px-12">
      <FloatingShapes />
      <HeroConstellation />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-4 md:mb-6 lg:mb-8"
            style={{ perspective: '1000px' }}
          >
            {siteConfig.hero.title.map((word, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className="hero-word inline-block text-white">{word}</span>
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-6 md:gap-8">
            <p
              ref={descRef}
              className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl"
              style={{ color: 'var(--color-grey-200)' }}
            >
              {siteConfig.description}<br />
              {siteConfig.tagline}
            </p>

            <div ref={categoriesRef} className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
              {Object.entries(categoryConfig).map(([key]) => (
                <div key={key} className="hero-category flex items-center gap-2 cursor-default">
                  <CategoryShape category={key} size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm" style={{ color: 'var(--color-grey-300)' }}>
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
