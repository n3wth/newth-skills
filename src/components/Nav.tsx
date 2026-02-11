'use client'
import { Nav as BaseNav } from '@n3wth/ui'
import { siteConfig } from '../config/site'
import { useTheme } from '../hooks'

export function Nav() {
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { label: 'Bundles', href: '/curated-bundles' },
    { label: 'Workflows', href: '/workflows' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Contribute', href: '/contribute' },
    { label: 'About', href: '/about' },
    { label: 'GitHub', href: siteConfig.links.github, external: true },
  ]

  return (
    <BaseNav
      logo={siteConfig.name}
      logoHref="/"
      items={navItems}
      theme={theme}
      onThemeToggle={toggleTheme}
      fixed
      hideOnScroll
      className="nav-glass-morphism"
    />
  )
}
