import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'

export function Footer() {
  return (
    <footer className="py-12 md:py-20 px-6 md:px-12 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
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
          <span style={{ color: 'var(--color-grey-600)' }}>|</span>
          <Link
            to="/about"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'var(--color-grey-400)' }}
          >
            What are skills?
          </Link>
        </div>
        <span className="text-sm" style={{ color: 'var(--color-grey-600)' }}>
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
