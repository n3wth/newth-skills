import type { Metadata, Viewport } from 'next'
import { AxiomWebVitals } from 'next-axiom'
import { Providers } from './providers'
import { PostHogProvider } from '../src/components/PostHogProvider'
import '../src/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://skills.newth.ai'),
  title: {
    default: 'n3wth/skills - AI Coding Assistant Skills',
    template: '%s | n3wth/skills',
  },
  description:
    'Extend your AI coding assistant with ready-made skills. More than 50 curated skills for Gemini CLI, Claude Code, and Cursor. Install in seconds and work offline.',
  authors: [{ name: 'Oliver Newth' }],
  creator: 'Oliver Newth',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skills.newth.ai',
    siteName: 'n3wth/skills',
    title: 'n3wth/skills - AI Coding Assistant Skills',
    description:
      'Markdown files that give Gemini CLI, Claude Code, and Cursor new capabilities. Install in seconds and work offline.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Skills for AI coding assistants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n3wth/skills - AI Coding Assistant Skills',
    description:
      'Markdown files that give Gemini CLI, Claude Code, and Cursor new capabilities. Install in seconds and work offline.',
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <AxiomWebVitals />
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Skills" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <Providers>{children}</Providers>
        </PostHogProvider>
      </body>
    </html>
  )
}
