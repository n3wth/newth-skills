import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import '../src/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://skills.newth.ai'),
  title: {
    default: 'Skills for AI Coding Assistants | newth.ai',
    template: '%s | newth.ai',
  },
  description:
    'Extend your AI coding assistant with powerful skills. 50+ curated skills for Claude Code and Gemini CLI. Install in seconds, works offline.',
  authors: [{ name: 'Oliver Newth' }],
  creator: 'Oliver Newth',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skills.newth.ai',
    siteName: 'newth.ai skills',
    title: 'Skills for AI Coding Assistants',
    description:
      'Markdown files that teach Gemini CLI and Claude Code new tricks. Install in seconds, works offline.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Skills for AI Coding Assistants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills for AI Coding Assistants',
    description:
      'Markdown files that teach Gemini CLI and Claude Code new tricks. Install in seconds, works offline.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#3d3d3d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Skills" />
        {/* Inline script for theme to prevent flash - rendering-hydration-no-flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme-preference'),s=window.matchMedia('(prefers-color-scheme: dark)').matches,e=t||(s?'dark':'light');document.documentElement.setAttribute('data-theme',e)})()`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
