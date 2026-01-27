import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { useTheme } from '../hooks'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-200 hover:opacity-70"
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
          to="/submit"
          className="text-sm link-hover"
          style={{ color: 'var(--color-grey-400)' }}
        >
          Submit
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
    </nav>
  )
}
