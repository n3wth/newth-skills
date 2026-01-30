import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

Sentry.init({
  dsn: 'https://27cf6461cdaf6548656e6514aa88f854@o4510781389078528.ingest.us.sentry.io/4510781390323712',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

// Unregister any existing service workers to fix caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister()
    })
  })
  // Clear caches
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name)
      })
    })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
