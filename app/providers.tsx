'use client'

import { type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { AuthProvider } from '../src/components/AuthProvider'

// bundle-defer-third-party: Load Sentry after hydration
const SentryInit = dynamic(
  () =>
    import('../src/lib/sentry').then((mod) => {
      mod.initSentry()
      return { default: () => null }
    }),
  { ssr: false }
)

// bundle-defer-third-party: Load analytics after hydration
const AnalyticsInit = dynamic(
  () =>
    import('../src/lib/analytics').then((mod) => {
      mod.reportWebVitals()
      return { default: () => null }
    }),
  { ssr: false }
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <SentryInit />
      <AnalyticsInit />
    </AuthProvider>
  )
}
