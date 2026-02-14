'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { siteConfig } from '../config/site'
import { useAuth } from './AuthProvider'

const navItems = [
  { label: 'Bundles', href: '/curated-bundles' },
  { label: 'Workflows', href: '/workflows' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Contribute', href: '/contribute' },
  { label: 'About', href: '/about' },
  { label: 'GitHub', href: siteConfig.links.github, external: true },
]

export function Nav() {
  const { user, profile, signIn, signOut, loading } = useAuth()
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY && y > 64)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const displayName = profile?.display_name || profile?.username || user?.user_metadata?.user_name

  return (
    <nav
      className="nav-glass-morphism fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-grey-300)] hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--color-grey-300)] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}

          {!loading && (
            user ? (
              <div className="flex items-center gap-3 ml-2">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-[var(--glass-border)]"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm text-[var(--color-grey-300)] hover:text-white transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-sm border border-[var(--glass-border)] px-3 py-1.5 rounded-md hover:border-[var(--glass-highlight)] transition-colors"
              >
                Sign in
              </button>
            )
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <>
                <path d="M3 5h14" />
                <path d="M3 10h14" />
                <path d="M3 15h14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--glass-border)] px-4 py-4 flex flex-col gap-3">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-grey-300)]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--color-grey-300)]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}

          {!loading && (
            user ? (
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--glass-border)]">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-[var(--glass-border)]"
                  />
                )}
                <span className="text-sm">{displayName}</span>
                <button
                  onClick={() => { signOut(); setMobileOpen(false) }}
                  className="text-sm text-[var(--color-grey-300)] ml-auto"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signIn(); setMobileOpen(false) }}
                className="text-sm border border-[var(--glass-border)] px-3 py-1.5 rounded-md w-full mt-2"
              >
                Sign in with GitHub
              </button>
            )
          )}
        </div>
      )}
    </nav>
  )
}
