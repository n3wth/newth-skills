'use client'

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
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-6">
        {/* Sites */}
        <nav className="flex items-center gap-4">
          {sites.map((site, i) => (
            <span key={site.name} className="flex items-center gap-4">
              {site.current ? (
                <span className="text-sm font-medium" style={{ color: 'var(--color-white)' }}>
                  {site.name}
                </span>
              ) : (
                <a
                  href={site.href}
                  rel="external"
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
        </nav>

        {/* Legal */}
        <nav className="flex items-center gap-3">
          {legal.map((link, i) => (
            <span key={link.name} className="flex items-center gap-3">
              <a
                href={link.href}
                className="transition-colors"
                style={{
                  fontSize: '11px',
                  color: 'var(--color-grey-600)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-grey-400)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-grey-600)'}
              >
                {link.name}
              </a>
              {i < legal.length - 1 && (
                <span style={{ fontSize: '11px', color: 'var(--color-grey-700)' }}>/</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  )
}
