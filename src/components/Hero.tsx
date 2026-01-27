import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { categoryConfig } from '../config/categories'
import { siteConfig } from '../config/site'
import { CategoryShape } from './CategoryShape'
import { FloatingShapes } from './FloatingShapes'

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!titleRef.current || !contentRef.current) return

    const words = titleRef.current.querySelectorAll('.hero-word')
    const content = contentRef.current

    gsap.set(words, { y: 100, opacity: 0, rotationX: -40 })
    gsap.set(content, { y: 40, opacity: 0 })

    const tl = gsap.timeline()

    tl.to(words, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
    })
    .to(content, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4')

  }, { scope: heroRef })

  return (
    <div ref={heroRef} className="relative h-screen flex items-center px-6 md:px-12 pt-14">
      <FloatingShapes />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-6 md:mb-8"
            style={{ perspective: '1000px' }}
          >
            {siteConfig.hero.title.map((word, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className="hero-word hero-gradient-text inline-block">{word}</span>
              </span>
            ))}
          </h1>

          <div ref={contentRef} className="flex flex-col gap-6 md:gap-8">
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
