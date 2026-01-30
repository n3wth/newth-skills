import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SEO } from '../components/SEO'
import { FloatingShapes } from '../components/FloatingShapes'

export function Privacy() {
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
      <SEO
        title="Privacy Policy - newth.ai skills"
        description="Privacy policy for skills.newth.ai. Learn how we handle your data when using our AI skills directory for Claude Code and Gemini CLI."
        canonicalUrl="/privacy"
        keywords={['privacy policy', 'data protection', 'AI skills']}
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <FloatingShapes />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div ref={contentRef} className="max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity animate-in"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight animate-in">
            Privacy Policy
          </h1>

          <p
            className="text-sm mb-8 animate-in"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Last updated: January 2026
          </p>

          <div className="space-y-8">
            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Overview
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                skills.newth.ai is a directory of markdown-based skills for AI coding assistants. We are committed to protecting your privacy and being transparent about our data practices.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Data We Collect
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                We collect minimal data to improve the site experience:
              </p>
              <ul
                className="list-disc list-inside space-y-2 text-base"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <li>Anonymous usage analytics (page views, skill downloads)</li>
                <li>Error logs for debugging purposes</li>
                <li>Information you voluntarily provide (skill requests, contributions)</li>
              </ul>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Skills Installation
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                When you install a skill, the skill file is downloaded directly to your local machine. Skills are markdown files that run entirely within your AI assistant. We do not have access to your conversations, code, or any data processed by your AI assistant.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Third-Party Services
              </h2>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                We use the following third-party services:
              </p>
              <ul
                className="list-disc list-inside space-y-2 text-base"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <li>Vercel for hosting and analytics</li>
                <li>GitHub for skill file hosting and issue tracking</li>
              </ul>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Cookies
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                We use localStorage to remember your theme preference (light/dark mode). We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Data Retention
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Anonymous analytics data is retained for up to 12 months. Error logs are automatically purged after 30 days.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Your Rights
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                You can request deletion of any data associated with you by contacting us through GitHub. As we collect minimal personal data, most users have no personal information stored on our servers.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Changes to This Policy
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="animate-in">
              <h2 className="text-2xl font-medium text-white mb-4">
                Contact
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                For privacy-related questions, please open an issue on our{' '}
                <a
                  href="https://github.com/n3wth/newth-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  GitHub repository
                </a>{' '}
                or visit our{' '}
                <Link
                  to="/contact"
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
