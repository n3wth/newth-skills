import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'

export function Nav() {
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-3 md:py-4 flex items-center justify-between">
      <Link
        to="/"
        className="text-base md:text-lg font-semibold hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-accent)' }}
      >
        {siteConfig.name}
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          to="/about"
          className="text-sm link-hover"
          style={{ color: 'var(--color-grey-400)' }}
        >
          About
        </Link>
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm link-hover"
          style={{ color: 'var(--color-grey-400)' }}
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}
