'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav } from '../../src/components/Nav'
import { Footer } from '../../src/components/Footer'
import { FloatingShapes } from '../../src/components/FloatingShapes'

gsap.registerPlugin(ScrollTrigger)

export default function AboutClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero title animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.animate-in'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )
      }

      // Section animations on scroll
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('section')
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true,
              },
            }
          )
        })
      }

      // Comparison card animation
      if (comparisonRef.current) {
        const columns = comparisonRef.current.querySelectorAll('[data-col]')
        gsap.fromTo(
          columns,
          { opacity: 0, x: (i) => (i === 0 ? -30 : 30) },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )

        // Animate list items
        const listItems = comparisonRef.current.querySelectorAll('li')
        gsap.fromTo(
          listItems,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      }

      // Feature cards stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.glass-card')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <FloatingShapes />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-3xl">
          <div ref={heroRef}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity animate-in"
              style={{ color: 'var(--color-grey-400)' }}
            >
              <span>&larr;</span> Back to skills
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-8 tracking-tight animate-in">
              What are Skills?
            </h1>
          </div>

          <div ref={sectionsRef} className="space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Specialized knowledge, instantly loaded
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are markdown files that teach your AI assistant how to do specific things. When you install a skill, your AI gains the context it needs to help with that domain: the right patterns, best practices, and common pitfalls to avoid.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Want Claude to build scroll animations? Install the GSAP skill. Need it to generate PDFs? There's a skill for that. Each skill is curated knowledge that your AI can reference immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Skills vs MCP servers
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                You might be wondering: why skills instead of MCP servers? MCP servers connect your AI to live systems: databases, APIs, real-time data. Skills are different. They're static files that work without any infrastructure.
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills take a fundamentally different approach. Instead of running external servers, skills are static markdown files that provide instructions and context directly to your AI assistant. This makes them lightweight, portable, and instantly available without any server setup or maintenance.
              </p>
              <div ref={comparisonRef} className="glass-card p-6 md:p-8 mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div data-col>
                    <h3
                      className="text-lg font-medium mb-3"
                      style={{ color: 'var(--color-mint)' }}
                    >
                      Skills
                    </h3>
                    <ul
                      className="space-y-2 text-base"
                      style={{ color: 'var(--color-grey-200)' }}
                    >
                      <li>Markdown files with instructions</li>
                      <li>No server required</li>
                      <li>Instant installation</li>
                      <li>Works offline</li>
                      <li>Zero maintenance</li>
                      <li>Portable across machines</li>
                    </ul>
                  </div>
                  <div data-col>
                    <h3
                      className="text-lg font-medium mb-3"
                      style={{ color: 'var(--color-coral)' }}
                    >
                      MCP Servers
                    </h3>
                    <ul
                      className="space-y-2 text-base"
                      style={{ color: 'var(--color-grey-200)' }}
                    >
                      <li>Running server processes</li>
                      <li>Can access external APIs</li>
                      <li>Real-time data integration</li>
                      <li>Requires server infrastructure</li>
                      <li>Needs ongoing maintenance</li>
                      <li>More complex setup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                When to use each
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <strong style={{ color: 'var(--color-white)' }}>Use skills</strong> when you need to teach your AI how to do something: following framework best practices, writing code in a particular style, or understanding domain-specific concepts. Skills excel at guidance, patterns, and workflows.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <strong style={{ color: 'var(--color-white)' }}>Use MCP servers</strong> when your AI needs to interact with external systems, fetch real-time data, or perform actions that require API access. MCPs are ideal for databases, third-party services, and live connections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                How it works
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are markdown files that get installed into your AI assistant's configuration directory. When you ask for help, your assistant reads the relevant skill to understand how to approach the problem.
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Each skill contains structured instructions, examples, and best practices. Your AI uses this to provide more accurate and consistent help for that specific domain.
              </p>
              <div className="command-box p-4 mt-6">
                <code
                  className="text-sm font-mono"
                  style={{ color: 'var(--color-grey-200)' }}
                >
                  curl -fsSL https://skills.newth.ai/install.sh | bash
                </code>
              </div>
              <p
                className="text-sm mt-3"
                style={{ color: 'var(--color-grey-400)' }}
              >
                Skills are installed to your assistant's config directory. Takes about 5 seconds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Why skills?
              </h2>
              <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-sage)' }}
                  >
                    Just files
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    Copy them anywhere, share with your team, or version control them alongside your project.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-mint)' }}
                  >
                    Zero infrastructure
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    No processes, no ports, no servers. Skills run entirely within your AI assistant.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Works offline
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    No network dependency. Your AI reads skills from your local filesystem.
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Ready to give your AI new capabilities?{' '}
                <Link
                  href="/"
                  className="link-hover"
                  style={{ color: 'var(--color-white)' }}
                >
                  Browse all skills
                </Link>{' '}
                and start building.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
