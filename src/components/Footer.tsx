import { siteConfig } from '../config/site'

export function Footer() {
  return (
    <footer className="py-12 md:py-20 px-6 md:px-12">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
          Built by {siteConfig.author}
        </p>
        <span className="text-sm" style={{ color: 'var(--color-grey-600)' }}>
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
