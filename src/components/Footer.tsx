'use client'

import Link from 'next/link'
import { NavLink } from '@n3wth/ui'
import { siteConfig } from '../config/site'
import { useScrollReveal } from '../hooks'

export function Footer() {
  const footerRef = useScrollReveal({ direction: 'up', distance: 20, duration: 0.7 })

  return (
    <footer ref={footerRef} className="py-12 md:py-20 px-6 md:px-12 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/about"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            What are skills?
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            href="/workflows"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Workflows
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            href="/curated-bundles"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Curated Bundles
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            href="/contribute"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Contribute
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            href="/contact"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Contact
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            href="/privacy"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Privacy
          </Link>
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <NavLink
            href={siteConfig.links.github}
            variant="default"
            className="text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </NavLink>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
            Made by{' '}
            <a
              href={siteConfig.links.about}
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.author}
            </a>
          </p>
          <span className="text-sm" style={{ color: 'var(--color-grey-600)' }}>
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
