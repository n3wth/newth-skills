'use client'

import Link from 'next/link'
import { siteConfig } from '../config/site'

const sites = [
  { name: 'n3wth', href: 'https://n3wth.com' },
  { name: 'Skills', href: '/', current: true },
  { name: 'Art', href: 'https://newth.art' },
]

const pages = [
  { name: 'About', href: '/about' },
  { name: 'Workflows', href: '/workflows' },
  { name: 'Contribute', href: '/contribute' },
]

export function Footer() {
  return (
    <footer className="py-10 px-6 md:px-12 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="flex flex-col gap-6">
        {/* Page links */}
        <div className="flex flex-wrap items-center gap-4">
          {pages.map((page, i) => (
            <span key={page.name} className="flex items-center gap-4">
              <Link
                href={page.href}
                className="text-sm hover:text-white transition-colors"
                style={{ color: 'var(--color-grey-400)' }}
              >
                {page.name}
              </Link>
              {i < pages.length - 1 && (
                <span style={{ color: 'var(--color-grey-700)' }}>/</span>
              )}
            </span>
          ))}
        </div>

        {/* Sites + Social */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {sites.map((site, i) => (
              <span key={site.name} className="flex items-center gap-4">
                {site.current ? (
                  <span className="text-sm" style={{ color: 'var(--color-white)' }}>
                    {site.name}
                  </span>
                ) : (
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: 'var(--color-grey-500)' }}
                  >
                    {site.name}
                  </a>
                )}
                {i < sites.length - 1 && (
                  <span style={{ color: 'var(--color-grey-700)' }}>/</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-grey-500)' }}>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span style={{ color: 'var(--color-grey-700)' }}>/</span>
            <span style={{ color: 'var(--color-grey-600)' }}>{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
