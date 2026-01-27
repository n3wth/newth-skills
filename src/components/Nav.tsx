import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { useTheme } from '../hooks'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full transition-all duration-200 hover:opacity-70 min-w-[44px] min-h-[44px] flex items-center justify-center"
      style={{ color: 'var(--color-grey-400)' }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300"
    >
      {isOpen ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  )
}

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-[60] px-6 md:px-12 py-3 md:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-base md:text-lg font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-accent)' }}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/workflows"
            className="text-sm link-hover"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Workflows
          </Link>
          <Link
            to="/playground"
            className="text-sm link-hover"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Playground
          </Link>
          <Link
            to="/contribute"
            className="text-sm link-hover"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Contribute
          </Link>
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
          <ThemeToggle />
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-all duration-200 hover:opacity-70"
          style={{ color: 'var(--color-grey-400)' }}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <HamburgerIcon isOpen={isMenuOpen} />
        </button>
      </nav>

      <div
        className={`mobile-menu-overlay md:hidden fixed inset-0 z-[55] transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      <div
        className={`mobile-menu-drawer md:hidden fixed top-0 right-0 z-[56] h-full w-[280px] max-w-[80vw] transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-bg)',
          borderLeft: '1px solid var(--glass-border)',
        }}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              Home
            </Link>
            <Link
              to="/workflows"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              Workflows
            </Link>
            <Link
              to="/playground"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              Playground
            </Link>
            <Link
              to="/contribute"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              Contribute
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              About
            </Link>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mobile-nav-link text-lg py-4 px-4 rounded-xl transition-all duration-200 min-h-[52px] flex items-center"
              style={{ color: 'var(--color-white)' }}
            >
              GitHub
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 opacity-50"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="flex items-center justify-between px-4">
              <span className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
