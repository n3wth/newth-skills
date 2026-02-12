'use client'

import Link from 'next/link'
import { Nav } from '../../src/components/Nav'
import { Footer } from '../../src/components/Footer'
import { CodeBlock } from '../../src/components/CodeBlock'
import { siteConfig } from '../../src/config/site'

const skillTemplateCode = `{
  id: 'your-skill-id',
  name: 'Your Skill Name',
  description: 'A brief description of what your skill does.',
  longDescription: 'A more detailed description...',
  category: 'development', // or 'documents', 'creative', 'productivity', 'business'
  tags: ['tag1', 'tag2', 'tag3'],
  icon: '◈',
  color: 'oklch(0.70 0.15 280)',
  features: [
    'Key feature one',
    'Key feature two',
    'Key feature three',
  ],
  useCases: [
    'Example use case one',
    'Example use case two',
    'Example use case three',
  ],
  compatibility: ['gemini', 'claude'],
  version: '1.0.0',
  lastUpdated: '2026-01-27',
  contributor: {
    name: 'Your Name',
    github: 'your-github-username',
  },
}`

export default function ContributeClient() {
  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Contribute a Skill
          </h1>
          <p
            className="text-lg mb-12"
            style={{ color: 'var(--color-grey-300)' }}
          >
            Built something useful? Share it. Submit your skill to get it listed in the catalog with full attribution.
          </p>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">How it works</h2>
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0"
                    style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--color-white)' }}
                  >
                    1
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Create your skill</h3>
                    <p style={{ color: 'var(--color-grey-300)' }}>
                      Write a markdown file that teaches AI assistants a single focused skill—framework knowledge, coding patterns, or tool usage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0"
                    style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--color-white)' }}
                  >
                    2
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Submit for review</h3>
                    <p style={{ color: 'var(--color-grey-300)' }}>
                      Fill out the submission form. It opens a GitHub issue with your skill details for review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0"
                    style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--color-white)' }}
                  >
                    3
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Review process</h3>
                    <p style={{ color: 'var(--color-grey-300)' }}>
                      Maintainers review your submission for quality, completeness, and fit. Expect feedback or requests for changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0"
                    style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--color-white)' }}
                  >
                    4
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Published</h3>
                    <p style={{ color: 'var(--color-grey-300)' }}>
                      Once approved, your skill gets added to the catalog with full attribution. You'll be credited as the contributor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Skill template</h2>
            <p
              className="mb-6"
              style={{ color: 'var(--color-grey-300)' }}
            >
              Use this template structure when submitting your skill. Every field marked in the template is required for a complete submission.
            </p>
            <div className="glass-card p-6 overflow-x-auto">
              <CodeBlock code={skillTemplateCode} language="javascript" />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Category guidelines</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h3 className="text-base font-medium text-white mb-2">Development</h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  Programming, coding tools, testing, DevOps, frameworks, and developer utilities
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-base font-medium text-white mb-2">Documents</h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  PDF, Word, Excel, presentations, and document-processing tools
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-base font-medium text-white mb-2">Creative</h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  Design, art, animation, visual content, and creative coding
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-base font-medium text-white mb-2">Productivity</h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  Task management, automation, workflows, and productivity tools
                </p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-base font-medium text-white mb-2">Business</h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-300)' }}>
                  Strategy, communication, analysis, and enterprise tools
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Quality guidelines</h2>
            <div className="glass-card p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3" style={{ color: 'var(--color-grey-200)' }}>
                  <span className="text-white mt-0.5">•</span>
                  <span><strong className="text-white">One clear purpose:</strong> Each skill should do one thing well. Combine related features, but don't try to cover everything.</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: 'var(--color-grey-200)' }}>
                  <span className="text-white mt-0.5">•</span>
                  <span><strong className="text-white">Real examples:</strong> Include sample prompts and expected outputs so users know what to expect.</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: 'var(--color-grey-200)' }}>
                  <span className="text-white mt-0.5">•</span>
                  <span><strong className="text-white">Tested:</strong> Try your skill with both Gemini CLI and Claude Code before submitting.</span>
                </li>
                <li className="flex items-start gap-3" style={{ color: 'var(--color-grey-200)' }}>
                  <span className="text-white mt-0.5">•</span>
                  <span><strong className="text-white">No overlap:</strong> Check the existing catalog. If a similar skill exists, consider contributing improvements instead.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">View pending submissions</h2>
            <p
              className="mb-6"
              style={{ color: 'var(--color-grey-300)' }}
            >
              See what skills are being reviewed and track the status of each submission.
            </p>
            <a
              href={`${siteConfig.links.github}/issues?q=is%3Aissue+is%3Aopen+label%3Askill-submission`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--color-white)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View pending submissions
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Ready to submit?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full text-base font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-bg)',
                }}
              >
                Submit a skill
              </Link>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-base font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--color-white)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
