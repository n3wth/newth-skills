'use client'

import Link from 'next/link'

const sites = [
  { name: 'n3wth', href: 'https://n3wth.com' },
  { name: 'Skills', href: '/', current: true },
  { name: 'UI', href: 'https://ui.n3wth.com' },
  { name: 'Garden', href: 'https://garden.n3wth.com' },
]

const legal = [
  { name: 'Terms', href: '/terms' },
  { name: 'Privacy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="py-10 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Sites */}
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

        {/* Legal */}
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-grey-500)' }}>
          {legal.map((link, i) => (
            <span key={link.name} className="flex items-center gap-4">
              <Link
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
              {i < legal.length - 1 && (
                <span style={{ color: 'var(--color-grey-700)' }}>/</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
