'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Nav } from '../../src/components/Nav'
import { Footer } from '../../src/components/Footer'
import { FloatingShapes } from '../../src/components/FloatingShapes'
import { siteConfig } from '../../src/config/site'

export default function ContactClient() {
  const pageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!contentRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.fromTo(
      contentRef.current.querySelectorAll('.animate-in'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    )
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <FloatingShapes />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div ref={contentRef} className="max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity animate-in"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight animate-in">
            Contact
          </h1>

          <div className="space-y-8">
            <section className="animate-in">
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Have questions about skills, want to report an issue, or interested in contributing? Here's how to reach us.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                GitHub
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                The best way to report bugs, request features, or contribute skills is through our GitHub repository.
              </p>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Request a skill
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Need a skill that doesn't exist yet? Submit a request and the community can help build it.
              </p>
              <Link
                href="/request-skill"
                className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Request a skill
              </Link>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Author
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                The project is maintained by{' '}
                <a
                  href={siteConfig.links.about}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  {siteConfig.author}
                </a>
                . Follow on{' '}
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  Twitter/X
                </a>{' '}
                for updates.
              </p>
            </section>

            <section className="animate-in pt-8 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Ready to extend your AI?{' '}
                <Link
                  href="/"
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  Browse all skills
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
